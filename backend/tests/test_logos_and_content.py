"""Tests for /api/logos CRUD + reorder and /api/site-content GET/PUT/reset."""
import os
import io
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

# Tiny valid PNG (1x1 red)
PNG_BYTES = bytes.fromhex(
    "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4"
    "890000000D49444154789C6360F80F000100010000010000181D0F7F00000000"
    "49454E44AE426082"
)


def _admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


def _client_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": CLIENT_EMAIL, "password": CLIENT_PASSWORD})
    assert r.status_code == 200, r.text
    return s


# -------- Logos: read seeded --------
class TestLogosRead:
    def test_list_all(self):
        r = requests.get(f"{API}/logos")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 20

    @pytest.mark.parametrize("section,expected", [("clients", 13), ("group", 4), ("affiliations", 3)])
    def test_list_by_section(self, section, expected):
        r = requests.get(f"{API}/logos", params={"section": section})
        assert r.status_code == 200
        items = r.json()
        assert len(items) == expected, f"{section}: {len(items)}"
        for it in items:
            assert set(["id", "section", "name", "description", "image_url", "dark", "order"]).issubset(it.keys())
            assert it["section"] == section


# -------- Logos: CRUD --------
class TestLogosCRUD:
    created_id = None

    def test_unauth_post_401(self):
        r = requests.post(f"{API}/logos",
                          data={"section": "clients", "name": "X"},
                          files={"file": ("t.png", PNG_BYTES, "image/png")})
        assert r.status_code in (401, 403)

    def test_client_role_forbidden(self):
        s = _client_session()
        r = s.post(f"{API}/logos",
                   data={"section": "clients", "name": "X"},
                   files={"file": ("t.png", PNG_BYTES, "image/png")})
        assert r.status_code == 403

    def test_admin_create_and_file_served(self):
        s = _admin_session()
        r = s.post(f"{API}/logos",
                   data={"section": "clients", "name": "TEST_QA_Logo", "description": "TEST_desc", "dark": "false"},
                   files={"file": ("test_qa.png", PNG_BYTES, "image/png")})
        assert r.status_code in (200, 201), r.text
        d = r.json()
        assert d["section"] == "clients"
        assert d["name"] == "TEST_QA_Logo"
        assert d["image_url"].startswith("/api/files/")
        TestLogosCRUD.created_id = d["id"]

        # File served
        fr = requests.get(f"{BASE_URL}{d['image_url']}")
        assert fr.status_code == 200
        assert len(fr.content) > 0

    def test_invalid_section_400(self):
        s = _admin_session()
        r = s.post(f"{API}/logos",
                   data={"section": "bogus", "name": "TEST_bad"},
                   files={"file": ("t.png", PNG_BYTES, "image/png")})
        assert r.status_code == 400

    def test_update_name_and_dark(self):
        assert TestLogosCRUD.created_id
        s = _admin_session()
        r = s.put(f"{API}/logos/{TestLogosCRUD.created_id}",
                  data={"name": "TEST_QA_Renamed", "dark": "true"})
        assert r.status_code == 200, r.text
        assert r.json()["name"] == "TEST_QA_Renamed"
        assert r.json()["dark"] is True

    def test_update_replaces_file(self):
        assert TestLogosCRUD.created_id
        s = _admin_session()
        old = next(x for x in requests.get(f"{API}/logos", params={"section": "clients"}).json()
                   if x["id"] == TestLogosCRUD.created_id)
        r = s.put(f"{API}/logos/{TestLogosCRUD.created_id}",
                  files={"file": ("newfile.png", PNG_BYTES, "image/png")})
        assert r.status_code == 200, r.text
        assert r.json()["image_url"].startswith("/api/files/")
        assert r.json()["image_url"] != old["image_url"]

    def test_reorder(self):
        s = _admin_session()
        items = requests.get(f"{API}/logos", params={"section": "clients"}).json()
        ids = [x["id"] for x in items]
        reversed_ids = list(reversed(ids))
        r = s.post(f"{API}/logos/reorder", json={"ids": reversed_ids})
        assert r.status_code == 200
        new_items = requests.get(f"{API}/logos", params={"section": "clients"}).json()
        new_ids = [x["id"] for x in new_items]
        assert new_ids == reversed_ids
        # restore
        s.post(f"{API}/logos/reorder", json={"ids": ids})

    def test_unauth_put_401(self):
        assert TestLogosCRUD.created_id
        r = requests.put(f"{API}/logos/{TestLogosCRUD.created_id}", data={"name": "hack"})
        assert r.status_code in (401, 403)

    def test_unauth_delete_401(self):
        assert TestLogosCRUD.created_id
        r = requests.delete(f"{API}/logos/{TestLogosCRUD.created_id}")
        assert r.status_code in (401, 403)

    def test_delete_and_cleanup(self):
        assert TestLogosCRUD.created_id
        s = _admin_session()
        r = s.delete(f"{API}/logos/{TestLogosCRUD.created_id}")
        assert r.status_code == 200
        # Confirm gone
        items = requests.get(f"{API}/logos", params={"section": "clients"}).json()
        assert TestLogosCRUD.created_id not in [x["id"] for x in items]
        assert len(items) == 13  # back to seeded count


# -------- Site content --------
class TestSiteContent:
    KEY = "home.hero.title1"
    _original = None

    def test_get_returns_dict(self):
        r = requests.get(f"{API}/site-content")
        assert r.status_code == 200
        assert isinstance(r.json(), dict)
        TestSiteContent._original = r.json().get(self.KEY)

    def test_unauth_put_401(self):
        r = requests.put(f"{API}/site-content", json={"items": {self.KEY: "hacked"}})
        assert r.status_code in (401, 403)

    def test_admin_put_and_reflect(self):
        s = _admin_session()
        r = s.put(f"{API}/site-content", json={"items": {self.KEY: "TEST_QA_Titolo"}})
        assert r.status_code == 200
        # GET reflects
        got = requests.get(f"{API}/site-content").json()
        assert got.get(self.KEY) == "TEST_QA_Titolo"

    def test_admin_reset_key(self):
        s = _admin_session()
        r = s.post(f"{API}/site-content/reset", json={"key": self.KEY})
        assert r.status_code == 200
        got = requests.get(f"{API}/site-content").json()
        assert self.KEY not in got
        # Restore original if there was one
        if TestSiteContent._original is not None:
            s.put(f"{API}/site-content", json={"items": {self.KEY: TestSiteContent._original}})
