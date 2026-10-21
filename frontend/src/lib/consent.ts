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

export function getConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as ConsentState;
    if (c.version !== VERSION) return null;
    const age = (Date.now() - new Date(c.updatedAt).getTime()) / 86400000;
    if (!(age >= 0 && age < MAX_AGE_DAYS)) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { statistics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = { necessary: true, ...choice, updatedAt: new Date().toISOString(), version: VERSION };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage non disponibile (es. navigazione privata): la scelta vale per questa visita */
  }
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
