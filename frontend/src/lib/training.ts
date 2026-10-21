// Tipi e utilità condivise per "Corsi in partenza", iscrizioni e verifica attestati.

export interface UpcomingCourse {
  id: string;
  title: string;
  subtitle: string;
  kind: string;
  hours: number | null;
  modality: string;
  legal_ref: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  schedule: string;
  location: string;
  trainer: string;
  audience: string;
  program: string[];
  program_note: string;
  final_test: string;
  certificate_note: string;
  validity_years: number | null;
  seats: number | null;
  price: string;
  registration_open: boolean;
  seats_left: number | null;
  is_full: boolean;
  can_enroll: boolean;
}

export interface AdminCourse extends UpcomingCourse {
  published: boolean;
  created_at: string;
  enrolled: number;
  new_enrollments: number;
}

export interface Enrollment {
  id: string;
  course_id: string;
  course_title: string;
  course_date: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_place: string;
  birth_date: string;
  company: string;
  tax_code: string;
  notes: string;
  status: 'nuova' | 'confermata' | 'annullata';
  certificate_id: string | null;
  created_at: string;
}

export interface PublicCertificate {
  code: string;
  first_name: string;
  last_name: string;
  birth_place: string;
  birth_date: string;
  course_type: string;
  course_date: string;
  course_end_date: string;
  course_hours: number | null;
  validity_years: number | null;
  expiry_date: string;
  status: 'valido' | 'scaduto' | 'revocato';
  issuer: string;
  issued_at: string;
}

export interface AdminCertificate extends PublicCertificate {
  id: string;
  tax_code: string;
  notes: string;
  revoked: boolean;
  course_id: string | null;
  enrollment_id: string | null;
  created_at: string;
}

const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MONTHS_SHORT = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
const WEEKDAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

function parts(iso: string): [number, number, number] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/** 2026-10-03 → 03/10/2026 (senza conversioni di fuso orario). */
export function fmtDate(iso?: string | null): string {
  const p = parts(iso || '');
  if (!p) return iso || '';
  return `${String(p[2]).padStart(2, '0')}/${String(p[1]).padStart(2, '0')}/${p[0]}`;
}

/** 2026-10-03 → sabato 3 ottobre 2026 */
export function fmtLongDate(iso?: string | null): string {
  const p = parts(iso || '');
  if (!p) return iso || '';
  const d = new Date(p[0], p[1] - 1, p[2]);
  return `${WEEKDAYS[d.getDay()]} ${p[2]} ${MONTHS[p[1] - 1]} ${p[0]}`;
}

export function dateBlock(iso: string): { day: string; month: string; year: string } {
  const p = parts(iso);
  if (!p) return { day: '--', month: '', year: '' };
  return { day: String(p[2]).padStart(2, '0'), month: MONTHS_SHORT[p[1] - 1], year: String(p[0]) };
}

/** Intervallo date: "03/10/2026" oppure "dal 03/10/2026 al 05/10/2026". */
export function fmtRange(start: string, end?: string | null): string {
  if (!end || end === start) return fmtDate(start);
  return `dal ${fmtDate(start)} al ${fmtDate(end)}`;
}

export function fmtHours(h?: number | null): string {
  if (!h) return '';
  const n = Number.isInteger(h) ? String(h) : String(h).replace('.', ',');
  return `${n} ${h === 1 ? 'ora' : 'ore'}`;
}

export function fmtValidity(years?: number | null): string {
  if (!years) return 'Senza scadenza';
  return `${years} ${years === 1 ? 'anno' : 'anni'}`;
}

/** DD/MM/YYYY o YYYY-MM-DD → YYYY-MM-DD ('' se non valida). */
export function toIsoDate(value: string): string {
  const v = (value || '').trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(v);
  let y: number, mo: number, d: number;
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else {
    m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(v);
    if (!m) return '';
    d = +m[1]; mo = +m[2]; y = +m[3];
  }
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return '';
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Estrae il messaggio d'errore (in italiano) restituito dal server. */
export function apiError(err: unknown, fallback = 'Si è verificato un errore. Riprova.'): string {
  const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return typeof d === 'string' ? d : fallback;
}

/**
 * Indirizzo pubblico del sito usato nei QR code degli attestati.
 * Impostare REACT_APP_PUBLIC_SITE_URL (es. https://emsafetygroup.it) per fissare il dominio definitivo;
 * altrimenti viene usato il dominio da cui si apre il pannello admin.
 */
export function publicSiteUrl(): string {
  const env = (process.env.REACT_APP_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
  return env || window.location.origin;
}

export function verifyUrl(code: string): string {
  return `${publicSiteUrl()}/verifica/${encodeURIComponent(code)}`;
}
