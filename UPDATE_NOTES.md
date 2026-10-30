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

---

# Update — Email notifications, cookie popup fix, testimonials (30 October 2026)

## Why contact emails were not arriving
Contact-form requests were always saved (Admin → Richieste). An email is only sent when Admin → Impostazioni has a working mail account and the toggle is on. Before this update:
- sending failed silently;
- there was no way to see why;
- only Gmail was supported.

## What changed
- **Email notifications:**
  - Choose the mail service: Gmail / Google Workspace, Aruba, Microsoft 365 / Outlook, any other SMTP server, or Brevo (API over HTTPS, for when the hosting blocks email ports).
  - "Salva e invia email di test" shows the exact reason when sending fails (wrong password, Gmail app password missing, server or port blocked).
  - Every request and course enrollment shows "Email inviata / non inviata / disattivata".
  - The dashboard shows a red warning while notifications are off or failing.
  - Emails are sent in the background, so the visitor gets the confirmation immediately.
  - Reply-To is the customer's address, so replying writes directly to them.
  - Gmail automatically retries on port 465 if 587 is blocked.
- **Cookie popup:**
  - The buttons are always visible at the bottom, even on laptop screens; before, they were below the screen edge.
  - The text scrolls on its own.
  - It closes instantly.
  - ESC works like the X.
  - The choice is also saved in a cookie, so the popup doesn't come back in browsers that block local storage.
- **Testimonials:**
  - New admin section Testimonianze: add, edit, delete, reorder, publish or hide, and feature.
  - Each testimonial has an optional photo and 1–5 stars.
  - The Testimonianze page and a new "Dicono di noi" home section read them live.
  - The old sample quote ("Marco Rossi", stock photo) was removed. If it had been customised in Testi Sito, it is imported automatically as the first testimonial.

## Setup after deploy
Admin → Impostazioni → Notifiche email:
1. Choose the service.
2. Enter the sender address and password (for Gmail, an "App password"), and the recipient address.
3. Turn the toggle on.
4. Press "Salva e invia email di test".

If the result says the server can't be reached, the hosting blocks SMTP: use **Brevo (API)** instead (free account; the sender address must be verified on Brevo).
