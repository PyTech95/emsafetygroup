"""Regression tests for stories CRUD, files serving, admin clients, and client RBAC."""
import io
import os
import uuid
from pathlib import Path
import pytest
import requests
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[2]
frontend_config = dotenv_values(ROOT / 'frontend' / '.env')
backend_config = dotenv_values(ROOT / 'backend' / '.env')
BASE_URL = (os.environ.get('REACT_APP_BACKEND_URL') or frontend_config['REACT_APP_BACKEND_URL']).rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = backend_config['ADMIN_EMAIL']
ADMIN_PASSWORD = backend_config['ADMIN_PASSWORD']
CLIENT_EMAIL = backend_config['CLIENT_EMAIL']
CLIENT_PASSWORD = backend_config['CLIENT_PASSWORD']

# 1x1 transparent PNG
_PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489"
    "0000000d49444154789c6300010000000500010d0a2db40000000049454e44ae426082"
)


def _session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _admin():
    s = _session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


def _client():
    s = _session()
    r = s.post(f"{API}/auth/login", json={"email": CLIENT_EMAIL, "password": CLIENT_PASSWORD})
    assert r.status_code == 200, r.text
    return s


# ---- Public stories ----
class TestPublicStories:
    def test_list_stories_public(self):
        r = requests.get(f"{API}/stories")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # seeded sample story should exist
        assert len(data) >= 1
        first = data[0]
        for key in ("id", "title", "summary", "cover_url"):
            assert key in first

    def test_seeded_cover_url_reachable(self):
        r = requests.get(f"{API}/stories")
        stories = r.json()
        # find any story with cover
        story_with_cover = next((s for s in stories if s.get("cover_url")), None)
        if not story_with_cover:
            pytest.skip("No story with cover_url found")
        cover = story_with_cover["cover_url"]
        # cover_url may already be full URL or a relative /api/files/... path
        if cover.startswith("http"):
            url = cover
        else:
            url = f"{BASE_URL}{cover}" if cover.startswith("/") else f"{BASE_URL}/{cover}"
        f = requests.get(url, allow_redirects=True)
        assert f.status_code == 200, f"cover fetch failed: {url} -> {f.status_code}"
        assert len(f.content) > 0


# ---- Upload + Stories CRUD (admin) ----
class TestAdminStoriesCRUD:
    _story_id = None
    _file_path = None

    def test_admin_upload_file(self):
        s = _admin()
        files = {"file": (f"TEST_{uuid.uuid4().hex}.png", io.BytesIO(_PNG), "image/png")}
        # remove default content-type header so multipart works
        s.headers.pop("Content-Type", None)
        r = s.post(f"{API}/uploads", files=files)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data or "path" in data
        # store any path-ish field for retrieval verification
        path_or_url = data.get("url") or data.get("path")
        assert path_or_url
        TestAdminStoriesCRUD._file_path = path_or_url

    def test_uploaded_file_is_served(self):
        assert TestAdminStoriesCRUD._file_path
        p = TestAdminStoriesCRUD._file_path
        url = p if p.startswith("http") else f"{BASE_URL}{p if p.startswith('/') else '/' + p}"
        r = requests.get(url)
        assert r.status_code == 200
        assert r.content[:8] == _PNG[:8]  # PNG signature

    def test_admin_create_story(self):
        s = _admin()
        payload = {
            "title": "TEST_STORY_QA",
            "sector": "Test",
            "summary": "Un breve estratto di prova",
            "content": "Contenuto integrale della storia di test.",
            "cover_url": TestAdminStoriesCRUD._file_path or "",
        }
        r = s.post(f"{API}/stories", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["title"] == payload["title"]
        assert "id" in data
        TestAdminStoriesCRUD._story_id = data["id"]

    def test_get_story_by_id(self):
        assert TestAdminStoriesCRUD._story_id
        r = requests.get(f"{API}/stories/{TestAdminStoriesCRUD._story_id}")
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_STORY_QA"

    def test_update_story(self):
        assert TestAdminStoriesCRUD._story_id
        s = _admin()
        payload = {
            "title": "TEST_STORY_QA_EDITED",
            "sector": "Test",
            "summary": "Aggiornato",
            "content": "Contenuto aggiornato.",
            "cover_url": TestAdminStoriesCRUD._file_path or "",
        }
        r = s.put(f"{API}/stories/{TestAdminStoriesCRUD._story_id}", json=payload)
        assert r.status_code == 200
        # verify via GET
        g = requests.get(f"{API}/stories/{TestAdminStoriesCRUD._story_id}")
        assert g.status_code == 200
        assert g.json()["title"] == "TEST_STORY_QA_EDITED"

    def test_delete_story(self):
        assert TestAdminStoriesCRUD._story_id
        s = _admin()
        r = s.delete(f"{API}/stories/{TestAdminStoriesCRUD._story_id}")
        assert r.status_code == 200
        g = requests.get(f"{API}/stories/{TestAdminStoriesCRUD._story_id}")
        assert g.status_code == 404

    def test_public_cannot_create_story(self):
        r = requests.post(f"{API}/stories", json={"title": "x", "excerpt": "x", "content": "x"})
        assert r.status_code in (401, 403)


# ---- Admin clients ----
class TestAdminClients:
    _client_id = None
    _email = f"TEST_client_{uuid.uuid4().hex[:8]}@example.com"

    def test_create_client(self):
        s = _admin()
        r = s.post(f"{API}/admin/clients", json={"email": self._email, "password": "TempPass123!", "name": "TEST Client"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == self._email.lower()
        assert data.get("role") == "client"
        assert "password" not in data
        assert "hashed_password" not in data
        TestAdminClients._client_id = data["id"]

    def test_list_clients(self):
        s = _admin()
        r = s.get(f"{API}/admin/clients")
        assert r.status_code == 200
        ids = [c["id"] for c in r.json()]
        assert TestAdminClients._client_id in ids

    def test_new_client_can_login(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": self._email, "password": "TempPass123!"})
        assert r.status_code == 200
        assert r.json().get("role") == "client"

    def test_delete_client(self):
        assert TestAdminClients._client_id
        s = _admin()
        r = s.delete(f"{API}/admin/clients/{TestAdminClients._client_id}")
        assert r.status_code == 200
        # now login should fail
        s2 = _session()
        r2 = s2.post(f"{API}/auth/login", json={"email": self._email, "password": "TempPass123!"})
        assert r2.status_code == 401


# ---- Client RBAC ----
class TestClientRBAC:
    def test_client_forbidden_from_admin_clients(self):
        s = _client()
        r = s.get(f"{API}/admin/clients")
        assert r.status_code == 403

    def test_client_forbidden_from_inquiries_list(self):
        s = _client()
        r = s.get(f"{API}/inquiries")
        assert r.status_code == 403

    def test_client_can_publish_story(self):
        s = _client()
        payload = {
            "title": f"TEST_CLIENT_STORY_{uuid.uuid4().hex[:6]}",
            "sector": "Test",
            "summary": "Estratto cliente",
            "content": "Contenuto cliente",
            "cover_url": "",
        }
        r = s.post(f"{API}/stories", json=payload)
        assert r.status_code == 200, r.text
        sid = r.json()["id"]
        # cleanup via admin
        a = _admin()
        a.delete(f"{API}/stories/{sid}")
