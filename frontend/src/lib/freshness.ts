// Aggiornamento automatico del sito nei browser dei visitatori.
//
// Il server non invia intestazioni Cache-Control per le pagine HTML: i browser possono quindi
// riusare per ore (o giorni) una copia vecchia di una pagina, che carica il JavaScript della
// versione precedente. Qui la versione in uso (hash di main.[hash].js) viene confrontata con
// quella pubblicata sul server; se è cambiata:
//   1. si aggiornano nella cache del browser le copie delle pagine principali;
//   2. si ricarica la pagina, una sola volta per ogni nuova versione.
// Alla prima visita con una nuova versione si sostituiscono anche le altre pagine rimaste in cache
// con la versione vecchia, così chi arriva da un link o da un preferito vede subito quella nuova.

const BUILD_RE = /static\/js\/main\.([a-f0-9]+)\.js/;
const CHECK_EVERY_MS = 10 * 60 * 1000;

// Indirizzi da tenere aggiornati nella cache (con e senza "/" finale, come arrivano da Google o dai link)
const PATHS = ['/', '/informazioni', '/servizi', '/corsi', '/verifica-attestato', '/storie', '/testimonianze', '/faq', '/contatti'];
const URLS = Array.from(new Set(['/', '/index.html', '/admin', '/admin/login', ...PATHS.flatMap((p) => (p === '/' ? ['/'] : [p, `${p}/`]))]));

function currentBuild(): string {
  const s = Array.from(document.scripts).find((x) => BUILD_RE.test(x.src));
  return s ? BUILD_RE.exec(s.src)?.[1] || '' : '';
}

async function latestBuild(): Promise<string | null> {
  const r = await fetch(`/index.html?build-check=${Date.now()}`, { cache: 'no-store', credentials: 'same-origin' });
  if (!r.ok) return null;
  return BUILD_RE.exec(await r.text())?.[1] || null;
}

/**
 * Sostituisce nella cache HTTP del browser le copie delle pagine che caricano una versione diversa da `target`.
 * Si legge prima solo la cache (nessun traffico per chi non ha copie salvate); se il browser non permette
 * di leggerla (Safari) la pagina viene riscaricata solo quando `blindIfUnknown` è vero.
 */
async function refreshStalePages(target: string, blindIfUnknown: boolean): Promise<void> {
  await Promise.allSettled(URLS.map(async (u) => {
    let stale = blindIfUnknown;
    try {
      const cached = await fetch(u, { cache: 'only-if-cached', mode: 'same-origin', credentials: 'same-origin' });
      const h = cached.ok ? BUILD_RE.exec(await cached.text())?.[1] : null;
      stale = !!h && h !== target;
    } catch {
      /* non in cache, oppure il browser non supporta la lettura della sola cache */
    }
    if (stale) await fetch(u, { cache: 'reload', credentials: 'same-origin' });
  }));
}

function safeGet(store: Storage, key: string): string | null {
  try { return store.getItem(key); } catch { return null; }
}
function safeSet(store: Storage, key: string, value: string) {
  try { store.setItem(key, value); } catch { /* storage non disponibile */ }
}

export function startAutoUpdate(): () => void {
  const running = currentBuild();
  if (!running || process.env.NODE_ENV !== 'production') return () => {};

  let busy = false;
  let lastCheck = 0;

  const check = async () => {
    if (busy || Date.now() - lastCheck < 60 * 1000) return;
    busy = true;
    lastCheck = Date.now();
    try {
      const latest = await latestBuild();
      if (latest && latest !== running) {
        // evita cicli: una sola ricarica automatica per ogni nuova versione
        if (safeGet(sessionStorage, 'em_reloaded_for') === latest) return;
        safeSet(sessionStorage, 'em_reloaded_for', latest);
        await refreshStalePages(latest, true);
        safeSet(localStorage, 'em_build', latest);
        window.location.reload();
        return;
      }
      const seen = safeGet(localStorage, 'em_build');
      if (latest === running && seen !== running) {
        // prima visita con questa versione: si sistemano le altre pagine rimaste in cache
        await refreshStalePages(running, seen !== null);
        safeSet(localStorage, 'em_build', running);
      }
    } catch {
      /* offline o server non raggiungibile: si riprova più tardi */
    } finally {
      busy = false;
    }
  };

  const first = window.setTimeout(check, 3000);
  const timer = window.setInterval(check, CHECK_EVERY_MS);
  const onVisible = () => { if (document.visibilityState === 'visible') check(); };
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('focus', onVisible);
  return () => {
    window.clearTimeout(first);
    window.clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('focus', onVisible);
  };
}
