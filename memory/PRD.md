# E.M Safety — Corporate Website (PRD)

## Original problem statement
Deploy the uploaded EM-Website-main project on a public URL with a pre-deploy audit: detect stack, hunt hardcoded dev URLs / broken asset paths / secrets, verify build, SPA routing, then build & deploy and verify live. System direction: elevate the design to award-worthy level (kinetic masked hero reveal, numbered manifesto chapters, slow editorial marquee, framer-motion scroll reveals, lenis smooth scrolling, parallax hero moment) within the strict black/white monochrome brand.

## Stack
- Frontend: React 19 + TypeScript, CRA + CRACO, Tailwind v3 (all palettes remapped to neutral), motion (framer-motion), lenis, lucide-react. :3000 via supervisor.
- Backend: FastAPI + Motor (MongoDB), JWT httpOnly-cookie auth, bcrypt. :8001, routes under /api.
- Object storage: Emergent objstore proxy (EMERGENT_LLM_KEY) for story cover uploads, served via /api/files/{path}.

## User personas
- Visitor (Italian SME owner/HR): browses services, courses, stories, contacts via mailto form.
- Admin (E.M Safety staff): publishes/edits/deletes success stories with cover images.

## Audit results (Phase 2, 2026-09-16)
- No hardcoded localhost/127.0.0.1 — frontend uses REACT_APP_BACKEND_URL only.
- No committed secrets in zip (no .env shipped); JWT_SECRET/ADMIN_* added to backend/.env here.
- Production `craco build` passes; `tsc --noEmit` clean.
- SPA catch-all: client-side redirect to /; ingress routes /api to backend — refresh on /servizi returns 200.
- Object-storage init fails on first boot of a fresh env (race with proxy); re-seeded story after restart — cover now served (200, image/jpeg).

## Implemented (2026-09-16)
- Full migration of EM-Website-main into /app (7 pages + admin, stories backend).
- Award-worthy pass: lenis momentum scrolling; hero masked line-by-line reveal + parallax image + counter-parallax stat card; EditorialMarquee (slow, outline/solid type); SectionChapter numbered manifesto strips (01–08) on homepage; all strict monochrome per design_guidelines.json.
- Verified: API root, admin login (API + UI), stories list + cover serving, SPA routes, homepage visuals, zero console errors (only platform overlay noise).
- Logo swap (2026-09-16): replaced SVG logo with the client-supplied PNG (/assets/images/em-logo.png), used unedited; +10% then +15% size; header changed to solid white so the logo background blends seamlessly; slogan restored beside (header) / below (footer) the logo; white chip behind logo on dark backgrounds (footer, admin).
- Founder section (2026-09-16): enhanced founder gala photo (B&W grade, contrast, sharpen, upscale, vignette) at /assets/images/founder.jpg; new dark editorial FounderSection (chapter 10) before footer with company-story copy (no name invented).
- Il Gruppo + service images (2026-09-16): new GruppoSection (chapter 07) with the 4 group entities (SA.R.M.ED Safety, CRUSCOTTO SGI, SA.R.M.ED Engineering, EM Consulting — draft descriptions, confirm with user); chapters renumbered FAQ→08, Contatti→09, Fondatore→10; all 6 service cards now have topical B&W photo headers (local files under /assets/images/services/), shared by homepage and /servizi.

- Client accounts + inquiry management (2026-09-16): role-based auth extended (admin/client). Admin panel now has tabs — Storie, Richieste, Clienti. Admin creates client logins (email + password with confirmation field); clients log in via the same Area Riservata and can publish stories with cover images; clients are blocked (403) from admin-only data. Contact form now posts real inquiries to the server (was mailto — no longer MOCKED); admin inbox lists them with nuova/letta status toggle and delete. Demo client seeded: cliente@emsafetygroup.it.

- Light theme + color photos (2026-09-17, user directive: NO black-and-white photos, white/light backgrounds, light blue tints allowed): removed every grayscale filter sitewide; hero image replaced (final: user's own colorful Piazza Gae Aulenti photo); hero, Method, Founder, PageHero sections and Footer converted from dark/navy to white + light sky (#f0f9ff); marquee reworked to a light, elegant thin typeface (heavy extrabold/outline style rejected by user); all photos render in full color. design_guidelines.json monochrome rule is SUPERSEDED by this user directive.
- Il Gruppo real logos (2026-09-17): the four group logos were extracted from the live emsafetygroup.it strip image (Screenshot-2026-09-05-115641-1.png), auto-sliced by whitespace-gap detection into 4 PNGs under /assets/images/group/ — GruppoSection now shows the genuine logos (no typographic imitation).

- Blue accent pass (2026-09-17, user: "troppo nero, cambiamo col blu"): brand blue #1e6fd9 (dark #155bb0, light #e8f1fc) replaces black/amber accents — header CTA, primary buttons, chapter numbers, service icon chips, checkmarks, section labels, nav underline, method badges. Hero photo changed again: now a colorful welder-with-PPE shot (/assets/images/hero-sicurezza.jpg, IMAGES.hero). Marquee font switched to light italic editorial (blue/gray alternating). Group logos enlarged (max-h-20).

- Email notifications + mobile menu (2026-09-17): every contact-form inquiry now triggers a real email to info@emsafetygroup.it via Emergent-managed Resend (EMERGENT_EMAIL_KEY in backend/.env; non-blocking — inquiry saves even if email fails; guardrail gate `_assert_safe_email` on every send; server-side template, all user content escaped). Mobile hamburger menu polished: larger touch targets, blue active/hover states, quick "Chiama ora" + "Preventivo" action row.

- "Hanno creduto in noi" client wall (2026-09-17): chapter 08 after Il Gruppo (FAQ→09, Contatti→10, Fondatore→11). 10 real HD logos with transparent backgrounds under /assets/images/clients/: Ariston Group, Thermowatt, Ecoflam, Brivio & Viganò, SITA, Elco (official sources where available, else upscaled user uploads), Calzedonia, Luxottica (Wikimedia SVG), Geox (official SVG). SIMI Group renders on a dark chip (white neon logo). CLIENTS list lives in siteContent.ts — easy to extend.

- Ported into this workspace + real PPE photo in DPI scanner (2026-09-17): full EM-Website-main app runs in /app (backend + React/CRACO frontend). Required backend/.env keys set (JWT_SECRET, ADMIN_*, CLIENT_*, EMERGENT_LLM_KEY for object storage, NOTIFY_EMAIL). Removed stale base-template files (App.js/index.js/App.css/jsconfig.json) so the TS entry is used. Testing agent: 27/27 backend pytest pass; all public pages, SPA deep-links, admin/client auth+RBAC, stories CRUD, inquiries verified. Replaced the cartoon SVG in the "VISTA FRONTALE / DPI" scanner (SafetyInspector.tsx) with a photorealistic full-PPE worker cutout (/assets/images/ppe-scan-worker.png, transparent bg); realigned the 5 hotspots (helmet/goggles/vest/gloves/boots) and set frame aspect to the photo. Responsiveness confirmed at 390px (hamburger) and 1440px. Email notifications are a NO-OP (no EMERGENT_EMAIL_KEY) but inquiries still save.

## Re-migration into fresh workspace (2026-06)
- Uploaded em-security-main.zip restored into /app: backend/server.py + requirements + tests, full TS frontend (src/public/config), stale base-template JS files removed.
- backend/.env reconstructed (zip shipped no env): JWT_SECRET, ADMIN_*, CLIENT_*, EMAIL_CREDENTIALS_KEY (valid Fernet), EMERGENT_LLM_KEY (object storage), NOTIFY_EMAIL, EMAIL_FROM_NAME. MONGO_URL/DB_NAME/CORS preserved.
- Verified live: API root 200, admin login 200, stories 200, object storage initialized, admin+client+sample story seeded, homepage renders. deployment_agent: PASS (no blockers).
- Credentials in /app/memory/test_credentials.md.

## Backlog
- P1: custom domain wiring; real server-side contact form (currently mailto handoff — MOCKED server-side).
- P2: login brute-force lockout; AuthContext /api/auth/me probe causes harmless 401 noise for anonymous users.

## Admin dashboard rebuild (2026-09-17)
- New SaaS-style admin at /admin: dark navy sidebar (Dashboard, Immagini Sito, Storie/Blog, Richieste, Clienti, Impostazioni) + top bar. Clean blue-brand, responsive (sidebar → drawer on mobile).
- Dashboard: 6 KPI cards (visitatori totali/oggi, richieste totali/nuove, storie, clienti) + 2 recharts area charts (visitatori & richieste, 14 giorni) + recent inquiries. Backed by GET /api/admin/stats and built-in visitor tracking (POST /api/track/visit on every public route change).
- Immagini Sito (media manager): replace EVERY site image. Backend site_assets collection + GET/POST /api/site-assets, POST /api/site-assets/reset (upload to Emergent object storage). Frontend AssetsProvider/resolveAsset + useAsset wired into all image components; MEDIA_SLOTS registry lists 28 editable slots. Overrides served via /api/files/... prefixed with REACT_APP_BACKEND_URL.
- Impostazioni email: Gmail SMTP via App Password, configured at runtime and stored in db.settings (_id=email). App password Fernet-encrypted with EMAIL_CREDENTIALS_KEY, never returned (has_app_password bool). Endpoints: GET/PUT /api/admin/email-settings, POST /api/admin/email-settings/test (returns 400 on failure so Italian detail passes the ingress). Inquiry emails sent non-blocking on POST /api/inquiries when enabled; inquiry always saves even if email fails. Fields: sender email, app password, sender name, receiver, CC, on/off toggle.
- Testing: iteration_4 — 42/42 backend pytest pass; full frontend flows verified (dashboard, media override on live homepage, story publish, email settings secret redaction + graceful test failure, client RBAC only-Storie).
- NOTE: email is INACTIVE until an admin enters a real Gmail address + App Password in Impostazioni and enables the toggle.

## Story editing + bulk media (2026-09-17)
- Storie/Blog: each story card now has an edit (pencil) button → loads the story into the form ("Modifica storia", Annulla to cancel), saves via PUT /api/stories/{id}. Cover preloaded from cover_url; uploading a new cover replaces it. Verified PUT persists.
- Immagini Sito: per-section "Carica in blocco" (multiple-file input + drag-drop zone) assigns dropped images to that section's slots in order; each media card is also a drag-and-drop target for a single image. Uses existing POST /api/site-assets per file. No backend change needed.
