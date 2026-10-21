from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
import requests
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Form, Depends
from fastapi.responses import Response as FileResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

# ---------------------------------------------------------------- DB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------- Auth helpers
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def set_auth_cookie(response: Response, token: str):
    response.set_cookie(key="access_token", value=token, httponly=True, secure=True,
                        samesite="none", max_age=43200, path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non autenticato")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token non valido")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utente non trovato")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessione scaduta")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token non valido")

# ---------------------------------------------------------------- Object storage
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "emsafety"
storage_key = None

def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": key, "Content-Type": content_type},
                        data=data, timeout=120)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                            headers={"X-Storage-Key": key, "Content-Type": content_type},
                            data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

MIME_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
              "gif": "image/gif", "webp": "image/webp"}

# ---------------------------------------------------------------- Email (Emergent managed Resend)
import re as _re
import ipaddress as _ipaddress
import httpx as _httpx
from html import escape as _escape
from html.parser import HTMLParser as _HTMLParser
from urllib.parse import urlparse as _urlparse

EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "E.M Safety")
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL", "")

import smtplib as _smtplib
import ssl as _ssl
import asyncio as _asyncio
from email.message import EmailMessage as _EmailMessage
from email.utils import formataddr as _formataddr
from cryptography.fernet import Fernet as _Fernet

_FERNET = _Fernet(os.environ["EMAIL_CREDENTIALS_KEY"].encode())

async def get_email_settings_doc():
    return await db.settings.find_one({"_id": "email"})

def email_settings_public(s):
    s = s or {}
    return {
        "sender_email": s.get("sender_email", ""),
        "sender_name": s.get("sender_name", EMAIL_FROM_NAME),
        "receiver_email": s.get("receiver_email", NOTIFY_EMAIL),
        "cc_email": s.get("cc_email", ""),
        "enabled": bool(s.get("enabled", False)),
        "has_app_password": bool(s.get("app_password_enc")),
    }

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = _re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", _re.I)

def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        _ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)

def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)

class _EmailScan(_HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []
    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []
    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []

def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email")
    body = f"{subject}\n{html}".lower()
    for ph in _CRED_ASK:
        if ph in body:
            raise ValueError(f"Credential ask in email: {ph!r}")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links must be absolute https: {url!r}")
        host = _urlparse(low).hostname or ""
        if not _host_ok(host) or _urlparse(low).username is not None:
            raise ValueError(f"Bad URL host: {url!r}")
    for href, text in scan.anchors:
        real = _urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != link host {real!r}")

def _smtp_send(cfg: dict, subject: str, html: str) -> None:
    _assert_safe_email(subject, html)
    password = _FERNET.decrypt(cfg["app_password_enc"].encode()).decode()
    sender = cfg["sender_email"]
    recipients = [cfg["receiver_email"]] + ([cfg["cc_email"]] if cfg.get("cc_email") else [])
    msg = _EmailMessage()
    msg["From"] = _formataddr((cfg.get("sender_name") or EMAIL_FROM_NAME, sender))
    msg["To"] = cfg["receiver_email"]
    if cfg.get("cc_email"):
        msg["Cc"] = cfg["cc_email"]
    msg["Subject"] = subject
    msg.set_content("Apri questa email in un client che supporta HTML.")
    msg.add_alternative(html, subtype="html")
    with _smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as smtp:
        smtp.ehlo()
        smtp.starttls(context=_ssl.create_default_context())
        smtp.ehlo()
        smtp.login(sender, password)
        smtp.send_message(msg, from_addr=sender, to_addrs=recipients)

async def send_inquiry_notification(cfg: dict, q: dict) -> None:
    subject = f"Nuova richiesta dal sito — {q.get('name', '')}"
    html = _inquiry_email_html(q, cfg.get("sender_name") or EMAIL_FROM_NAME)
    await _asyncio.to_thread(_smtp_send, cfg, subject, html)

def _inquiry_email_html(q: dict, from_name: str = EMAIL_FROM_NAME) -> str:
    def row(label: str, value: str) -> str:
        v = _escape(value) if value else "—"
        return (f'<tr><td style="padding:7px 0;color:#71717a;font-size:13px;width:120px;vertical-align:top">{label}</td>'
                f'<td style="padding:7px 0;font-size:14px;color:#171717">{v}</td></tr>')
    return (
        '<table role="presentation" width="100%" style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">'
        '<tr><td>'
        '<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;'
        'border-radius:12px;padding:24px;margin:0 auto">'
        f'<tr><td style="font-size:18px;font-weight:bold;color:#171717;padding-bottom:12px">Nuova richiesta dal sito {_escape(from_name)}</td></tr>'
        '<tr><td><table role="presentation" width="100%">'
        + row("Nome", q.get("name", ""))
        + row("Azienda", q.get("company", ""))
        + row("Email", q.get("email", ""))
        + row("Telefono", q.get("phone", ""))
        + row("Servizio", q.get("service", ""))
        + row("Messaggio", q.get("message", ""))
        + '</table></td></tr>'
        f'<tr><td style="padding-top:16px;font-size:12px;color:#9ca3af">Ricevuta dal modulo Contatti di {_escape(EMAIL_FROM_NAME)}. '
        'Trovi tutte le richieste nel pannello admin, sezione Richieste.</td></tr>'
        '</table></td></tr></table>'
    )

# ---------------------------------------------------------------- Models
class LoginInput(BaseModel):
    email: str
    password: str

class StoryInput(BaseModel):
    title: str
    sector: Optional[str] = ""
    summary: str
    content: str
    cover_path: Optional[str] = None

class Story(BaseModel):
    id: str
    title: str
    sector: str = ""
    summary: str
    content: str
    cover_path: Optional[str] = None
    cover_url: Optional[str] = None
    created_at: str

def story_public(doc: dict) -> dict:
    cover_path = doc.get("cover_path")
    return {
        "id": doc["id"],
        "title": doc.get("title", ""),
        "sector": doc.get("sector", ""),
        "summary": doc.get("summary", ""),
        "content": doc.get("content", ""),
        "cover_path": cover_path,
        "cover_url": f"/api/files/{cover_path}" if cover_path else None,
        "created_at": doc.get("created_at"),
    }

# ---------------------------------------------------------------- Auth routes
@api_router.post("/auth/login")
async def login(data: LoginInput, response: Response):
    email = data.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenziali non valide")
    token = create_access_token(str(user["_id"]), email)
    set_auth_cookie(response, token)
    return {"id": str(user["_id"]), "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}

@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

# ---------------------------------------------------------------- Upload
@api_router.post("/uploads")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    ext = (file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin")
    content_type = MIME_TYPES.get(ext, file.content_type or "application/octet-stream")
    path = f"{APP_NAME}/stories/{uuid.uuid4()}.{ext}"
    data = await file.read()
    result = put_object(path, data, content_type)
    canonical = result.get("path", path)
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": canonical,
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": canonical, "url": f"/api/files/{canonical}"}

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File non trovato")
    data, content_type = get_object(path)
    return FileResponse(content=data, media_type=record.get("content_type", content_type),
                        headers={"Cache-Control": "public, max-age=86400"})

# ---------------------------------------------------------------- Stories
@api_router.get("/stories")
async def list_stories():
    docs = await db.stories.find({"is_deleted": {"$ne": True}}).sort([("order", 1), ("created_at", 1)]).to_list(1000)
    return [story_public(d) for d in docs]

class ReorderInput(BaseModel):
    ids: List[str]

@api_router.post("/stories/reorder")
async def reorder_stories(data: ReorderInput, user: dict = Depends(get_current_user)):
    for index, sid in enumerate(data.ids):
        await db.stories.update_one({"id": sid}, {"$set": {"order": index}})
    return {"ok": True}

@api_router.get("/stories/{story_id}")
async def get_story(story_id: str):
    doc = await db.stories.find_one({"id": story_id, "is_deleted": {"$ne": True}})
    if not doc:
        raise HTTPException(status_code=404, detail="Storia non trovata")
    return story_public(doc)

@api_router.post("/stories")
async def create_story(data: StoryInput, user: dict = Depends(get_current_user)):
    doc = {
        "id": str(uuid.uuid4()),
        "title": data.title,
        "sector": data.sector or "",
        "summary": data.summary,
        "content": data.content,
        "cover_path": data.cover_path,
        "is_deleted": False,
        "order": datetime.now(timezone.utc).timestamp(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.stories.insert_one(doc)
    return story_public(doc)

@api_router.put("/stories/{story_id}")
async def update_story(story_id: str, data: StoryInput, user: dict = Depends(get_current_user)):
    update = {"title": data.title, "sector": data.sector or "", "summary": data.summary,
              "content": data.content}
    if data.cover_path is not None:
        update["cover_path"] = data.cover_path
    res = await db.stories.update_one({"id": story_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Storia non trovata")
    doc = await db.stories.find_one({"id": story_id})
    return story_public(doc)

@api_router.delete("/stories/{story_id}")
async def delete_story(story_id: str, user: dict = Depends(get_current_user)):
    res = await db.stories.update_one({"id": story_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Storia non trovata")
    return {"ok": True}

# ---------------------------------------------------------------- Admin: client accounts
class ClientInput(BaseModel):
    email: str
    password: str
    name: Optional[str] = ""

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Accesso riservato all'amministratore")
    return user

def user_public(doc: dict) -> dict:
    return {"id": str(doc["_id"]), "email": doc["email"], "name": doc.get("name", ""),
            "role": doc.get("role", "client"), "created_at": doc.get("created_at")}

@api_router.get("/admin/clients")
async def list_clients(admin: dict = Depends(require_admin)):
    docs = await db.users.find({"role": "client"}).sort("created_at", -1).to_list(500)
    return [user_public(d) for d in docs]

@api_router.post("/admin/clients")
async def create_client(data: ClientInput, admin: dict = Depends(require_admin)):
    email = data.email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Email non valida")
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="La password deve avere almeno 8 caratteri")
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email già registrata")
    doc = {"email": email, "password_hash": hash_password(data.password),
           "name": data.name or "Cliente", "role": "client",
           "created_at": datetime.now(timezone.utc).isoformat()}
    res = await db.users.insert_one(doc)
    doc["_id"] = res.inserted_id
    return user_public(doc)

@api_router.delete("/admin/clients/{client_id}")
async def delete_client(client_id: str, admin: dict = Depends(require_admin)):
    res = await db.users.delete_one({"_id": ObjectId(client_id), "role": "client"})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cliente non trovato")
    return {"ok": True}

# ---------------------------------------------------------------- Inquiries
class InquiryInput(BaseModel):
    name: str
    company: Optional[str] = ""
    email: str
    phone: Optional[str] = ""
    service: Optional[str] = ""
    message: str

def inquiry_public(doc: dict) -> dict:
    return {"id": doc["id"], "name": doc.get("name", ""), "company": doc.get("company", ""),
            "email": doc.get("email", ""), "phone": doc.get("phone", ""),
            "service": doc.get("service", ""), "message": doc.get("message", ""),
            "status": doc.get("status", "nuova"), "created_at": doc.get("created_at")}

@api_router.post("/inquiries")
async def create_inquiry(data: InquiryInput):
    doc = {"id": str(uuid.uuid4()), "name": data.name.strip(), "company": data.company or "",
           "email": data.email.strip().lower(), "phone": data.phone or "",
           "service": data.service or "", "message": data.message.strip(),
           "status": "nuova", "is_deleted": False,
           "created_at": datetime.now(timezone.utc).isoformat()}
    await db.inquiries.insert_one(doc)
    cfg = await get_email_settings_doc()
    if cfg and cfg.get("enabled") and cfg.get("app_password_enc") and cfg.get("receiver_email"):
        try:
            await send_inquiry_notification(cfg, doc)
        except Exception as e:
            logger.error("Inquiry notification email failed: %s", type(e).__name__)
    return inquiry_public(doc)

@api_router.get("/inquiries")
async def list_inquiries(admin: dict = Depends(require_admin)):
    docs = await db.inquiries.find({"is_deleted": {"$ne": True}}).sort("created_at", -1).to_list(1000)
    return [inquiry_public(d) for d in docs]

@api_router.patch("/inquiries/{inquiry_id}")
async def update_inquiry(inquiry_id: str, data: dict, admin: dict = Depends(require_admin)):
    status = data.get("status")
    if status not in ("nuova", "letta"):
        raise HTTPException(status_code=400, detail="Stato non valido")
    res = await db.inquiries.update_one({"id": inquiry_id}, {"$set": {"status": status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    doc = await db.inquiries.find_one({"id": inquiry_id})
    return inquiry_public(doc)

@api_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, admin: dict = Depends(require_admin)):
    res = await db.inquiries.update_one({"id": inquiry_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    return {"ok": True}

# ---------------------------------------------------------------- Email settings (admin)
class EmailSettingsInput(BaseModel):
    sender_email: str = ""
    app_password: Optional[str] = None
    sender_name: str = ""
    receiver_email: str = ""
    cc_email: Optional[str] = ""
    enabled: bool = False

@api_router.get("/admin/email-settings")
async def get_email_settings(admin: dict = Depends(require_admin)):
    return email_settings_public(await get_email_settings_doc())

@api_router.put("/admin/email-settings")
async def put_email_settings(data: EmailSettingsInput, admin: dict = Depends(require_admin)):
    old = await get_email_settings_doc() or {}
    doc = {
        "_id": "email",
        "sender_email": data.sender_email.strip().lower(),
        "sender_name": (data.sender_name or EMAIL_FROM_NAME).strip(),
        "receiver_email": data.receiver_email.strip().lower(),
        "cc_email": (data.cc_email or "").strip().lower(),
        "enabled": bool(data.enabled),
    }
    if data.app_password:
        doc["app_password_enc"] = _FERNET.encrypt(data.app_password.encode()).decode()
    elif old.get("app_password_enc"):
        doc["app_password_enc"] = old["app_password_enc"]
    await db.settings.replace_one({"_id": "email"}, doc, upsert=True)
    return email_settings_public(doc)

@api_router.post("/admin/email-settings/test")
async def test_email_settings(admin: dict = Depends(require_admin)):
    cfg = await get_email_settings_doc()
    if not cfg or not cfg.get("app_password_enc") or not cfg.get("sender_email") or not cfg.get("receiver_email"):
        raise HTTPException(status_code=422, detail="Configurazione email incompleta: inserisci mittente, App Password e destinatario.")
    html = "<html><body style='font-family:Arial,sans-serif'><h2 style='color:#0b2545'>Test E.M Safety</h2><p>La configurazione email SMTP funziona correttamente. Le nuove richieste dal sito arriveranno a questo indirizzo.</p></body></html>"
    try:
        await _asyncio.to_thread(_smtp_send, cfg, "Test configurazione email — E.M Safety", html)
    except Exception as e:
        logger.error("SMTP test failed: %s", type(e).__name__)
        raise HTTPException(status_code=400, detail="Invio email di test non riuscito. Verifica email mittente e App Password Google.")
    return {"ok": True}

# ---------------------------------------------------------------- Site assets (media manager)
@api_router.get("/site-assets")
async def get_site_assets():
    docs = await db.site_assets.find({}).to_list(1000)
    return {d["key"]: d["url"] for d in docs}

@api_router.post("/site-assets")
async def set_site_asset(key: str = Form(...), file: UploadFile = File(...), admin: dict = Depends(require_admin)):
    ext = (file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin")
    content_type = MIME_TYPES.get(ext, file.content_type or "application/octet-stream")
    path = f"{APP_NAME}/site/{uuid.uuid4()}.{ext}"
    data = await file.read()
    result = put_object(path, data, content_type)
    canonical = result.get("path", path)
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": canonical,
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    url = f"/api/files/{canonical}"
    await db.site_assets.replace_one(
        {"key": key},
        {"key": key, "url": url, "updated_at": datetime.now(timezone.utc).isoformat()},
        upsert=True,
    )
    return {"key": key, "url": url}

class AssetKey(BaseModel):
    key: str

@api_router.post("/site-assets/reset")
async def reset_site_asset(data: AssetKey, admin: dict = Depends(require_admin)):
    await db.site_assets.delete_one({"key": data.key})
    return {"ok": True}

# ---------------------------------------------------------------- Site content (editable texts)
class ContentInput(BaseModel):
    items: dict

@api_router.get("/site-content")
async def get_site_content():
    docs = await db.site_content.find({}).to_list(10000)
    return {d["key"]: d["value"] for d in docs}

@api_router.put("/site-content")
async def put_site_content(data: ContentInput, admin: dict = Depends(require_admin)):
    now = datetime.now(timezone.utc).isoformat()
    for key, value in data.items.items():
        await db.site_content.replace_one({"key": key}, {"key": key, "value": str(value), "updated_at": now}, upsert=True)
    return {"ok": True, "count": len(data.items)}

@api_router.post("/site-content/reset")
async def reset_site_content(data: AssetKey, admin: dict = Depends(require_admin)):
    await db.site_content.delete_one({"key": data.key})
    return {"ok": True}

# ---------------------------------------------------------------- Logos (clients / group / affiliations)
LOGO_SECTIONS = ("clients", "group", "affiliations")

DEFAULT_LOGOS = {
    "clients": [
        ("Ecoflam", "/assets/images/clients/ecoflam.png", "", False),
        ("Brivio & Viganò", "/assets/images/clients/brivio-vigano.png", "", False),
        ("SITA", "/assets/images/clients/sita.png", "", False),
        ("GXO", "/assets/images/clients/gxo.png", "", False),
        ("Elco", "/assets/images/clients/elco.png", "", False),
        ("SIMI Group", "/assets/images/clients/simi-group.png", "", True),
        ("Auto Ghinzani", "/assets/images/clients/autoghinzani.png", "", False),
        ("SFRE", "/assets/images/clients/sfre.png", "", False),
        ("Ariston Group", "/assets/images/clients/ariston-group.png", "", False),
        ("Thermowatt", "/assets/images/clients/thermowatt.png", "", False),
        ("H.Essers", "/assets/images/clients/hessers.png", "", False),
        ("Igeam Consulting", "/assets/images/clients/igeam.png", "", False),
        ("Omnia Professional Advisor", "/assets/images/clients/omnia.png", "", False),
    ],
    "group": [
        ("SA.R.M.ED Safety", "/assets/images/group/sarmed-safety.png", "Consulenza e formazione per la sicurezza sul lavoro, D.Lgs 81/08.", False),
        ("Cruscotto SGI", "/assets/images/group/cruscotto-sgi.png", "La piattaforma digitale per governare i Sistemi di Gestione Integrati.", False),
        ("SA.R.M.ED Engineering", "/assets/images/group/sarmed-engineering.png", "Ingegneria e progettazione tecnica al servizio dell\u2019impresa.", False),
        ("EM Consulting", "/assets/images/group/em-consulting.png", "Advisory strategico, conformità normativa e sviluppo organizzativo.", False),
    ],
    "affiliations": [
        ("ANFOS", "/assets/images/anfos.png", "Centro di Formazione — Associazione Nazionale Formatori della Sicurezza sul Lavoro (L. 4/2013).", False),
        ("O.P.N. Italia Lavoro", "/assets/images/opn.png", "Organismo Paritetico Nazionale per la salute e sicurezza nei luoghi di lavoro.", False),
        ("DAN Partner", "/assets/images/dan.png", "Partner ufficiale Divers Alert Network per la sicurezza e il primo soccorso.", False),
    ],
}

def logo_public(d: dict) -> dict:
    return {"id": d["id"], "section": d["section"], "name": d.get("name", ""),
            "description": d.get("description", ""), "image_url": d.get("image_url", ""),
            "dark": bool(d.get("dark", False)), "order": d.get("order", 0)}

async def store_site_file(file: UploadFile, folder: str) -> str:
    ext = (file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin")
    content_type = MIME_TYPES.get(ext, file.content_type or "application/octet-stream")
    path = f"{APP_NAME}/{folder}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    result = put_object(path, data, content_type)
    canonical = result.get("path", path)
    await db.files.insert_one({
        "id": str(uuid.uuid4()), "storage_path": canonical, "original_filename": file.filename,
        "content_type": content_type, "size": result.get("size", len(data)),
        "is_deleted": False, "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return f"/api/files/{canonical}"

@api_router.get("/logos")
async def list_logos(section: Optional[str] = None):
    query = {"section": section} if section else {}
    docs = await db.logos.find(query).sort([("order", 1), ("created_at", 1)]).to_list(1000)
    return [logo_public(d) for d in docs]

@api_router.post("/logos")
async def create_logo(section: str = Form(...), name: str = Form(...), description: str = Form(""),
                      dark: bool = Form(False), file: UploadFile = File(...), admin: dict = Depends(require_admin)):
    if section not in LOGO_SECTIONS:
        raise HTTPException(status_code=400, detail="Sezione non valida")
    if not name.strip():
        raise HTTPException(status_code=400, detail="Il nome è obbligatorio")
    url = await store_site_file(file, "logos")
    count = await db.logos.count_documents({"section": section})
    doc = {"id": str(uuid.uuid4()), "section": section, "name": name.strip(), "description": description.strip(),
           "image_url": url, "dark": dark, "order": count,
           "created_at": datetime.now(timezone.utc).isoformat()}
    await db.logos.insert_one(doc)
    return logo_public(doc)

@api_router.put("/logos/{logo_id}")
async def update_logo(logo_id: str, name: Optional[str] = Form(None), description: Optional[str] = Form(None),
                      dark: Optional[bool] = Form(None), file: Optional[UploadFile] = File(None),
                      admin: dict = Depends(require_admin)):
    update: dict = {}
    if name is not None:
        update["name"] = name.strip()
    if description is not None:
        update["description"] = description.strip()
    if dark is not None:
        update["dark"] = dark
    if file is not None and file.filename:
        update["image_url"] = await store_site_file(file, "logos")
    if not update:
        raise HTTPException(status_code=400, detail="Nessuna modifica")
    res = await db.logos.update_one({"id": logo_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Logo non trovato")
    return logo_public(await db.logos.find_one({"id": logo_id}))

@api_router.delete("/logos/{logo_id}")
async def delete_logo(logo_id: str, admin: dict = Depends(require_admin)):
    res = await db.logos.delete_one({"id": logo_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Logo non trovato")
    return {"ok": True}

@api_router.post("/logos/reorder")
async def reorder_logos(data: ReorderInput, admin: dict = Depends(require_admin)):
    for index, lid in enumerate(data.ids):
        await db.logos.update_one({"id": lid}, {"$set": {"order": index}})
    return {"ok": True}

async def seed_logos():
    for section, items in DEFAULT_LOGOS.items():
        if await db.logos.count_documents({"section": section}) > 0:
            continue
        now = datetime.now(timezone.utc).isoformat()
        await db.logos.insert_many([
            {"id": str(uuid.uuid4()), "section": section, "name": name, "description": desc,
             "image_url": url, "dark": dark, "order": i, "created_at": now}
            for i, (name, url, desc, dark) in enumerate(items)
        ])
        logger.info("Seeded %d logos for %s", len(items), section)

# ---------------------------------------------------------------- Visitor tracking + stats
class VisitInput(BaseModel):
    path: str = "/"

@api_router.post("/track/visit")
async def track_visit(data: VisitInput):
    now = datetime.now(timezone.utc)
    await db.visits.insert_one({
        "path": (data.path or "/")[:200],
        "day": now.strftime("%Y-%m-%d"),
        "created_at": now.isoformat(),
    })
    return {"ok": True}

@api_router.get("/admin/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    days = 14
    today = datetime.now(timezone.utc).date()
    day_keys = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days - 1, -1, -1)]
    vagg: dict = {}
    async for d in db.visits.aggregate([{"$group": {"_id": "$day", "count": {"$sum": 1}}}]):
        vagg[d["_id"]] = d["count"]
    inq = await db.inquiries.find({"is_deleted": {"$ne": True}}).to_list(100000)
    ipd: dict = {}
    for q in inq:
        d = (q.get("created_at") or "")[:10]
        ipd[d] = ipd.get(d, 0) + 1
    series = [{"day": d, "visitors": vagg.get(d, 0), "inquiries": ipd.get(d, 0)} for d in day_keys]
    return {
        "series": series,
        "totals": {
            "visitors": await db.visits.count_documents({}),
            "visits_today": vagg.get(today.strftime("%Y-%m-%d"), 0),
            "inquiries": await db.inquiries.count_documents({"is_deleted": {"$ne": True}}),
            "new_inquiries": await db.inquiries.count_documents({"is_deleted": {"$ne": True}, "status": "nuova"}),
            "stories": await db.stories.count_documents({"is_deleted": {"$ne": True}}),
            "clients": await db.users.count_documents({"role": "client"}),
            "new_enrollments": await db.enrollments.count_documents({"is_deleted": {"$ne": True}, "status": "nuova"}),
            "certificates": await db.certificates.count_documents({"is_deleted": {"$ne": True}}),
        },
    }

# ================================================================ Formazione: date helpers
import secrets as _secrets
from datetime import date as _date

try:
    from zoneinfo import ZoneInfo as _ZoneInfo
    _ROME = _ZoneInfo("Europe/Rome")
except Exception:  # tzdata missing → fall back to UTC
    _ROME = timezone.utc

def _today() -> _date:
    return datetime.now(_ROME).date()

def _parse_date(value: Optional[str], field: str, required: bool = True) -> Optional[_date]:
    """Accepts YYYY-MM-DD or DD/MM/YYYY. Returns a date or raises 400 with an Italian message."""
    v = (value or "").strip()
    if not v:
        if required:
            raise HTTPException(status_code=400, detail=f"Campo obbligatorio mancante: {field}")
        return None
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y"):
        try:
            return datetime.strptime(v, fmt).date()
        except ValueError:
            continue
    raise HTTPException(status_code=400, detail=f"Data non valida per '{field}': usa il formato GG/MM/AAAA")

def _add_years(d: _date, years: int) -> _date:
    try:
        return d.replace(year=d.year + years)
    except ValueError:  # 29 febbraio → 28 febbraio
        return d.replace(year=d.year + years, day=28)

def _clean(v: Optional[str], limit: int = 300) -> str:
    return (v or "").strip()[:limit]

_EMAIL_RE = _re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# ================================================================ Attestati (certificati) + verifica QR
_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"  # niente 0/O/1/I per evitare errori di lettura

def _new_cert_code(year: int) -> str:
    rnd = "".join(_secrets.choice(_CODE_ALPHABET) for _ in range(8))
    return f"EMS-{year}-{rnd[:4]}-{rnd[4:]}"

def _normalize_code(code: str) -> str:
    return _re.sub(r"\s+", "", (code or "")).upper()

class CertificateInput(BaseModel):
    first_name: str
    last_name: str
    birth_place: str
    birth_date: str
    course_type: str
    course_date: str
    course_end_date: Optional[str] = ""
    course_hours: Optional[float] = None
    validity_years: Optional[int] = None   # None / 0 = nessuna scadenza
    tax_code: Optional[str] = ""
    notes: Optional[str] = ""              # nota interna, non pubblica

class CertificateBulkInput(BaseModel):
    items: List[CertificateInput]

class RevokeInput(BaseModel):
    revoked: bool

def _cert_fields(data: CertificateInput) -> dict:
    first, last = _clean(data.first_name, 80), _clean(data.last_name, 80)
    place, ctype = _clean(data.birth_place, 120), _clean(data.course_type, 200)
    if not first or not last:
        raise HTTPException(status_code=400, detail="Nome e cognome sono obbligatori")
    if not place:
        raise HTTPException(status_code=400, detail="Il luogo di nascita è obbligatorio")
    if not ctype:
        raise HTTPException(status_code=400, detail="La tipologia del corso è obbligatoria")
    birth = _parse_date(data.birth_date, "data di nascita")
    cdate = _parse_date(data.course_date, "data del corso")
    cend = _parse_date(data.course_end_date, "data fine corso", required=False)
    if cend and cend < cdate:
        raise HTTPException(status_code=400, detail="La data di fine corso è precedente alla data di inizio")
    if birth >= cdate:
        raise HTTPException(status_code=400, detail="La data di nascita deve precedere la data del corso")
    validity = data.validity_years or 0
    if validity < 0 or validity > 50:
        raise HTTPException(status_code=400, detail="Validità non valida")
    hours = data.course_hours if data.course_hours and data.course_hours > 0 else None
    last_day = cend or cdate
    return {
        "first_name": first, "last_name": last, "birth_place": place,
        "birth_date": birth.isoformat(), "course_type": ctype,
        "course_date": cdate.isoformat(), "course_end_date": cend.isoformat() if cend else "",
        "course_hours": hours, "validity_years": validity or None,
        "expiry_date": _add_years(last_day, validity).isoformat() if validity else "",
        "tax_code": _clean(data.tax_code, 20).upper(), "notes": _clean(data.notes, 1000),
    }

def _cert_status(doc: dict) -> str:
    if doc.get("revoked"):
        return "revocato"
    exp = doc.get("expiry_date")
    if exp and exp < _today().isoformat():
        return "scaduto"
    return "valido"

def certificate_public(doc: dict) -> dict:
    """Dati mostrati a chiunque scansioni il QR (niente note interne né codice fiscale)."""
    return {
        "code": doc["code"], "first_name": doc.get("first_name", ""), "last_name": doc.get("last_name", ""),
        "birth_place": doc.get("birth_place", ""), "birth_date": doc.get("birth_date", ""),
        "course_type": doc.get("course_type", ""), "course_date": doc.get("course_date", ""),
        "course_end_date": doc.get("course_end_date", ""), "course_hours": doc.get("course_hours"),
        "validity_years": doc.get("validity_years"), "expiry_date": doc.get("expiry_date", ""),
        "status": _cert_status(doc), "issuer": "E.M. Safety S.r.l. — Centro di Formazione",
        "issued_at": (doc.get("created_at") or "")[:10],
    }

def certificate_admin(doc: dict) -> dict:
    out = certificate_public(doc)
    out.update({"id": doc["id"], "tax_code": doc.get("tax_code", ""), "notes": doc.get("notes", ""),
                "revoked": bool(doc.get("revoked")), "course_id": doc.get("course_id"),
                "enrollment_id": doc.get("enrollment_id"), "created_at": doc.get("created_at")})
    return out

async def _insert_certificate(fields: dict, extra: Optional[dict] = None) -> dict:
    year = int(fields["course_date"][:4])
    for _ in range(10):
        code = _new_cert_code(year)
        if not await db.certificates.find_one({"code": code}):
            break
    doc = {"id": str(uuid.uuid4()), "code": code, **fields, "revoked": False, "is_deleted": False,
           "created_at": datetime.now(timezone.utc).isoformat(), **(extra or {})}
    await db.certificates.insert_one(doc)
    return doc

@api_router.get("/certificates/verify/{code}")
async def verify_certificate(code: str):
    doc = await db.certificates.find_one({"code": _normalize_code(code), "is_deleted": {"$ne": True}})
    if not doc:
        raise HTTPException(status_code=404, detail="Nessun attestato trovato con questo codice")
    return certificate_public(doc)

@api_router.get("/admin/certificates")
async def list_certificates(q: Optional[str] = None, admin: dict = Depends(require_admin)):
    query: dict = {"is_deleted": {"$ne": True}}
    if q and q.strip():
        rx = {"$regex": _re.escape(q.strip()), "$options": "i"}
        query["$or"] = [{"code": rx}, {"first_name": rx}, {"last_name": rx}, {"course_type": rx}, {"tax_code": rx}]
    docs = await db.certificates.find(query).sort("created_at", -1).to_list(5000)
    return [certificate_admin(d) for d in docs]

@api_router.post("/admin/certificates")
async def create_certificate(data: CertificateInput, admin: dict = Depends(require_admin)):
    return certificate_admin(await _insert_certificate(_cert_fields(data)))

@api_router.post("/admin/certificates/bulk")
async def create_certificates_bulk(data: CertificateBulkInput, admin: dict = Depends(require_admin)):
    if not data.items:
        raise HTTPException(status_code=400, detail="Nessun partecipante da salvare")
    if len(data.items) > 500:
        raise HTTPException(status_code=400, detail="Massimo 500 attestati per volta")
    prepared, errors = [], []
    for i, item in enumerate(data.items):
        try:
            prepared.append(_cert_fields(item))
        except HTTPException as e:
            errors.append({"row": i + 1, "detail": e.detail})
    if errors:  # tutto o niente: nessun salvataggio parziale
        raise HTTPException(status_code=400, detail="; ".join(f"Riga {e['row']}: {e['detail']}" for e in errors[:10]))
    created = [certificate_admin(await _insert_certificate(f)) for f in prepared]
    return {"created": created}

@api_router.put("/admin/certificates/{cert_id}")
async def update_certificate(cert_id: str, data: CertificateInput, admin: dict = Depends(require_admin)):
    res = await db.certificates.update_one({"id": cert_id, "is_deleted": {"$ne": True}}, {"$set": _cert_fields(data)})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Attestato non trovato")
    return certificate_admin(await db.certificates.find_one({"id": cert_id}))

@api_router.patch("/admin/certificates/{cert_id}/revoke")
async def revoke_certificate(cert_id: str, data: RevokeInput, admin: dict = Depends(require_admin)):
    res = await db.certificates.update_one({"id": cert_id, "is_deleted": {"$ne": True}}, {"$set": {"revoked": data.revoked}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Attestato non trovato")
    return certificate_admin(await db.certificates.find_one({"id": cert_id}))

@api_router.delete("/admin/certificates/{cert_id}")
async def delete_certificate(cert_id: str, admin: dict = Depends(require_admin)):
    res = await db.certificates.update_one({"id": cert_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Attestato non trovato")
    await db.enrollments.update_many({"certificate_id": cert_id}, {"$set": {"certificate_id": None}})
    return {"ok": True}

# ================================================================ Corsi in partenza + iscrizioni
class CourseInput(BaseModel):
    title: str
    subtitle: Optional[str] = ""
    kind: Optional[str] = ""               # es. "Aggiornamento", "Formazione base"
    hours: Optional[float] = None
    modality: Optional[str] = "In presenza"
    legal_ref: Optional[str] = ""
    start_date: str
    end_date: Optional[str] = ""
    schedule: Optional[str] = ""           # es. "8:00–12:00"
    location: Optional[str] = ""
    trainer: Optional[str] = ""
    audience: Optional[str] = ""
    program: List[str] = []
    program_note: Optional[str] = ""
    final_test: Optional[str] = ""
    certificate_note: Optional[str] = ""
    validity_years: Optional[int] = None
    seats: Optional[int] = None            # None / 0 = posti illimitati
    price: Optional[str] = ""
    registration_open: bool = True
    published: bool = True

class EnrollmentInput(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    birth_place: str
    birth_date: str
    company: Optional[str] = ""
    tax_code: Optional[str] = ""
    notes: Optional[str] = ""
    privacy: bool = False
    website: Optional[str] = ""            # honeypot anti-spam: deve restare vuoto

class EnrollmentStatusInput(BaseModel):
    status: str

def _course_fields(data: CourseInput) -> dict:
    title = _clean(data.title, 200)
    if not title:
        raise HTTPException(status_code=400, detail="Il titolo del corso è obbligatorio")
    start = _parse_date(data.start_date, "data di inizio")
    end = _parse_date(data.end_date, "data di fine", required=False)
    if end and end < start:
        raise HTTPException(status_code=400, detail="La data di fine è precedente alla data di inizio")
    seats = data.seats if data.seats and data.seats > 0 else None
    validity = data.validity_years if data.validity_years and data.validity_years > 0 else None
    return {
        "title": title, "subtitle": _clean(data.subtitle, 600), "kind": _clean(data.kind, 60),
        "hours": data.hours if data.hours and data.hours > 0 else None,
        "modality": _clean(data.modality, 80), "legal_ref": _clean(data.legal_ref, 200),
        "start_date": start.isoformat(), "end_date": end.isoformat() if end and end != start else "",
        "schedule": _clean(data.schedule, 120), "location": _clean(data.location, 200),
        "trainer": _clean(data.trainer, 160), "audience": _clean(data.audience, 400),
        "program": [p.strip()[:300] for p in data.program if p and p.strip()][:40],
        "program_note": _clean(data.program_note, 200), "final_test": _clean(data.final_test, 600),
        "certificate_note": _clean(data.certificate_note, 600), "validity_years": validity,
        "seats": seats, "price": _clean(data.price, 80),
        "registration_open": bool(data.registration_open), "published": bool(data.published),
    }

async def _enrolled_count(course_id: str) -> int:
    return await db.enrollments.count_documents({"course_id": course_id, "is_deleted": {"$ne": True},
                                                 "status": {"$ne": "annullata"}})

def _course_last_day(doc: dict) -> str:
    return doc.get("end_date") or doc.get("start_date") or ""

async def course_public(doc: dict) -> dict:
    enrolled = await _enrolled_count(doc["id"])
    seats = doc.get("seats")
    seats_left = max(seats - enrolled, 0) if seats else None
    upcoming = (doc.get("start_date") or "") >= _today().isoformat()
    keys = ("title", "subtitle", "kind", "hours", "modality", "legal_ref", "start_date", "end_date", "schedule",
            "location", "trainer", "audience", "program", "program_note", "final_test", "certificate_note",
            "validity_years", "seats", "price", "registration_open")
    out = {"id": doc["id"], **{k: doc.get(k) for k in keys}}
    out.update({"seats_left": seats_left, "is_full": seats_left == 0 if seats else False,
                "can_enroll": bool(doc.get("registration_open")) and upcoming and not (seats and seats_left == 0)})
    return out

async def course_admin(doc: dict) -> dict:
    out = await course_public(doc)
    out.update({"published": bool(doc.get("published")), "created_at": doc.get("created_at"),
                "enrolled": await _enrolled_count(doc["id"]),
                "new_enrollments": await db.enrollments.count_documents(
                    {"course_id": doc["id"], "is_deleted": {"$ne": True}, "status": "nuova"})})
    return out

@api_router.get("/courses")
async def list_upcoming_courses():
    today = _today().isoformat()
    docs = await db.courses.find({"is_deleted": {"$ne": True}, "published": True}).sort("start_date", 1).to_list(500)
    return [await course_public(d) for d in docs if _course_last_day(d) >= today]

@api_router.get("/courses/{course_id}")
async def get_course(course_id: str):
    doc = await db.courses.find_one({"id": course_id, "is_deleted": {"$ne": True}, "published": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Corso non trovato")
    return await course_public(doc)

def _enrollment_email_html(c: dict, e: dict) -> str:
    def row(label: str, value: str) -> str:
        v = _escape(value) if value else "—"
        return (f'<tr><td style="padding:6px 0;color:#71717a;font-size:13px;width:150px;vertical-align:top">{label}</td>'
                f'<td style="padding:6px 0;font-size:14px;color:#171717">{v}</td></tr>')
    when = c.get("start_date", "")
    try:
        when = datetime.strptime(when, "%Y-%m-%d").strftime("%d/%m/%Y")
    except ValueError:
        pass
    return (
        '<table role="presentation" width="100%" style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px"><tr><td>'
        '<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin:0 auto">'
        '<tr><td style="font-size:18px;font-weight:bold;color:#0b2545;padding-bottom:4px">Nuova iscrizione a un corso</td></tr>'
        f'<tr><td style="font-size:14px;color:#1e6fd9;padding-bottom:14px">{_escape(c.get("title", ""))} — {_escape(when)}</td></tr>'
        '<tr><td><table role="presentation" width="100%">'
        + row("Nome", f'{e.get("first_name", "")} {e.get("last_name", "")}')
        + row("Luogo di nascita", e.get("birth_place", ""))
        + row("Data di nascita", e.get("birth_date", ""))
        + row("Codice fiscale", e.get("tax_code", ""))
        + row("Azienda", e.get("company", ""))
        + row("Email", e.get("email", ""))
        + row("Telefono", e.get("phone", ""))
        + row("Note", e.get("notes", ""))
        + '</table></td></tr>'
        '<tr><td style="padding-top:16px;font-size:12px;color:#9ca3af">Trovi tutte le iscrizioni nel pannello admin, sezione Iscrizioni.</td></tr>'
        '</table></td></tr></table>'
    )

@api_router.post("/courses/{course_id}/enroll")
async def enroll_course(course_id: str, data: EnrollmentInput):
    course = await db.courses.find_one({"id": course_id, "is_deleted": {"$ne": True}, "published": True})
    if not course:
        raise HTTPException(status_code=404, detail="Corso non trovato")
    if (data.website or "").strip():  # bot: risposta finta, nessun salvataggio
        return {"ok": True}
    pub = await course_public(course)
    if not pub["can_enroll"]:
        raise HTTPException(status_code=409, detail="Le iscrizioni a questo corso sono chiuse o i posti sono esauriti")
    if not data.privacy:
        raise HTTPException(status_code=400, detail="È necessario accettare l'informativa privacy")
    first, last = _clean(data.first_name, 80), _clean(data.last_name, 80)
    email, phone = _clean(data.email, 160).lower(), _clean(data.phone, 40)
    place = _clean(data.birth_place, 120)
    if not first or not last or not place or not phone:
        raise HTTPException(status_code=400, detail="Compila tutti i campi obbligatori")
    if not _EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Indirizzo email non valido")
    birth = _parse_date(data.birth_date, "data di nascita")
    if birth >= _today():
        raise HTTPException(status_code=400, detail="Data di nascita non valida")
    dup = await db.enrollments.find_one({"course_id": course_id, "email": email, "is_deleted": {"$ne": True},
                                         "status": {"$ne": "annullata"}, "first_name": first, "last_name": last})
    if dup:
        raise HTTPException(status_code=409, detail="Risulti già iscritto/a a questo corso")
    doc = {"id": str(uuid.uuid4()), "course_id": course_id, "course_title": course.get("title", ""),
           "course_date": course.get("start_date", ""), "first_name": first, "last_name": last,
           "email": email, "phone": phone, "birth_place": place, "birth_date": birth.isoformat(),
           "company": _clean(data.company, 160), "tax_code": _clean(data.tax_code, 20).upper(),
           "notes": _clean(data.notes, 1000), "status": "nuova", "certificate_id": None,
           "is_deleted": False, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.enrollments.insert_one(doc)
    cfg = await get_email_settings_doc()
    if cfg and cfg.get("enabled") and cfg.get("app_password_enc") and cfg.get("receiver_email"):
        try:
            subject = f"Nuova iscrizione: {course.get('title', '')} — {first} {last}"
            await _asyncio.to_thread(_smtp_send, cfg, subject, _enrollment_email_html(course, doc))
        except Exception as e:
            logger.error("Enrollment notification email failed: %s", type(e).__name__)
    return {"ok": True}

def enrollment_admin(doc: dict) -> dict:
    keys = ("course_id", "course_title", "course_date", "first_name", "last_name", "email", "phone",
            "birth_place", "birth_date", "company", "tax_code", "notes", "status", "certificate_id", "created_at")
    return {"id": doc["id"], **{k: doc.get(k) for k in keys}}

@api_router.get("/admin/courses")
async def admin_list_courses(admin: dict = Depends(require_admin)):
    docs = await db.courses.find({"is_deleted": {"$ne": True}}).sort("start_date", -1).to_list(2000)
    return [await course_admin(d) for d in docs]

@api_router.post("/admin/courses")
async def admin_create_course(data: CourseInput, admin: dict = Depends(require_admin)):
    doc = {"id": str(uuid.uuid4()), **_course_fields(data), "is_deleted": False,
           "created_at": datetime.now(timezone.utc).isoformat()}
    await db.courses.insert_one(doc)
    return await course_admin(doc)

@api_router.put("/admin/courses/{course_id}")
async def admin_update_course(course_id: str, data: CourseInput, admin: dict = Depends(require_admin)):
    fields = _course_fields(data)
    res = await db.courses.update_one({"id": course_id, "is_deleted": {"$ne": True}}, {"$set": fields})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Corso non trovato")
    await db.enrollments.update_many({"course_id": course_id},
                                     {"$set": {"course_title": fields["title"], "course_date": fields["start_date"]}})
    return await course_admin(await db.courses.find_one({"id": course_id}))

@api_router.delete("/admin/courses/{course_id}")
async def admin_delete_course(course_id: str, admin: dict = Depends(require_admin)):
    res = await db.courses.update_one({"id": course_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Corso non trovato")
    return {"ok": True}

@api_router.get("/admin/enrollments")
async def admin_list_enrollments(course_id: Optional[str] = None, admin: dict = Depends(require_admin)):
    query: dict = {"is_deleted": {"$ne": True}}
    if course_id:
        query["course_id"] = course_id
    docs = await db.enrollments.find(query).sort("created_at", -1).to_list(10000)
    return [enrollment_admin(d) for d in docs]

@api_router.patch("/admin/enrollments/{enrollment_id}")
async def admin_update_enrollment(enrollment_id: str, data: EnrollmentStatusInput, admin: dict = Depends(require_admin)):
    if data.status not in ("nuova", "confermata", "annullata"):
        raise HTTPException(status_code=400, detail="Stato non valido")
    res = await db.enrollments.update_one({"id": enrollment_id, "is_deleted": {"$ne": True}}, {"$set": {"status": data.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Iscrizione non trovata")
    return enrollment_admin(await db.enrollments.find_one({"id": enrollment_id}))

@api_router.delete("/admin/enrollments/{enrollment_id}")
async def admin_delete_enrollment(enrollment_id: str, admin: dict = Depends(require_admin)):
    res = await db.enrollments.update_one({"id": enrollment_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Iscrizione non trovata")
    return {"ok": True}

async def _issue_from_enrollment(enr: dict, course: Optional[dict]) -> dict:
    if enr.get("certificate_id"):
        existing = await db.certificates.find_one({"id": enr["certificate_id"], "is_deleted": {"$ne": True}})
        if existing:
            return existing
    if not course:
        raise HTTPException(status_code=404, detail="Il corso di questa iscrizione non esiste più")
    ctype = course.get("title", "")
    if course.get("kind"):
        ctype = f"{ctype} — {course['kind']}"
    fields = _cert_fields(CertificateInput(
        first_name=enr.get("first_name", ""), last_name=enr.get("last_name", ""),
        birth_place=enr.get("birth_place", ""), birth_date=enr.get("birth_date", ""),
        course_type=ctype, course_date=course.get("start_date", ""), course_end_date=course.get("end_date", ""),
        course_hours=course.get("hours"), validity_years=course.get("validity_years"),
        tax_code=enr.get("tax_code", ""),
    ))
    cert = await _insert_certificate(fields, {"course_id": course["id"], "enrollment_id": enr["id"]})
    await db.enrollments.update_one({"id": enr["id"]}, {"$set": {"certificate_id": cert["id"], "status": "confermata"}})
    return cert

@api_router.post("/admin/enrollments/{enrollment_id}/certificate")
async def admin_issue_certificate(enrollment_id: str, admin: dict = Depends(require_admin)):
    enr = await db.enrollments.find_one({"id": enrollment_id, "is_deleted": {"$ne": True}})
    if not enr:
        raise HTTPException(status_code=404, detail="Iscrizione non trovata")
    if enr.get("status") == "annullata":
        raise HTTPException(status_code=400, detail="Iscrizione annullata: riattivala prima di emettere l'attestato")
    course = await db.courses.find_one({"id": enr["course_id"]})
    return certificate_admin(await _issue_from_enrollment(enr, course))

@api_router.post("/admin/courses/{course_id}/certificates")
async def admin_issue_course_certificates(course_id: str, admin: dict = Depends(require_admin)):
    """Emette gli attestati per tutti gli iscritti CONFERMATI che non ne hanno ancora uno."""
    course = await db.courses.find_one({"id": course_id, "is_deleted": {"$ne": True}})
    if not course:
        raise HTTPException(status_code=404, detail="Corso non trovato")
    enrs = await db.enrollments.find({"course_id": course_id, "is_deleted": {"$ne": True}, "status": "confermata"}).to_list(5000)
    created = []
    for enr in enrs:
        if enr.get("certificate_id") and await db.certificates.find_one({"id": enr["certificate_id"], "is_deleted": {"$ne": True}}):
            continue
        created.append(certificate_admin(await _issue_from_enrollment(enr, course)))
    return {"created": created}

@api_router.get("/")
async def root():
    return {"message": "E.M Safety API"}

# ---------------------------------------------------------------- Startup
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").strip().lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": "Admin", "role": "admin",
                                   "created_at": datetime.now(timezone.utc).isoformat()})
        logger.info("Seeded admin user %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Updated admin password for %s", admin_email)

SAMPLE_STORY = {
    "title": "Da 12 rilievi ispettivi a zero non conformità: la svolta di un'azienda metalmeccanica",
    "sector": "Metalmeccanica",
    "summary": "Come E.M Safety ha accompagnato un'impresa manifatturiera del Nord-Est nel percorso di piena conformità al D.Lgs 81/08, azzerando le non conformità e trasformando la sicurezza in un vantaggio competitivo.",
    "content": (
        "Quando l'azienda ci ha contattati, l'ultima visita ispettiva aveva lasciato sul tavolo 12 rilievi: "
        "documentazione di valutazione dei rischi non aggiornata, formazione dei lavoratori scaduta e procedure "
        "di emergenza mai testate. Il clima era di forte preoccupazione, con il rischio concreto di sanzioni e "
        "fermo produzione.\n\n"
        "Il nostro intervento è partito da un Gap Analysis approfondito: in due settimane abbiamo mappato ogni "
        "reparto, intervistato i preposti e ricostruito lo stato reale della compliance. Da qui è nato un piano "
        "operativo su 90 giorni, condiviso con la direzione e calato sul codice ATECO specifico dell'impresa.\n\n"
        "Abbiamo aggiornato il Documento di Valutazione dei Rischi, riprogettato le procedure di emergenza con "
        "prove di evacuazione reali e ricostruito il piano formativo secondo gli Accordi Stato-Regioni, erogando "
        "corsi accreditati per RSPP, preposti, addetti antincendio e primo soccorso. Ogni attestato è stato "
        "tracciato in un registro digitale sempre pronto per l'ispezione.\n\n"
        "Il risultato? Alla verifica successiva: zero non conformità. Ma il valore più grande è stato culturale: "
        "la sicurezza non è più vissuta come un adempimento, bensì come parte del modo di lavorare. Meno "
        "infortuni mancati, minori premi assicurativi INAIL e una reputazione più solida verso clienti e "
        "fornitori.\n\n"
        "È esattamente ciò in cui crediamo in E.M Safety: costruiamo sistemi che trasformano la compliance in "
        "valore aggiunto. Sedi operative a Treviso e Milano, un metodo strutturato e persone qualificate al "
        "fianco delle imprese, ogni giorno."
    ),
    "cover_source": "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
}

async def seed_sample_story():
    count = await db.stories.count_documents({"is_deleted": {"$ne": True}})
    if count > 0:
        return
    cover_path = None
    try:
        img = requests.get(SAMPLE_STORY["cover_source"], timeout=30)
        img.raise_for_status()
        path = f"{APP_NAME}/stories/{uuid.uuid4()}.jpg"
        result = put_object(path, img.content, "image/jpeg")
        cover_path = result.get("path", path)
        await db.files.insert_one({
            "id": str(uuid.uuid4()),
            "storage_path": cover_path,
            "original_filename": "case-study-metalmeccanica.jpg",
            "content_type": "image/jpeg",
            "size": result.get("size", len(img.content)),
            "is_deleted": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    except Exception as e:
        logger.error("Sample story cover upload failed: %s", e)
    await db.stories.insert_one({
        "id": str(uuid.uuid4()),
        "title": SAMPLE_STORY["title"],
        "sector": SAMPLE_STORY["sector"],
        "summary": SAMPLE_STORY["summary"],
        "content": SAMPLE_STORY["content"],
        "cover_path": cover_path,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    logger.info("Seeded sample story")

async def seed_client():
    client_email = os.environ.get("CLIENT_EMAIL", "").strip().lower()
    client_password = os.environ.get("CLIENT_PASSWORD", "")
    if not client_email or not client_password:
        return
    existing = await db.users.find_one({"email": client_email})
    if existing is None:
        await db.users.insert_one({"email": client_email, "password_hash": hash_password(client_password),
                                   "name": "Cliente Demo", "role": "client",
                                   "created_at": datetime.now(timezone.utc).isoformat()})
        logger.info("Seeded client user %s", client_email)

@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.stories.create_index("id", unique=True)
    await db.inquiries.create_index("id", unique=True)
    await seed_admin()
    await seed_client()
    await db.logos.create_index("id", unique=True)
    await db.site_content.create_index("key", unique=True)
    await db.certificates.create_index("id", unique=True)
    await db.certificates.create_index("code", unique=True)
    await db.courses.create_index("id", unique=True)
    await db.enrollments.create_index("id", unique=True)
    await db.enrollments.create_index("course_id")
    await seed_logos()
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error("Storage init failed: %s", e)
    await seed_sample_story()

app.include_router(api_router)

_cors_origins = os.environ.get("CORS_ORIGINS", "*")
_cors_kwargs = dict(allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
if _cors_origins.strip() == "*":
    # Reflect any origin (credentials-safe, works across preview/prod/custom domains)
    _cors_kwargs["allow_origin_regex"] = ".*"
else:
    _cors_kwargs["allow_origins"] = [o.strip() for o in _cors_origins.split(",") if o.strip()]

app.add_middleware(CORSMiddleware, **_cors_kwargs)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
