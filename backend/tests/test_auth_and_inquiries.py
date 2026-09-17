"""Regression tests: auth login (admin/client, normalization, invalid) and inquiries CRUD."""
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


def _session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Auth ----
class TestAuth:
    def test_login_admin_success(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data.get("role") == "admin"
        # cookie set
        assert any(c.name == "access_token" for c in s.cookies)
        # session reusable
        me = s.get(f"{API}/auth/me")
        assert me.status_code == 200
        assert me.json()["email"] == ADMIN_EMAIL

    def test_login_admin_uppercase_and_whitespace(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": f"  {ADMIN_EMAIL.upper()}  ", "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        assert r.json()["email"] == ADMIN_EMAIL

    def test_login_wrong_password(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"})
        assert r.status_code == 401
        assert "Credenziali" in r.json().get("detail", "")

    def test_login_password_trailing_space_fails(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD + " "})
        assert r.status_code == 401

    def test_login_client_success(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": CLIENT_EMAIL, "password": CLIENT_PASSWORD})
        assert r.status_code == 200, r.text
        assert r.json().get("role") == "client"

    def test_logout_clears_session(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        lo = s.post(f"{API}/auth/logout")
        assert lo.status_code == 200
        me = s.get(f"{API}/auth/me")
        assert me.status_code in (401, 403)


# ---- Inquiries ----
class TestInquiries:
    _created_id = None

    def _admin_session(self):
        s = _session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        return s

    def test_public_create_inquiry(self):
        s = _session()
        payload = {
            "name": "TEST_QA_Checkup",
            "email": "TEST_qa+checkup@example.com",
            "company": "TEST Co",
            "phone": "+390000000",
            "service": "Check-up Sicurezza",
            "message": "TEST_INQUIRY_MARKER Full edited checkup message. Focus: DPI e formazione.",
        }
        r = s.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"].lower()
        assert data["service"] == payload["service"]
        assert "TEST_INQUIRY_MARKER" in data["message"]
        assert data["status"] == "nuova"
        assert "id" in data
        TestInquiries._created_id = data["id"]

    def test_list_requires_admin(self):
        s = _session()
        r = s.get(f"{API}/inquiries")
        assert r.status_code in (401, 403)

    def test_admin_sees_created_inquiry(self):
        assert TestInquiries._created_id, "Create test must run first"
        s = self._admin_session()
        r = s.get(f"{API}/inquiries")
        assert r.status_code == 200
        ids = [x["id"] for x in r.json()]
        assert TestInquiries._created_id in ids
        row = next(x for x in r.json() if x["id"] == TestInquiries._created_id)
        assert "TEST_INQUIRY_MARKER" in row["message"]
        assert row["service"] == "Check-up Sicurezza"

    def test_admin_patch_status(self):
        assert TestInquiries._created_id
        s = self._admin_session()
        r = s.patch(f"{API}/inquiries/{TestInquiries._created_id}", json={"status": "letta"})
        assert r.status_code == 200
        assert r.json()["status"] == "letta"

    def test_admin_delete_only_test_inquiry(self):
        assert TestInquiries._created_id
        s = self._admin_session()
        r = s.delete(f"{API}/inquiries/{TestInquiries._created_id}")
        assert r.status_code == 200
        # verify soft-deleted (not in list)
        lst = s.get(f"{API}/inquiries").json()
        assert TestInquiries._created_id not in [x["id"] for x in lst]
