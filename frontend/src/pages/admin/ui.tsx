import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, MailCheck, MailX } from 'lucide-react';

export const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1e6fd9] focus:ring-2 focus:ring-[#1e6fd9]/10 outline-none font-sans text-[14px] text-slate-800 transition-all';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0b2545] hover:bg-[#07192e] disabled:opacity-60 text-white font-sans text-[13.5px] font-bold rounded-xl shadow-sm transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer';

export const btnSecondary =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 disabled:opacity-60 text-[#0b2545] font-sans text-[13px] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer';

export const iconBtn = 'p-2 rounded-lg text-slate-400 hover:text-[#1e6fd9] hover:bg-[#e8f1fc] transition-colors cursor-pointer disabled:opacity-40';

export function Field({ label, required, children, hint, className = '' }: { label: string; required?: boolean; children: ReactNode; hint?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">
        {label}{required && <span className="text-[#1e6fd9]"> *</span>}
      </span>
      {children}
      {hint && <span className="block font-sans text-[11.5px] text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
}

export function Modal({ open, title, onClose, children, wide = false }: { open: boolean; title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] bg-slate-900/50 flex items-end sm:items-center justify-center sm:p-6" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        onMouseDown={(e) => e.stopPropagation()}
        className={`bg-white w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl`}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 z-10">
          <h3 className="font-display text-[18px] font-bold text-[#0b2545]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0b2545] hover:bg-slate-100 cursor-pointer" aria-label="Chiudi"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

/** Pulsante a doppio clic per azioni distruttive (senza finestre di conferma del browser). */
export function ConfirmButton({ onConfirm, children, confirmLabel = 'Confermi?', className = '', title, testid }: { onConfirm: () => void; children: ReactNode; confirmLabel?: string; className?: string; title?: string; testid?: string }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      title={title}
      data-testid={testid}
      onClick={() => {
        if (armed) { window.clearTimeout(timer.current); setArmed(false); onConfirm(); return; }
        setArmed(true);
        timer.current = window.setTimeout(() => setArmed(false), 3000);
      }}
      className={armed ? 'px-2.5 py-1.5 rounded-lg bg-[#a8291c] text-white font-sans text-[12px] font-bold cursor-pointer whitespace-nowrap' : className}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}

export const STATUS_CHIP: Record<string, string> = {
  valido: 'bg-[#e8f6ef] text-[#0f6b43] border-[#bfe5d0]',
  scaduto: 'bg-[#fff4dc] text-[#8a5a00] border-[#f5dca0]',
  revocato: 'bg-[#fdecea] text-[#a8291c] border-[#f5c6c0]',
  nuova: 'bg-[#fff4dc] text-[#8a5a00] border-[#f5dca0]',
  confermata: 'bg-[#e8f6ef] text-[#0f6b43] border-[#bfe5d0]',
  annullata: 'bg-slate-100 text-slate-500 border-slate-200',
};

export function Chip({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-sans text-[11px] font-bold uppercase tracking-wide ${STATUS_CHIP[status] || STATUS_CHIP.annullata}`}>
      {label || status}
    </span>
  );
}

export const VALIDITY_OPTIONS = [0, 1, 2, 3, 4, 5, 10];

/** Esito della notifica email di una richiesta o iscrizione. */
export function EmailStatusChip({ status, error }: { status?: string; error?: string }) {
  if (!status) return null;
  const map: Record<string, { label: string; cls: string; Icon: typeof Mail }> = {
    inviata: { label: 'Email inviata', cls: 'bg-[#e8f6ef] text-[#0f6b43]', Icon: MailCheck },
    errore: { label: 'Email non inviata', cls: 'bg-[#fdecea] text-[#a8291c]', Icon: MailX },
    disattivata: { label: 'Email disattivata', cls: 'bg-slate-100 text-slate-500', Icon: MailX },
    in_invio: { label: 'Email in invio…', cls: 'bg-[#e8f1fc] text-[#155bb0]', Icon: Mail },
  };
  const m = map[status];
  if (!m) return null;
  return (
    <span title={error || undefined} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-sans text-[10.5px] font-bold uppercase tracking-wide ${m.cls}`} data-testid="email-status-chip">
      <m.Icon className="w-3 h-3" /> {m.label}
    </span>
  );
}
