// Gestione del consenso cookie (banner "Informativa").
//
// Se in futuro vengono aggiunti Google Analytics / Google Ads o altri strumenti di tracciamento,
// caricarli SOLO quando hasConsent('statistics') / hasConsent('marketing') è true, ad esempio:
//
//   onConsentChange((c) => { if (c.statistics) loadAnalytics(); });
//
// Se gtag è presente, il consenso viene inoltrato automaticamente a Google Consent Mode v2.

export interface ConsentState {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
}

const KEY = 'em_cookie_consent';
const VERSION = 1;
const MAX_AGE_DAYS = 180; // la scelta viene richiesta di nuovo dopo 6 mesi
const EVENT = 'em:consent-change';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readCookie(): string | null {
  try {
    const m = document.cookie.split('; ').find((c) => c.startsWith(`${KEY}=`));
    return m ? decodeURIComponent(m.slice(KEY.length + 1)) : null;
  } catch {
    return null;
  }
}

function writeCookie(value: string) {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${KEY}=${encodeURIComponent(value)}; Max-Age=${MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* cookie non disponibili */
  }
}

function parse(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as ConsentState;
    if (c.version !== VERSION) return null;
    const age = (Date.now() - new Date(c.updatedAt).getTime()) / 86400000;
    if (!(age >= 0 && age < MAX_AGE_DAYS)) return null;
    return c;
  } catch {
    return null;
  }
}

let memory: ConsentState | null = null; // ultima scelta valida per questa visita, anche senza storage

/** Legge la scelta da localStorage, poi dal cookie tecnico (browser che bloccano lo storage). */
export function getConsent(): ConsentState | null {
  let fromStorage: string | null = null;
  try { fromStorage = window.localStorage.getItem(KEY); } catch { /* storage bloccato */ }
  return parse(fromStorage) || parse(readCookie()) || memory;
}

export function saveConsent(choice: { statistics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = { necessary: true, ...choice, updatedAt: new Date().toISOString(), version: VERSION };
  const raw = JSON.stringify(state);
  memory = state;
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    /* storage non disponibile (es. navigazione privata): resta il cookie */
  }
  writeCookie(raw);
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: state.statistics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
    });
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(EVENT, { detail: state }));
  return state;
}

export function hasConsent(category: 'statistics' | 'marketing'): boolean {
  return !!getConsent()?.[category];
}

export function onConsentChange(cb: (c: ConsentState) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<ConsentState>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
