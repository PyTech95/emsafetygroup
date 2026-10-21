// Configurazione SEO / GEO / AEO del sito E.M Safety.
// Unica fonte per: <title>, meta description, canonical, Open Graph, dati strutturati (JSON-LD),
// sitemap.xml, llms.txt e HTML pre-renderizzato (vedi frontend/scripts/seo-build.js).
// Titoli e descrizioni sono modificabili anche dal pannello admin → Testi Sito → "SEO".

import { COMPANY, SERVICES } from '../data/siteContent';
import { FAQ_DATA, COURSES_DATA } from '../data/coursesData';

export const SITE_URL = (process.env.REACT_APP_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '') || 'https://emsafetygroup.it';

export const SITE = {
  name: 'E.M Safety',
  legalName: COMPANY.name,
  alternateName: ['EM Safety', 'E.M. Safety', 'EM Safety Group', 'E.M Safety Group'],
  url: SITE_URL,
  logo: `${SITE_URL}/assets/images/em-logo.png`,
  image: `${SITE_URL}/assets/images/og-emsafety.jpg`,
  locale: 'it_IT',
  language: 'it-IT',
  description:
    'Società di consulenza e formazione per la salute e sicurezza nei luoghi di lavoro (D.Lgs 81/08): RSPP esterno, DVR, Sistemi di Gestione ISO 45001, 9001 e 14001, sorveglianza sanitaria, antincendio e corsi accreditati secondo gli Accordi Stato-Regioni. Sedi a Treviso e Milano.',
};

export const ADDRESSES = {
  treviso: { streetAddress: 'Strada di Boiago, 11/b', postalCode: '31100', addressLocality: 'Treviso', addressRegion: 'TV', addressCountry: 'IT' },
  milano: { streetAddress: 'Piazza Gae Aulenti, Torre B', postalCode: '20100', addressLocality: 'Milano', addressRegion: 'MI', addressCountry: 'IT' },
};

export type ChangeFreq = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface PageSeo {
  path: string;
  key: string;            // chiave per i testi modificabili: seo.<key>.title / seo.<key>.description
  heading: string;        // prefisso dei testi pagina (page.<x>.title, .highlight, .subtitle)
  title: string;          // ≈ 50–60 caratteri
  description: string;    // ≈ 120–160 caratteri
  breadcrumb: string;
  type: 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';
  priority: number;
  changefreq: ChangeFreq;
}

export const PAGES: PageSeo[] = [
  {
    path: '/', key: 'home', heading: 'home.hero', breadcrumb: 'Home', type: 'WebPage', priority: 1.0, changefreq: 'weekly',
    title: 'Sicurezza sul lavoro e formazione D.Lgs 81/08 | E.M Safety',
    description: 'Consulenza sulla sicurezza sul lavoro, RSPP esterno, DVR, sistemi ISO e corsi accreditati con attestato verificabile online. Sedi a Treviso e Milano.',
  },
  {
    path: '/informazioni', key: 'informazioni', heading: 'page.chi', breadcrumb: 'Chi siamo', type: 'AboutPage', priority: 0.7, changefreq: 'monthly',
    title: 'Chi siamo: consulenza e formazione sicurezza | E.M Safety',
    description: 'E.M Safety affianca le imprese nella sicurezza sul lavoro e nella conformità normativa con consulenti e formatori qualificati. Sedi a Treviso e Milano.',
  },
  {
    path: '/servizi', key: 'servizi', heading: 'page.servizi', breadcrumb: 'Servizi', type: 'CollectionPage', priority: 0.9, changefreq: 'monthly',
    title: 'Servizi sicurezza sul lavoro: RSPP, DVR, ISO 45001 | E.M Safety',
    description: 'RSPP esterno, DVR e valutazione dei rischi, sistemi di gestione ISO 45001, 9001 e 14001, sorveglianza sanitaria, antincendio e formazione per le aziende.',
  },
  {
    path: '/corsi', key: 'corsi', heading: 'page.corsi', breadcrumb: 'Corsi in partenza', type: 'CollectionPage', priority: 0.9, changefreq: 'daily',
    title: 'Corsi sicurezza sul lavoro in partenza | E.M Safety',
    description: 'Calendario dei corsi sulla sicurezza sul lavoro conformi al D.Lgs 81/08 e agli Accordi Stato-Regioni. Iscrizione online e attestato con QR code verificabile.',
  },
  {
    path: '/verifica-attestato', key: 'verifica', heading: 'page.verifica', breadcrumb: 'Verifica attestato', type: 'WebPage', priority: 0.7, changefreq: 'monthly',
    title: 'Verifica attestato di formazione con QR code | E.M Safety',
    description: 'Controlla in tempo reale autenticità e validità di un attestato E.M Safety: inquadra il QR code o inserisci il codice univoco riportato sull’attestato.',
  },
  {
    path: '/storie', key: 'storie', heading: 'page.storie', breadcrumb: 'Storie di successo', type: 'CollectionPage', priority: 0.6, changefreq: 'weekly',
    title: 'Casi di successo nella sicurezza sul lavoro | E.M Safety',
    description: 'Progetti reali di consulenza e formazione: come E.M Safety ha aiutato aziende di diversi settori a raggiungere la piena conformità al D.Lgs 81/08.',
  },
  {
    path: '/testimonianze', key: 'testimonianze', heading: 'page.test', breadcrumb: 'Testimonianze', type: 'WebPage', priority: 0.5, changefreq: 'monthly',
    title: 'Testimonianze dei clienti | E.M Safety',
    description: 'Le opinioni di aziende e responsabili HSE che hanno scelto E.M Safety per la consulenza sulla sicurezza sul lavoro, i sistemi di gestione e la formazione.',
  },
  {
    path: '/faq', key: 'faq', heading: 'page.faq', breadcrumb: 'FAQ', type: 'FAQPage', priority: 0.7, changefreq: 'monthly',
    title: 'Domande frequenti su sicurezza, corsi e attestati | E.M Safety',
    description: 'Risposte chiare su verifica dei requisiti formativi, corsi in azienda, tempi di preventivo e validità degli attestati di formazione in tutta Italia.',
  },
  {
    path: '/contatti', key: 'contatti', heading: 'page.contatti', breadcrumb: 'Contatti', type: 'ContactPage', priority: 0.8, changefreq: 'yearly',
    title: 'Contatti e preventivo gratuito | E.M Safety Treviso e Milano',
    description: 'Richiedi una consulenza o un preventivo gratuito: sede legale a Treviso, sede operativa a Milano (Piazza Gae Aulenti). Tel. +39 0422 1456565.',
  },
];

// Domande e risposte "answer-first" mostrate nelle pagine e marcate come FAQPage (AEO).
export interface QA { q: string; a: string }

export const CORSI_FAQ: QA[] = [
  {
    q: 'Come ci si iscrive a un corso E.M Safety?',
    a: 'Scegli l’edizione nel calendario dei corsi in partenza, apri la scheda e compila il modulo di iscrizione online con i tuoi dati e luogo e data di nascita. Ricevi poi la conferma dal nostro centro di formazione.',
  },
  {
    q: 'L’attestato è valido in tutta Italia?',
    a: 'Sì. I corsi sono conformi al D.Lgs 81/08 e agli Accordi Stato-Regioni e l’attestato riporta un codice univoco e un QR code che chiunque può verificare online.',
  },
  {
    q: 'Ogni quanto va rinnovato l’attestato?',
    a: 'Dipende dal corso: la validità è indicata nella scheda di ogni edizione e sull’attestato (ad esempio 5 anni per l’aggiornamento degli addetti ai carrelli elevatori). Alla scadenza serve un corso di aggiornamento.',
  },
  {
    q: 'È possibile svolgere i corsi direttamente in azienda?',
    a: 'Sì. Oltre alle sedi di Treviso e Milano e alla formazione in videoconferenza, organizziamo corsi in azienda con esercitazioni pratiche sulle attrezzature e sugli spazi reali dell’impresa.',
  },
];

export const VERIFY_FAQ: QA[] = [
  {
    q: 'Come si verifica un attestato di formazione E.M Safety?',
    a: 'Inquadra con lo smartphone il QR code stampato sull’attestato oppure inserisci il codice univoco nella pagina Verifica attestato: il sistema mostra in tempo reale i dati registrati e lo stato dell’attestato.',
  },
  {
    q: 'Dove trovo il codice dell’attestato?',
    a: 'Il codice è stampato sull’attestato, vicino al QR code, nel formato EMS-ANNO-XXXX-XXXX (ad esempio EMS-2026-7KQ4-P9XD).',
  },
  {
    q: 'Cosa significa “attestato scaduto”?',
    a: 'L’attestato è autentico ma il suo periodo di validità è terminato: il lavoratore deve frequentare il corso di aggiornamento previsto per mantenere l’abilitazione.',
  },
  {
    q: 'Quali dati vengono mostrati nella verifica?',
    a: 'Nome e cognome, luogo e data di nascita, tipologia del corso, data di svolgimento, durata, validità e scadenza. I dati sono visibili solo a chi possiede il codice univoco dell’attestato.',
  },
];

// ---------------------------------------------------------------- helpers JSON-LD

type T = (key: string) => string | undefined;
type Json = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function absUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : absUrl(path.replace(/\/+$/, ''));
}

function text(t: T | undefined, key: string, fallback: string): string {
  const v = t?.(key);
  return v && v !== key ? v : fallback;
}

export function organizationLd(): Json {
  return {
    '@type': ['ProfessionalService', 'EducationalOrganization'],
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: SITE.alternateName,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: SITE.logo, width: 827, height: 480 },
    image: SITE.image,
    description: SITE.description,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    vatID: `IT${COMPANY.vat}`,
    address: { '@type': 'PostalAddress', ...ADDRESSES.treviso },
    location: [
      { '@type': 'Place', name: 'E.M Safety — Sede legale Treviso', address: { '@type': 'PostalAddress', ...ADDRESSES.treviso } },
      { '@type': 'Place', name: 'E.M Safety — Sede operativa Milano', address: { '@type': 'PostalAddress', ...ADDRESSES.milano } },
    ],
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer service', telephone: COMPANY.phone, email: COMPANY.email, areaServed: 'IT', availableLanguage: ['Italian'] },
      { '@type': 'ContactPoint', contactType: 'sales', telephone: COMPANY.mobile, areaServed: 'IT', availableLanguage: ['Italian'] },
    ],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    ],
    areaServed: [
      { '@type': 'Country', name: 'Italia' },
      { '@type': 'AdministrativeArea', name: 'Veneto' },
      { '@type': 'AdministrativeArea', name: 'Lombardia' },
    ],
    knowsAbout: [
      'Sicurezza sul lavoro', 'D.Lgs 81/08', 'RSPP esterno', 'Documento di Valutazione dei Rischi (DVR)', 'ISO 45001', 'ISO 9001', 'ISO 14001',
      'Modelli di Organizzazione e Gestione 231', 'Formazione Accordo Stato-Regioni', 'Prevenzione incendi', 'Primo soccorso', 'Sorveglianza sanitaria',
      'Carrelli elevatori', 'Formazione preposti', 'Formazione dirigenti',
    ],
    memberOf: [
      { '@type': 'Organization', name: 'ANFOS — Associazione Nazionale Formatori della Sicurezza sul Lavoro' },
      { '@type': 'Organization', name: 'O.P.N. Italia Lavoro — Organismo Paritetico Nazionale' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servizi di consulenza e formazione sulla sicurezza sul lavoro',
      itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.description } })),
    },
  };
}

export function websiteLd(): Json {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE_URL}/`, name: SITE.name, alternateName: SITE.alternateName, inLanguage: SITE.language, publisher: { '@id': ORG_ID } };
}

export function breadcrumbLd(trail: { name: string; path: string }[]): Json {
  const url = canonicalUrl(trail[trail.length - 1]?.path || '/');
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: canonicalUrl(c.path) })),
  };
}

export function webPageLd(opts: { path: string; title: string; description: string; type?: string; trail?: { name: string; path: string }[]; extra?: Json }): Json {
  const url = canonicalUrl(opts.path);
  return {
    '@type': opts.type || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: SITE.language,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: SITE.image },
    ...(opts.trail && opts.trail.length > 1 ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(opts.extra || {}),
  };
}

export function faqLd(items: QA[], id?: string): Json {
  return {
    '@type': 'FAQPage',
    ...(id ? { '@id': id } : {}),
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function homeFaq(t?: T): QA[] {
  return FAQ_DATA.map((f) => ({ q: text(t, `faq.${f.id}.question`, f.question), a: text(t, `faq.${f.id}.answer`, f.answer) }));
}

export function servicesLd(): Json {
  return {
    '@type': 'ItemList',
    name: 'Servizi E.M Safety',
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        serviceType: s.title,
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'Italia' },
        url: `${SITE_URL}/servizi`,
      },
    })),
  };
}

export function courseCatalogLd(): Json {
  return {
    '@type': 'ItemList',
    name: 'Catalogo corsi di formazione sulla sicurezza sul lavoro',
    itemListElement: COURSES_DATA.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.title,
        description: c.description,
        provider: { '@id': ORG_ID },
        inLanguage: 'it',
        timeRequired: `PT${c.hours}H`,
        educationalCredentialAwarded: c.certification,
        audience: { '@type': 'Audience', audienceType: c.targetAudience },
        url: `${SITE_URL}/corsi#catalogo`,
      },
    })),
  };
}

export interface ResolvedSeo {
  path: string;
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  image?: string;
  ogType?: string;
  jsonLd: Json[];
}

/** SEO completo di una pagina statica. `t` = testi modificabili dall'admin (facoltativo). */
export function staticPageSeo(path: string, t?: T): ResolvedSeo | null {
  const page = PAGES.find((p) => p.path === path);
  if (!page) return null;
  const title = text(t, `seo.${page.key}.title`, page.title);
  const description = text(t, `seo.${page.key}.description`, page.description);
  const trail = page.path === '/' ? [{ name: 'Home', path: '/' }] : [{ name: 'Home', path: '/' }, { name: page.breadcrumb, path: page.path }];
  const jsonLd: Json[] = [organizationLd(), websiteLd()];
  const pageNode = webPageLd({ path, title, description, type: page.type, trail });
  if (page.type === 'FAQPage') Object.assign(pageNode, { mainEntity: faqLd(homeFaq(t)).mainEntity });
  if (page.type === 'ContactPage' || page.type === 'AboutPage') Object.assign(pageNode, { mainEntity: { '@id': ORG_ID } });
  jsonLd.push(pageNode);
  if (trail.length > 1) jsonLd.push(breadcrumbLd(trail));
  if (path === '/servizi') jsonLd.push(servicesLd());
  if (path === '/corsi') { jsonLd.push(courseCatalogLd()); jsonLd.push(faqLd(CORSI_FAQ, `${canonicalUrl(path)}#faq`)); }
  if (path === '/verifica-attestato') jsonLd.push(faqLd(VERIFY_FAQ, `${canonicalUrl(path)}#faq`));
  return { path, title, description, canonical: canonicalUrl(path), jsonLd };
}

export const NOINDEX_PREFIXES = ['/verifica/', '/admin'];
