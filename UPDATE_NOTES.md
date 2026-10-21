# Update — Corsi in partenza, Attestati con QR, Cookie banner (October 2026)

## What's new
1. **Verifica attestato (QR)** — every certificate gets a unique code (e.g. `EMS-2026-7KQ4-P9XD`) and a QR code that opens `/verifica/<code>`, showing name, surname, place and date of birth, course type, course date, duration, validity and expiry (valid / expired / revoked). Anyone can also type the code at `/verifica-attestato`.
2. **Corsi in partenza** — public calendar at `/corsi`; each course has its own page (layout based on the client's course sheet PDF) with an online enrollment form.
3. **Cookie banner** — "Informativa" shown on first visit, exactly as requested, with padlock icon (bottom-left) to change the choice later.

## Admin panel (Area Riservata → admin)
- **Corsi in partenza**: create / edit / duplicate course editions (button "Compila con la scheda di esempio" fills the form with the forklift course).
- **Iscrizioni corsi**: enrollments per course, change status, export CSV, "Emetti attestati ai confermati" in one click.
- **Attestati & QR**: create certificates for a whole class (course data once + participants list, or import a CSV), download each QR as PNG or all as ZIP, edit, revoke, export the register.
- Enrollment emails use the same Gmail settings already configured in **Impostazioni**.

## Deploy
- Backend: no new Python packages. New MongoDB collections are created automatically on start.
- Frontend: two new packages (`qrcode`, `jszip`) → run `yarn install` before `yarn build`.
- Recommended in `frontend/.env`: `REACT_APP_PUBLIC_SITE_URL=https://emsafetygroup.it` (the final domain). QR codes printed on certificates are permanent, so they must point to the definitive domain.

## Files changed
New:
- UPDATE_NOTES.md
- backend/tests/test_courses_certificates.py
- frontend/src/components/CookieConsent.tsx
- frontend/src/data/legal.ts
- frontend/src/lib/consent.ts
- frontend/src/lib/qr.ts
- frontend/src/lib/training.ts
- frontend/src/pages/CorsiPage.tsx
- frontend/src/pages/CorsoDetailPage.tsx
- frontend/src/pages/VerificaAttestatoPage.tsx
- frontend/src/pages/admin/CertificatesView.tsx
- frontend/src/pages/admin/CoursesView.tsx
- frontend/src/pages/admin/EnrollmentsView.tsx
- frontend/src/pages/admin/ui.tsx
Modified:
- backend/server.py
- frontend/package.json
- frontend/src/App.tsx
- frontend/src/components/CoursesSection.tsx
- frontend/src/components/Footer.tsx
- frontend/src/components/Header.tsx
- frontend/src/components/LegalModal.tsx
- frontend/src/data/textRegistry.ts
- frontend/src/pages/AdminDashboard.tsx
- memory/PRD.md
