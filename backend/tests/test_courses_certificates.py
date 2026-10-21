"""Regression tests: corsi in partenza, iscrizioni pubbliche, attestati con verifica QR."""
import os
from datetime import date, timedelta
from pathlib import Path
import requests
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[2]
frontend_config = dotenv_values(ROOT / 'frontend' / '.env')
backend_config = dotenv_values(ROOT / 'backend' / '.env')
BASE_URL = (os.environ.get('REACT_APP_BACKEND_URL') or frontend_config['REACT_APP_BACKEND_URL']).rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_EMAIL = backend_config['ADMIN_EMAIL']
ADMIN_PASSWORD = backend_config['ADMIN_PASSWORD']

FUTURE = (date.today() + timedelta(days=30)).isoformat()
PAST = (date.today() - timedelta(days=30)).isoformat()


def _admin():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


def _person(**kw):
    base = {"first_name": "TEST_Mario", "last_name": "Rossi", "email": "test_mario@example.com", "phone": "3330000000",
            "birth_place": "Treviso", "birth_date": "15/03/1985", "privacy": True}
    base.update(kw)
    return base


class TestCoursesAndEnrollments:
    def test_course_lifecycle(self):
        s = _admin()
        c = s.post(f"{API}/admin/courses", json={"title": "TEST_Carrelli elevatori", "kind": "Aggiornamento", "hours": 4,
                                                  "start_date": FUTURE, "seats": 1, "validity_years": 5,
                                                  "program": ["Uno", " ", "Due"]}).json()
        try:
            assert c["program"] == ["Uno", "Due"]
            public = requests.get(f"{API}/courses").json()
            assert any(x["id"] == c["id"] and x["can_enroll"] for x in public)
            # privacy required
            assert requests.post(f"{API}/courses/{c['id']}/enroll", json=_person(privacy=False)).status_code == 400
            assert requests.post(f"{API}/courses/{c['id']}/enroll", json=_person()).status_code == 200
            # seat limit reached
            full = requests.get(f"{API}/courses/{c['id']}").json()
            assert full["is_full"] and not full["can_enroll"]
            assert requests.post(f"{API}/courses/{c['id']}/enroll", json=_person(first_name="TEST_Luca")).status_code == 409
            # admin sees enrollment, confirms it and issues the certificate
            enrs = s.get(f"{API}/admin/enrollments", params={"course_id": c["id"]}).json()
            assert len(enrs) == 1
            assert s.patch(f"{API}/admin/enrollments/{enrs[0]['id']}", json={"status": "confermata"}).status_code == 200
            created = s.post(f"{API}/admin/courses/{c['id']}/certificates").json()["created"]
            assert len(created) == 1 and created[0]["course_type"] == "TEST_Carrelli elevatori — Aggiornamento"
            v = requests.get(f"{API}/certificates/verify/{created[0]['code']}").json()
            assert v["status"] == "valido" and v["birth_date"] == "1985-03-15"
            s.delete(f"{API}/admin/certificates/{created[0]['id']}")
        finally:
            s.delete(f"{API}/admin/courses/{c['id']}")

    def test_past_and_draft_courses_hidden(self):
        s = _admin()
        past = s.post(f"{API}/admin/courses", json={"title": "TEST_past", "start_date": PAST}).json()
        draft = s.post(f"{API}/admin/courses", json={"title": "TEST_draft", "start_date": FUTURE, "published": False}).json()
        try:
            ids = {x["id"] for x in requests.get(f"{API}/courses").json()}
            assert past["id"] not in ids and draft["id"] not in ids
            assert requests.get(f"{API}/courses/{draft['id']}").status_code == 404
        finally:
            s.delete(f"{API}/admin/courses/{past['id']}")
            s.delete(f"{API}/admin/courses/{draft['id']}")

    def test_admin_endpoints_require_auth(self):
        for path in ("/admin/courses", "/admin/enrollments", "/admin/certificates"):
            assert requests.get(f"{API}{path}").status_code == 401


class TestCertificates:
    def test_create_verify_revoke(self):
        s = _admin()
        cert = s.post(f"{API}/admin/certificates", json={
            "first_name": "TEST_Giulia", "last_name": "Bianchi", "birth_place": "Milano", "birth_date": "1990-01-01",
            "course_type": "Primo soccorso", "course_date": "2026-03-10", "course_hours": 12, "validity_years": 3,
            "notes": "interno", "tax_code": "bnchgl90a41f205x"}).json()
        try:
            assert cert["code"].startswith("EMS-2026-") and cert["expiry_date"] == "2029-03-10"
            pub = requests.get(f"{API}/certificates/verify/{cert['code'].lower()}").json()
            assert pub["first_name"] == "TEST_Giulia" and "notes" not in pub and "tax_code" not in pub
            s.patch(f"{API}/admin/certificates/{cert['id']}/revoke", json={"revoked": True})
            assert requests.get(f"{API}/certificates/verify/{cert['code']}").json()["status"] == "revocato"
        finally:
            s.delete(f"{API}/admin/certificates/{cert['id']}")
        assert requests.get(f"{API}/certificates/verify/{cert['code']}").status_code == 404

    def test_bulk_is_all_or_nothing(self):
        s = _admin()
        good = {"first_name": "TEST_A", "last_name": "B", "birth_place": "X", "birth_date": "1990-01-01",
                "course_type": "C", "course_date": "2026-01-01"}
        r = s.post(f"{API}/admin/certificates/bulk", json={"items": [good, {**good, "first_name": ""}]})
        assert r.status_code == 400 and "Riga 2" in r.json()["detail"]
        assert not [c for c in s.get(f"{API}/admin/certificates", params={"q": "TEST_A"}).json() if c["first_name"] == "TEST_A"]

    def test_expired_status(self):
        s = _admin()
        cert = s.post(f"{API}/admin/certificates", json={
            "first_name": "TEST_Old", "last_name": "One", "birth_place": "Roma", "birth_date": "1970-01-01",
            "course_type": "Antincendio", "course_date": "2018-05-05", "validity_years": 3}).json()
        try:
            assert requests.get(f"{API}/certificates/verify/{cert['code']}").json()["status"] == "scaduto"
        finally:
            s.delete(f"{API}/admin/certificates/{cert['id']}")
