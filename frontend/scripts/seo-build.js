#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * SEO / GEO / AEO — post-build.
 *
 * Eseguito automaticamente dopo `craco build` (vedi "build" in package.json). Genera:
 *   - build/<pagina>/index.html (+ <pagina>.html): HTML pre-renderizzato per ogni pagina statica con
 *     title, description, canonical, Open Graph, JSON-LD e contenuto testuale leggibile senza JavaScript
 *     (motori di ricerca e crawler AI come GPTBot, ClaudeBot, PerplexityBot);
 *   - build/robots.txt, build/sitemap.xml, build/llms.txt.
 * Con `--public` scrive robots.txt, sitemap.xml e llms.txt anche in public/ (copia di riserva).
 *
 * Variabili opzionali (frontend/.env):
 *   REACT_APP_PUBLIC_SITE_URL=https://emsafetygroup.it      dominio canonico
 *   REACT_APP_GOOGLE_SITE_VERIFICATION=xxxx                  meta di verifica Google Search Console
 *   REACT_APP_BING_SITE_VERIFICATION=xxxx                    meta di verifica Bing Webmaster Tools
 *
 * Lo script non fa mai fallire la build: in caso di errore lascia il sito SPA così com'è.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const BUILD = path.join(ROOT, 'build');
const PUBLIC = path.join(ROOT, 'public');

try { require('dotenv').config({ path: path.join(ROOT, '.env') }); } catch (e) { /* facoltativo */ }

// ------------------------------------------------------------------ loader TypeScript minimale
let ts = null; // caricato in main(): se manca, lo script si ferma senza rompere la build
const cache = {};
function loadTs(file) {
  if (cache[file]) return cache[file].exports;
  const source = fs.readFileSync(file, 'utf8');
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019, jsx: ts.JsxEmit.React, esModuleInterop: true },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  cache[file] = mod;
  const localRequire = (spec) => {
    if (spec === 'lucide-react') return new Proxy({}, { get: () => function Icon() { return null; } });
    if (spec.startsWith('.')) {
      const base = path.resolve(path.dirname(file), spec);
      for (const ext of ['.ts', '.tsx', '.js', '/index.ts']) if (fs.existsSync(base + ext)) return loadTs(base + ext);
    }
    return require(spec);
  };
  // eslint-disable-next-line no-new-func
  new Function('require', 'module', 'exports', 'process', out)(localRequire, mod, mod.exports, process);
  return mod.exports;
}

// ------------------------------------------------------------------ utilità
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLdScript = (graph) =>
  `<script type="application/ld+json" data-seo="jsonld">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;

function headTags(seo, { site, withCanonical, verification }) {
  const image = seo.image || site.image;
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}">`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">`,
    withCanonical ? `<link rel="canonical" href="${esc(seo.canonical)}">` : '',
    withCanonical ? `<link rel="alternate" hreflang="it" href="${esc(seo.canonical)}">` : '',
    withCanonical ? `<link rel="alternate" hreflang="x-default" href="${esc(seo.canonical)}">` : '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:locale" content="${esc(site.locale)}">`,
    `<meta property="og:title" content="${esc(seo.title)}">`,
    `<meta property="og:description" content="${esc(seo.description)}">`,
    withCanonical ? `<meta property="og:url" content="${esc(seo.canonical)}">` : '',
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(seo.title)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(seo.title)}">`,
    `<meta name="twitter:description" content="${esc(seo.description)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`,
    verification.google ? `<meta name="google-site-verification" content="${esc(verification.google)}">` : '',
    verification.bing ? `<meta name="msvalidate.01" content="${esc(verification.bing)}">` : '',
    jsonLdScript(seo.jsonLd),
  ];
  return tags.filter(Boolean).join('');
}

function stripSeoTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+|google-site-verification|msvalidate\.01)"[^>]*>/gi, '')
    .replace(/<link\s+rel="(?:canonical|alternate)"[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
}

function main() {
  ts = require('typescript');
  const publicMode = process.argv.includes('--public');
  const cfg = loadTs(path.join(SRC, 'seo', 'config.ts'));
  const site = loadTs(path.join(SRC, 'data', 'siteContent.ts'));
  const courses = loadTs(path.join(SRC, 'data', 'coursesData.ts'));
  const texts = loadTs(path.join(SRC, 'data', 'textRegistry.ts')).TEXT_DEFAULTS;
  const { SITE, SITE_URL, PAGES, staticPageSeo, homeFaq, CORSI_FAQ, VERIFY_FAQ, canonicalUrl } = cfg;
  const { COMPANY, SERVICES, VALUES, METHOD } = site;
  const { COURSES_DATA } = courses;
  const tx = (k) => texts[k] || '';
  const verification = {
    google: (process.env.REACT_APP_GOOGLE_SITE_VERIFICATION || '').trim(),
    bing: (process.env.REACT_APP_BING_SITE_VERIFICATION || '').trim(),
  };
  const today = new Date().toISOString().slice(0, 10);

  // ---------------------------------------------------------------- contenuto testuale per pagina
  const nav = PAGES.map((p) => `<a href="${p.path}">${esc(p.breadcrumb)}</a>`).join(' · ');
  const nap = `<address><strong>${esc(COMPANY.name)}</strong><br>Sede legale: ${esc(COMPANY.legalOffice)}<br>Sede operativa: ${esc(COMPANY.operativeOffice)}<br>Tel. <a href="${esc(COMPANY.phoneHref)}">${esc(COMPANY.phone)}</a> · Cell. <a href="${esc(COMPANY.mobileHref)}">${esc(COMPANY.mobile)}</a><br>Email: <a href="mailto:${esc(COMPANY.email)}">${esc(COMPANY.email)}</a> · PEC: ${esc(COMPANY.pec)}<br>Orari: ${esc(COMPANY.hours)}<br>P.IVA ${esc(COMPANY.vat)} · REA ${esc(COMPANY.rea)}</address>`;
  const qaHtml = (title, items) => `<section><h2>${esc(title)}</h2>${items.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>`;
  const servicesHtml = (detailed) => `<section><h2>Servizi per la sicurezza sul lavoro</h2>${SERVICES.map((s) => `<article><h3>${esc(s.title)}</h3><p>${esc(s.tagline ? `${s.tagline} ` : '')}${esc(s.description)}</p>${detailed && s.points ? `<ul>${s.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</article>`).join('')}<p><a href="/servizi">Tutti i servizi</a> · <a href="/contatti">Richiedi un preventivo gratuito</a></p></section>`;
  const catalogHtml = `<section id="catalogo"><h2>Catalogo corsi sulla sicurezza sul lavoro</h2>${COURSES_DATA.map((c) => `<article><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><p>Durata: ${esc(c.duration)} · Riferimento: ${esc(c.legalRef)} · Destinatari: ${esc(c.targetAudience)} · Attestato: ${esc(c.certification)}</p></article>`).join('')}<p><a href="/corsi">Corsi in partenza e iscrizione online</a></p></section>`;
  const heading = (p) => (p.path === '/'
    ? { h1: `${tx('home.hero.title1')} ${tx('home.hero.title2')}`, intro: tx('home.hero.description') }
    : { h1: `${tx(`${p.heading}.title`)} ${tx(`${p.heading}.highlight`)}`.trim(), intro: tx(`${p.heading}.subtitle`) });

  const sections = {
    '/': () => servicesHtml(false) + catalogHtml + `<section><h2>Verifica attestati con QR code</h2><p>Ogni attestato rilasciato da E.M Safety ha un codice univoco e un QR code verificabile da chiunque nella pagina <a href="/verifica-attestato">Verifica attestato</a>.</p></section>` + qaHtml('Domande frequenti', homeFaq()),
    '/informazioni': () => `<section><h2>${esc(tx('page.chi.missionTitle'))}</h2><p>${esc(tx('page.chi.missionP1'))}</p><p>${esc(tx('page.chi.missionP2'))}</p></section><section><h2>I nostri valori</h2>${VALUES.map((v) => `<h3>${esc(v.title)}</h3><p>${esc(v.text)}</p>`).join('')}</section>`,
    '/servizi': () => servicesHtml(true) + (METHOD ? `<section><h2>Il nostro metodo</h2><ol>${METHOD.map((m) => `<li><strong>${esc(m.title)}</strong>: ${esc(m.text || m.description || '')}</li>`).join('')}</ol></section>` : ''),
    '/corsi': () => `<section><h2>Calendario corsi</h2><p>Le edizioni in programma con date, sede, docente, posti disponibili e modulo di iscrizione online sono pubblicate in questa pagina e aggiornate continuamente.</p></section>` + catalogHtml + qaHtml('Domande frequenti sui corsi', CORSI_FAQ),
    '/verifica-attestato': () => `<section><h2>Come funziona la verifica</h2><ol><li>Inquadra il QR code stampato sull’attestato con la fotocamera dello smartphone.</li><li>Oppure inserisci il codice univoco nel formato EMS-ANNO-XXXX-XXXX.</li><li>Controlla titolare, luogo e data di nascita, corso, data, durata, validità e scadenza.</li></ol></section>` + qaHtml('Domande frequenti sulla verifica degli attestati', VERIFY_FAQ),
    '/faq': () => qaHtml('Domande frequenti', homeFaq()),
    '/contatti': () => `<section><h2>Sedi e contatti</h2>${nap}<p>Rispondiamo entro 24–48 ore lavorative. Consulenza e preventivo gratuiti.</p></section>`,
    '/storie': () => `<section><h2>Storie di successo</h2><p>Casi reali di aziende che hanno raggiunto la piena conformità al D.Lgs 81/08 con E.M Safety.</p></section>`,
    '/testimonianze': () => `<section><h2>Cosa dicono i clienti</h2><p>Opinioni di aziende e responsabili HSE che hanno scelto E.M Safety.</p></section>`,
  };

  function fallback(p) {
    const { h1, intro } = heading(p);
    const crumbs = p.path === '/' ? '' : `<nav aria-label="Percorso"><a href="/">Home</a> › ${esc(p.breadcrumb)}</nav>`;
    const body = (sections[p.path] || (() => ''))();
    // Contenuto per crawler senza JavaScript: nascosto visivamente (nessun "flash" o layout shift),
    // sostituito da React al caricamento; visibile se JavaScript è disattivato.
    return `<div data-prerender style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:normal">`
      + `<header><a href="/">${esc(SITE.name)}</a><nav aria-label="Navigazione principale">${nav}</nav></header>`
      + `<main>${crumbs}<h1>${esc(h1)}</h1>${intro ? `<p>${esc(intro)}</p>` : ''}${body}</main>`
      + `<footer>${nap}<p><a href="/corsi">Corsi in partenza</a> · <a href="/verifica-attestato">Verifica attestato</a> · <a href="/contatti">Contatti</a></p></footer></div>`;
  }

  // ---------------------------------------------------------------- robots.txt, sitemap.xml, llms.txt
  const rules = 'Allow: /\nDisallow: /admin\nDisallow: /verifica/\nDisallow: /api/certificates/\n';
  const robots = `# robots.txt — ${SITE.name}\nUser-agent: *\n${rules}\n`
    + '# Motori di ricerca e assistenti AI: accesso consentito ai contenuti pubblici (GEO)\n'
    + ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'DuckAssistBot']
      .map((u) => `User-agent: ${u}`).join('\n')
    + `\n${rules}\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/api/sitemap.xml\n`;

  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
    + PAGES.map((p) => `  <url>\n    <loc>${canonicalUrl(p.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>${p.path === '/' ? `\n    <image:image><image:loc>${SITE.image}</image:loc></image:image>` : ''}\n  </url>`).join('\n')
    + '\n</urlset>\n';

  const llms = [
    `# ${SITE.name} (${COMPANY.name})`,
    '',
    `> ${SITE.description}`,
    '',
    'Informazioni chiave:',
    `- Sito ufficiale: ${SITE_URL}/`,
    `- Sede legale: ${COMPANY.legalOffice}`,
    `- Sede operativa: ${COMPANY.operativeOffice}`,
    `- Telefono: ${COMPANY.phone} · Cellulare: ${COMPANY.mobile}`,
    `- Email: ${COMPANY.email} · PEC: ${COMPANY.pec}`,
    `- Orari: ${COMPANY.hours}`,
    `- P.IVA: ${COMPANY.vat} · REA: ${COMPANY.rea}`,
    '- Affiliazioni: ANFOS (Associazione Nazionale Formatori della Sicurezza sul Lavoro), O.P.N. Italia Lavoro (Organismo Paritetico Nazionale)',
    '',
    '## Servizi',
    ...SERVICES.map((s) => `- [${s.title}](${SITE_URL}/servizi): ${s.description}`),
    '',
    '## Formazione',
    `- [Corsi in partenza](${SITE_URL}/corsi): calendario aggiornato delle edizioni con date, sede, docente, posti disponibili e iscrizione online.`,
    ...COURSES_DATA.map((c) => `- ${c.title} (${c.legalRef}): ${c.description}`),
    '',
    '## Verifica attestati',
    `- [Verifica attestato](${SITE_URL}/verifica-attestato): ogni attestato E.M Safety riporta un codice univoco (formato EMS-ANNO-XXXX-XXXX) e un QR code; la pagina mostra in tempo reale titolare, corso, data, durata, validità e stato (valido, scaduto, revocato).`,
    '',
    '## Domande frequenti',
    ...[...homeFaq(), ...CORSI_FAQ, ...VERIFY_FAQ].map((f) => `- ${f.q} ${f.a}`),
    '',
    '## Pagine',
    ...PAGES.map((p) => `- [${p.breadcrumb}](${canonicalUrl(p.path)}): ${p.description}`),
    '',
  ].join('\n');

  const writeExtras = (dir) => {
    fs.writeFileSync(path.join(dir, 'robots.txt'), robots);
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap);
    fs.writeFileSync(path.join(dir, 'llms.txt'), llms);
  };

  if (publicMode) {
    writeExtras(PUBLIC);
    console.log('[seo] robots.txt, sitemap.xml, llms.txt scritti in public/');
    return;
  }
  if (!fs.existsSync(path.join(BUILD, 'index.html'))) {
    console.warn('[seo] build/index.html non trovato: esegui prima craco build');
    return;
  }

  // ---------------------------------------------------------------- pagine pre-renderizzate
  // Idempotente: se la build è già stata elaborata, riparte dal template SPA pulito
  const template = stripSeoTags(fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8'))
    .replace(/<div id="root">[\s\S]*?<\/noscript>/, '<div id="root"></div>');
  const render = (seo, page, { withCanonical }) => template
    .replace('</head>', `${headTags(seo, { site: SITE, withCanonical, verification })}</head>`)
    .replace(/<div id="root"><\/div>/, `<div id="root">${fallback(page)}</div><noscript><style>[data-prerender]{position:static!important;width:auto!important;height:auto!important;clip:auto!important;clip-path:none!important;padding:24px;font-family:sans-serif}</style></noscript>`);

  let count = 0;
  for (const p of PAGES) {
    const seo = staticPageSeo(p.path);
    if (p.path === '/') {
      // index.html è anche il fallback SPA per le pagine dinamiche (corsi, storie, 404):
      // niente canonical/og:url qui, li imposta React; JSON-LD solo a livello di sito.
      const rootSeo = { ...seo, jsonLd: seo.jsonLd.filter((n) => n['@id'] && (String(n['@id']).endsWith('#organization') || String(n['@id']).endsWith('#website'))) };
      fs.writeFileSync(path.join(BUILD, 'index.html'), render(rootSeo, p, { withCanonical: false }));
    } else {
      const html = render(seo, p, { withCanonical: true });
      const dir = path.join(BUILD, p.path.replace(/^\//, ''));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);
      fs.writeFileSync(`${dir}.html`, html);
    }
    count++;
  }
  writeExtras(BUILD);
  console.log(`[seo] ${count} pagine pre-renderizzate · robots.txt · sitemap.xml · llms.txt (${SITE_URL})${verification.google ? ' · verifica Google' : ''}`);
}

try {
  main();
} catch (err) {
  console.warn('[seo] generazione SEO non riuscita, la build resta valida:', err && err.message);
}
