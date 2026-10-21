// SEO delle pagine dinamiche (dati dal database): scheda corso, storia di successo, 404.
import { ADDRESSES, ORG_ID, ResolvedSeo, SITE, absUrl, breadcrumbLd, canonicalUrl, organizationLd, webPageLd, websiteLd } from './config';
import type { UpcomingCourse } from '../lib/training';

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s);
const BRAND = ' | E.M Safety';
/** Primo titolo candidato che sta in ~65 caratteri (limite visibile su Google), senza troncamenti a metà. */
const fitTitle = (candidates: string[], max = 65) => candidates.find((c) => c.length <= max) || clip(candidates[candidates.length - 1], max);

function fmt(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/** "8:00–12:00" → ['08:00', '12:00'] */
function parseSchedule(schedule: string): [string, string] | null {
  const m = /(\d{1,2})[:.](\d{2})\s*[–—-]\s*(\d{1,2})[:.](\d{2})/.exec(schedule || '');
  if (!m) return null;
  return [`${m[1].padStart(2, '0')}:${m[2]}`, `${m[3].padStart(2, '0')}:${m[4]}`];
}

function parsePrice(price: string): number | null {
  const m = /(\d+(?:[.,]\d{1,2})?)/.exec((price || '').replace(/\.(?=\d{3}\b)/g, ''));
  return m ? Number(m[1].replace(',', '.')) : null;
}

export function courseSeo(c: UpcomingCourse): ResolvedSeo {
  const path = `/corsi/${c.id}`;
  const url = canonicalUrl(path);
  const when = fmt(c.start_date);
  const where = c.location || c.modality || '';
  const city = /milano/i.test(c.location) ? 'Milano' : /treviso/i.test(c.location) ? 'Treviso' : '';
  const kind = c.kind ? ` (${c.kind})` : '';
  const title = fitTitle([
    `${c.title}${kind} – ${when}${city ? ` ${city}` : ''}${BRAND}`,
    `${c.title} – ${when}${city ? ` ${city}` : ''}${BRAND}`,
    `${c.title} – ${when}${BRAND}`,
    `${c.title}${BRAND}`,
    c.title,
  ]);
  const period = c.end_date ? `dal ${when} al ${fmt(c.end_date)}` : `il ${when}`;
  const description = clip(
    `${c.subtitle ? `${c.subtitle} ` : ''}Corso${c.hours ? ` di ${c.hours} ore` : ''} ${period}${where ? ` · ${where}` : ''}. ${c.legal_ref ? `${c.legal_ref}. ` : ''}Iscrizione online e attestato con QR code verificabile.`,
    160,
  );
  const times = parseSchedule(c.schedule);
  const startDate = times ? `${c.start_date}T${times[0]}` : c.start_date;
  const endDate = times ? `${c.end_date || c.start_date}T${times[1]}` : c.end_date || c.start_date;
  const mod = (c.modality || '').toLowerCase();
  const online = /online|videoconf|fad|remot/.test(mod);
  const mixed = /mist|blend/.test(mod);
  const loc = (c.location || '').toLowerCase();
  const knownAddress = loc.includes('milano') ? ADDRESSES.milano : loc.includes('treviso') ? ADDRESSES.treviso : null;
  const place = {
    '@type': 'Place',
    name: c.location || 'E.M Safety',
    address: knownAddress ? { '@type': 'PostalAddress', ...knownAddress } : c.location || { '@type': 'PostalAddress', ...ADDRESSES.treviso },
  };
  const virtual = { '@type': 'VirtualLocation', url };
  const location = online ? virtual : mixed ? [place, virtual] : place;
  const price = parsePrice(c.price);
  const offers = price !== null
    ? {
      '@type': 'Offer', url, price, priceCurrency: 'EUR', category: 'Paid',
      availability: c.can_enroll ? 'https://schema.org/InStock' : c.is_full ? 'https://schema.org/SoldOut' : 'https://schema.org/OutOfStock',
    }
    : undefined;
  const instructor = c.trainer ? { '@type': 'Person', name: c.trainer } : undefined;
  const trail = [{ name: 'Home', path: '/' }, { name: 'Corsi in partenza', path: '/corsi' }, { name: c.title, path }];

  const event = {
    '@type': 'EducationEvent',
    '@id': `${url}#event`,
    name: `${c.title}${c.kind ? ` — ${c.kind}` : ''}`,
    description: c.subtitle || description,
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: online ? 'https://schema.org/OnlineEventAttendanceMode' : mixed ? 'https://schema.org/MixedEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location,
    image: [SITE.image],
    organizer: { '@id': ORG_ID },
    ...(instructor ? { performer: instructor } : {}),
    ...(offers ? { offers } : {}),
    inLanguage: 'it',
    url,
  };
  const course = {
    '@type': 'Course',
    '@id': `${url}#course`,
    name: c.title,
    description: c.subtitle || description,
    provider: { '@id': ORG_ID },
    inLanguage: 'it',
    ...(c.hours ? { timeRequired: `PT${c.hours}H` } : {}),
    ...(c.program.length ? { syllabusSections: c.program.map((p) => ({ '@type': 'Syllabus', name: p })) } : {}),
    ...(c.audience ? { audience: { '@type': 'Audience', audienceType: c.audience } } : {}),
    educationalCredentialAwarded: c.certificate_note || 'Attestato di formazione con QR code verificabile',
    ...(offers ? { offers } : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: online ? 'Online' : mixed ? 'Blended' : 'Onsite',
      startDate,
      endDate,
      location,
      ...(c.hours ? { courseWorkload: `PT${c.hours}H` } : {}),
      ...(instructor ? { instructor } : {}),
    },
  };
  return {
    path, title, description, canonical: url, ogType: 'website',
    jsonLd: [organizationLd(), websiteLd(), webPageLd({ path, title, description, trail }), breadcrumbLd(trail), course, event],
  };
}

export function storySeo(s: { id: string; title: string; summary: string; sector?: string; cover_url?: string | null; created_at: string }, coverAbs?: string): ResolvedSeo {
  const path = `/storie/${s.id}`;
  const url = canonicalUrl(path);
  const title = fitTitle([`${s.title}${BRAND}`, s.title]);
  const description = clip(s.summary, 160);
  const trail = [{ name: 'Home', path: '/' }, { name: 'Storie di successo', path: '/storie' }, { name: s.title, path }];
  const image = coverAbs || SITE.image;
  const article = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: clip(s.title, 110),
    description,
    image: [image],
    datePublished: s.created_at,
    dateModified: s.created_at,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    ...(s.sector ? { articleSection: s.sector } : {}),
    inLanguage: 'it',
  };
  return {
    path, title, description, canonical: url, image, ogType: 'article',
    jsonLd: [organizationLd(), websiteLd(), webPageLd({ path, title, description, trail }), breadcrumbLd(trail), article],
  };
}

export function notFoundSeo(path: string): ResolvedSeo {
  return { path, title: 'Pagina non trovata | E.M Safety', description: SITE.description, canonical: absUrl(path), noindex: true, jsonLd: [] };
}
