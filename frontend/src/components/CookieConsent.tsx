import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Lock, ArrowLeft } from 'lucide-react';
import LegalModal from './LegalModal';
import { LEGAL } from '../data/legal';
import { getConsent, saveConsent } from '../lib/consent';

type View = 'main' | 'options';

function Toggle({ checked, onChange, disabled, label, testid }: { checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean; label: string; testid: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      data-testid={testid}
      className={`relative w-12 h-7 rounded-full shrink-0 transition-colors ${checked ? 'bg-[#1e6fd9]' : 'bg-slate-300'} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

// Schermi bassi (portatili, telefoni in orizzontale): testi e spazi più compatti
const SHORT = '[@media(max-height:780px)]';

export default function CookieConsent() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => getConsent() === null);
  const [view, setView] = useState<View>('main');
  const [stats, setStats] = useState(() => getConsent()?.statistics ?? false);
  const [marketing, setMarketing] = useState(() => getConsent()?.marketing ?? false);
  const [policy, setPolicy] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isAdmin = pathname.startsWith('/admin');
  const visible = open && !isAdmin;

  // Blocca lo scroll della pagina mentre l'informativa è aperta (il testo dell'informativa resta scorrevole)
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => window.__lenis?.stop(), 0);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      window.clearTimeout(t);
      document.documentElement.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [visible]);

  const decide = (choice: { statistics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setStats(choice.statistics);
    setMarketing(choice.marketing);
    setPolicy(null);
    setView('main');
    setOpen(false); // chiusura immediata, senza attendere animazioni
  };
  const rejectAll = () => decide({ statistics: false, marketing: false });

  // ESC = come la X: prosegue senza accettare
  useEffect(() => {
    if (!visible || policy) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') rejectAll(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, policy]);

  const reopen = () => {
    const c = getConsent();
    setStats(c?.statistics ?? false);
    setMarketing(c?.marketing ?? false);
    setView('main');
    setOpen(true);
  };

  if (isAdmin) return null;

  const linkCls = 'font-bold text-slate-700 underline underline-offset-2 decoration-[1.5px] hover:text-[#155bb0] cursor-pointer';
  const primaryBtn = `focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1e6fd9]/30 w-full py-3 sm:py-3.5 ${SHORT}:py-2.5 rounded-full bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-display text-[17px] sm:text-[19px] ${SHORT}:text-[16px] font-bold tracking-wide transition-colors cursor-pointer active:scale-[0.99]`;

  return (
    <>
      {visible && (
        <div
          className="em-fade-in fixed inset-0 z-[100] bg-slate-900/55 flex items-end sm:items-center justify-center sm:p-6"
          data-testid="cookie-banner"
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className={`outline-none em-rise-in relative bg-white w-full sm:max-w-[600px] max-h-[calc(100dvh-12px)] sm:max-h-[calc(100dvh-48px)] flex flex-col rounded-t-[26px] sm:rounded-[28px] shadow-2xl overflow-hidden`}
          >
            <button
              type="button"
              onClick={rejectAll}
              aria-label="Chiudi e continua senza accettare"
              data-testid="cookie-close"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.6} />
            </button>

            {/* Testo: unica parte che scorre se lo schermo è basso */}
            <div
              data-lenis-prevent
              data-testid="cookie-body"
              className={`flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pt-7 pb-4 sm:px-11 sm:pt-11 ${SHORT}:sm:pt-8`}
            >
              {view === 'main' ? (
                <>
                  <h2 id="cookie-title" className={`font-display text-[26px] sm:text-[34px] ${SHORT}:text-[24px] font-bold text-neutral-900 text-center tracking-tight`}>Informativa</h2>
                  <div className={`mt-4 sm:mt-5 space-y-3 sm:space-y-4 ${SHORT}:space-y-2.5 font-sans text-[13.5px] sm:text-[16px] ${SHORT}:sm:text-[14.5px] leading-[1.55] sm:leading-[1.6] text-slate-500`}>
                    <p>
                      Utilizziamo cookie o tecnologie simili, come specificato nella{' '}
                      <button type="button" onClick={() => setPolicy('Cookie Policy')} className={linkCls} data-testid="cookie-policy-link">cookie policy</button>{' '}
                      per dare una risposta più moderna ed efficace alla navigazione del sito e alle vostre preferenze. I tuoi dati personali sono utilizzati per la personalizzazione degli annunci. Cookie e identificatori di annunci mobile vengono usati per la pubblicità personalizzata e non personalizzata.
                    </p>
                    <p>
                      <strong className="font-bold text-slate-700">I cookies non obbligatori sono disattivati</strong> ma potrai modificare questa scelta in qualsiasi momento, oltre ad avere certezza delle nostre politiche privacy e cookies,
                      <br />
                      <strong className="font-bold text-slate-700">cliccando sull&apos;immagine del lucchetto.</strong>
                      <br />
                      Utilizza la X per chiudere questa informativa e continuare senza accettare
                    </p>
                    <p>
                      Per maggiori informazioni su come vengono trattati i tuoi dati con i servizi di Google, consulta la{' '}
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={linkCls}>Privacy Policy di Google</a>
                    </p>
                    <p>
                      Scopri di più su chi siamo, come puoi contattarci o come trattiamo i tuoi dati personali nella nostra{' '}
                      <button type="button" onClick={() => setPolicy('Privacy Policy')} className={linkCls} data-testid="privacy-policy-link">privacy policy</button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 id="cookie-title" className={`font-display text-[24px] sm:text-[30px] ${SHORT}:text-[22px] font-bold text-neutral-900 text-center tracking-tight`}>Preferenze cookie</h2>
                  <p className="mt-2 text-center font-sans text-[14px] text-slate-500 leading-relaxed">Scegli quali categorie di cookie attivare. Puoi cambiare idea in qualsiasi momento dal lucchetto in basso a sinistra.</p>
                  <div className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
                    {[
                      { key: 'necessary', title: 'Necessari', text: 'Indispensabili per il funzionamento del sito, come la memorizzazione delle tue preferenze sui cookie. Sempre attivi.', checked: true, disabled: true },
                      { key: 'statistics', title: 'Statistiche', text: 'Ci aiutano a capire in forma aggregata come viene utilizzato il sito, per migliorarlo.', checked: stats, onChange: setStats },
                      { key: 'marketing', title: 'Marketing e pubblicità', text: 'Cookie e identificatori di annunci (anche di servizi Google) per la pubblicità personalizzata e non personalizzata.', checked: marketing, onChange: setMarketing },
                    ].map((row) => (
                      <div key={row.key} className={`flex items-start gap-4 py-3.5 ${SHORT}:py-2.5`}>
                        <div className="flex-1">
                          <div className="font-display text-[16px] font-bold text-neutral-900">{row.title}</div>
                          <p className="font-sans text-[13px] text-slate-500 leading-relaxed mt-0.5">{row.text}</p>
                        </div>
                        <Toggle checked={row.checked} disabled={row.disabled} onChange={row.onChange} label={row.title} testid={`cookie-toggle-${row.key}`} />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* sfumatura: indica che il testo continua sotto */}
              <div aria-hidden="true" className="sticky -bottom-4 h-8 -mb-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            {/* Pulsanti: sempre visibili in fondo, anche su schermi bassi */}
            <div className={`shrink-0 border-t border-slate-100 bg-white px-5 pt-3.5 pb-[max(14px,env(safe-area-inset-bottom))] sm:px-11 sm:pt-5 sm:pb-7 ${SHORT}:sm:pt-3.5 ${SHORT}:sm:pb-4`} data-testid="cookie-actions">
              {view === 'main' ? (
                <>
                  <div className={`grid gap-2.5 sm:gap-3 ${SHORT}:gap-2`}>
                    <button type="button" onClick={() => decide({ statistics: true, marketing: true })} className={primaryBtn} data-testid="cookie-accept-all">Accetta tutti</button>
                    <button type="button" onClick={rejectAll} className={primaryBtn} data-testid="cookie-accept-necessary">Accetta solo necessari</button>
                  </div>
                  <div className={`text-center mt-3 sm:mt-4 ${SHORT}:mt-2`}>
                    <button type="button" onClick={() => setView('options')} className="font-sans text-[14.5px] sm:text-[15.5px] text-neutral-900 underline underline-offset-4 tracking-wide hover:text-[#155bb0] cursor-pointer" data-testid="cookie-options">OPZIONI...</button>
                  </div>
                </>
              ) : (
                <>
                  <div className={`grid sm:grid-cols-2 gap-2.5 sm:gap-3 ${SHORT}:gap-2`}>
                    <button type="button" onClick={() => decide({ statistics: stats, marketing })} className={primaryBtn} data-testid="cookie-save">Salva preferenze</button>
                    <button type="button" onClick={() => decide({ statistics: true, marketing: true })} className={`w-full py-3 sm:py-3.5 ${SHORT}:py-2.5 rounded-full border-2 border-[#1e6fd9] text-[#155bb0] hover:bg-[#f0f7fd] font-display text-[16px] sm:text-[17px] font-bold transition-colors cursor-pointer`}>Accetta tutti</button>
                  </div>
                  <div className={`text-center mt-3 ${SHORT}:mt-2`}>
                    <button type="button" onClick={() => setView('main')} className="inline-flex items-center gap-1.5 font-sans text-[14.5px] text-neutral-900 underline underline-offset-4 hover:text-[#155bb0] cursor-pointer"><ArrowLeft className="w-4 h-4" /> Indietro</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {!visible && (
        <button
          type="button"
          onClick={reopen}
          aria-label="Preferenze cookie e privacy"
          title="Preferenze cookie e privacy"
          data-testid="cookie-lock"
          className="fixed z-[55] bottom-5 left-4 sm:bottom-7 sm:left-7 w-11 h-11 rounded-full bg-white text-[#0b2545] border border-slate-200 shadow-[0_8px_24px_rgba(11,37,69,0.16)] flex items-center justify-center hover:text-[#1e6fd9] hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Lock className="w-[18px] h-[18px]" strokeWidth={2.2} />
        </button>
      )}

      <LegalModal isOpen={!!policy} title={policy || ''} content={policy ? LEGAL[policy] : ''} onClose={() => setPolicy(null)} zClass="z-[110]" />
    </>
  );
}
