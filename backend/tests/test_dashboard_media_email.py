"""Tests for new admin dashboard features: stats, media manager, email settings, visit tracking, RBAC."""
import io
import os
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

PNG_1x1 = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0"
    b"\x00\x00\x00\x03\x00\x01\x5c\xcd\xff\x69\x00\x00\x00\x00IEND\xaeB`\x82"
)


@pytest.fixture
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


@pytest.fixture
def client_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": CLIENT_EMAIL, "password": CLIENT_PASSWORD})
    assert r.status_code == 200, r.text
    return s


# ---- Visit tracking & stats ----
class TestStats:
    def test_track_visit_public(self):
        r = requests.post(f"{API}/track/visit", json={"path": "/test-visit"})
        assert r.status_code == 200
        assert r.json() == {"ok": True}

    def test_stats_requires_admin(self):
        r = requests.get(f"{API}/admin/stats")
        assert r.status_code in (401, 403)

    def test_stats_shape(self, admin_session):
        # increment a visit first
        requests.post(f"{API}/track/visit", json={"path": "/stats-check"})
        r = admin_session.get(f"{API}/admin/stats")
        assert r.status_code == 200
        data = r.json()
        assert "series" in data and "totals" in data
        assert isinstance(data["series"], list)
        assert len(data["series"]) == 14
        for item in data["series"]:
            assert set(item.keys()) >= {"day", "visitors", "inquiries"}
        t = data["totals"]
        for k in ("visitors", "visits_today", "inquiries", "new_inquiries", "stories", "clients"):
            assert k in t, f"missing key {k}"
            assert isinstance(t[k], int)
        assert t["visitors"] >= 1


# ---- Site assets / Media manager ----
class TestSiteAssets:
    KEY = "/assets/images/hero-milano.jpg"

    def test_public_get_site_assets(self):
        r = requests.get(f"{API}/site-assets")
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_upload_requires_admin(self):
        files = {"file": ("t.png", io.BytesIO(PNG_1x1), "image/png")}
        r = requests.post(f"{API}/site-assets", data={"key": self.KEY}, files=files)
        assert r.status_code in (401, 403)

    def test_admin_upload_override_and_reset(self, admin_session):
        files = {"file": ("t.png", io.BytesIO(PNG_1x1), "image/png")}
        r = admin_session.post(f"{API}/site-assets", data={"key": self.KEY}, files=files)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["key"] == self.KEY
        assert data["url"].startswith("/api/files/")

        # verify GET reflects override
        g = requests.get(f"{API}/site-assets")
        assert g.status_code == 200
        assert g.json().get(self.KEY) == data["url"]

        # file served
        f = requests.get(f"{BASE_URL}{data['url']}")
        assert f.status_code == 200
        assert f.headers.get("content-type", "").startswith("image/")

        # reset
        rr = admin_session.post(f"{API}/site-assets/reset", json={"key": self.KEY})
        assert rr.status_code == 200
        g2 = requests.get(f"{API}/site-assets")
        assert self.KEY not in g2.json()


# ---- Email settings ----
class TestEmailSettings:
    def test_get_requires_admin(self):
        r = requests.get(f"{API}/admin/email-settings")
        assert r.status_code in (401, 403)

    def test_get_shape_no_plaintext(self, admin_session):
        r = admin_session.get(f"{API}/admin/email-settings")
        assert r.status_code == 200
        d = r.json()
        assert "has_app_password" in d
        assert isinstance(d["has_app_password"], bool)
        # secret keys must NEVER be exposed
        for forbidden in ("app_password", "app_password_enc", "password"):
            assert forbidden not in d, f"leaked field: {forbidden}"

    def test_put_saves_and_hides_password(self, admin_session):
        payload = {
            "sender_email": "TEST_sender@gmail.com",
            "app_password": "fakeAppPw1234",
            "sender_name": "TEST Sender",
            "receiver_email": "TEST_receiver@example.com",
            "cc_email": "",
            "enabled": False,
        }
        r = admin_session.put(f"{API}/admin/email-settings", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["sender_email"] == "test_sender@gmail.com"  # server lowercases
        assert d["has_app_password"] is True
        assert "app_password" not in d
        assert "app_password_enc" not in d

        # GET again — still hidden
        g = admin_session.get(f"{API}/admin/email-settings")
        gd = g.json()
        assert gd["has_app_password"] is True
        assert "app_password" not in gd

    def test_test_endpoint_fails_gracefully_with_fake_pw(self, admin_session):
        # ensure config exists (from previous test)
        r = admin_session.post(f"{API}/admin/email-settings/test")
        # with a fake password, Gmail login fails -> server returns 502 gracefully.
        # NOTE: Cloudflare ingress rewrites 5xx bodies to a generic HTML error page,
        # so the Italian JSON detail never reaches the frontend. The endpoint still
        # returns a non-2xx which the frontend uses to show a fallback toast.
        assert r.status_code == 502, r.text

    def test_toggle_enabled(self, admin_session):
        # get current
        current = admin_session.get(f"{API}/admin/email-settings").json()
        payload = {
            "sender_email": current.get("sender_email") or "TEST_sender@gmail.com",
            "sender_name": current.get("sender_name") or "TEST",
            "receiver_email": current.get("receiver_email") or "TEST_receiver@example.com",
            "cc_email": current.get("cc_email") or "",
            "enabled": True,
            # no app_password -> keep existing
        }
        r = admin_session.put(f"{API}/admin/email-settings", json=payload)
        assert r.status_code == 200
        assert r.json()["enabled"] is True
        # revert
        payload["enabled"] = False
        admin_session.put(f"{API}/admin/email-settings", json=payload)


# ---- Inquiry saves even when email disabled/misconfigured ----
class TestInquiryNonBlocking:
    def test_inquiry_saves_when_email_disabled(self):
        # global settings default: not enabled or test set enabled=false at end
        payload = {"name": "TEST_NB_User", "email": "TEST_nb@example.com",
                   "message": "TEST_NB message", "service": "Check-up Sicurezza"}
        r = requests.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == payload["email"].lower()
        assert data["status"] == "nuova"


# ---- Client RBAC ----
class TestClientRBAC:
    def test_client_blocked_admin_endpoints(self, client_session):
        blocked = [
            ("GET", f"{API}/admin/stats", None, None),
            ("GET", f"{API}/admin/clients", None, None),
            ("GET", f"{API}/inquiries", None, None),
            ("GET", f"{API}/admin/email-settings", None, None),
        ]
        for method, url, _, _ in blocked:
            r = client_session.request(method, url)
            assert r.status_code == 403, f"{method} {url} -> {r.status_code}"

    def test_client_blocked_site_asset_post(self, client_session):
        files = {"file": ("t.png", io.BytesIO(PNG_1x1), "image/png")}
        r = client_session.post(f"{API}/site-assets", data={"key": "/assets/test"}, files=files)
        assert r.status_code == 403

    def test_client_can_post_story(self, client_session):
        r = client_session.post(f"{API}/stories", json={
            "title": "TEST_client_story", "sector": "TEST", "summary": "TEST",
            "content": "TEST content"
        })
        assert r.status_code == 200
        sid = r.json()["id"]
        # cleanup
        client_session.delete(f"{API}/stories/{sid}")
