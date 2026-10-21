import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ShieldCheck, ShieldAlert, ShieldX, Loader2, QrCode, ScanLine, BadgeCheck, SearchX, Phone, Mail } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import API from '../lib/api';
import { useText } from '../lib/content';
import { PublicCertificate, fmtDate, fmtHours, fmtRange, fmtValidity } from '../lib/training';

const STATUS = {
  valido: {
    icon: ShieldCheck, title: 'Attestato valido', band: 'bg-[#e8f6ef] border-[#bfe5d0]', fg: 'text-[#0f6b43]', chip: 'bg-[#0f6b43]',
    text: 'Questo attestato è autentico ed è stato rilasciato da E.M. Safety S.r.l.',
  },
  scaduto: {
    icon: ShieldAlert, title: 'Attestato autentico — scaduto', band: 'bg-[#fff4dc] border-[#f5dca0]', fg: 'text-[#8a5a00]', chip: 'bg-[#b47700]',
    text: 'L’attestato è autentico ma il periodo di validità è terminato: è necessario un corso di aggiornamento.',
  },
  revocato: {
    icon: ShieldX, title: 'Attestato revocato', band: 'bg-[#fdecea] border-[#f5c6c0]', fg: 'text-[#a8291c]', chip: 'bg-[#a8291c]',
    text: 'Questo attestato è stato revocato dall’ente formatore e non è più valido.',
  },
} as const;

function Field({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className={`mt-1 font-display text-[#0b2545] ${strong ? 'text-[17px] font-bold' : 'text-[16px] font-semibold'}`}>{value || '—'}</dd>
    </div>
  );
}

function ResultCard({ cert, checkedAt }: { cert: PublicCertificate; checkedAt: Date }) {
  const s = STATUS[cert.status] || STATUS.valido;
  const Icon = s.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-[0_24px_60px_rgba(11,37,69,0.12)] overflow-hidden"
      data-testid="certificate-result"
    >
      <div className={`px-5 sm:px-8 py-5 border-b ${s.band} flex items-start gap-4`}>
        <span className={`w-12 h-12 rounded-2xl ${s.chip} text-white flex items-center justify-center shrink-0`}><Icon className="w-6 h-6" /></span>
        <div>
          <h2 className={`font-display text-[21px] sm:text-[24px] font-extrabold ${s.fg}`} data-testid="certificate-status">{s.title}</h2>
          <p className="font-sans text-[13.5px] text-slate-700 mt-0.5 leading-relaxed">{s.text}</p>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-7">
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Titolare dell’attestato</div>
        <div className="font-display text-[28px] sm:text-[34px] font-extrabold text-[#0b2545] leading-tight mt-1" data-testid="certificate-holder">
          {cert.first_name} {cert.last_name}
        </div>
        <div className="font-sans text-[15px] text-slate-600 mt-1">
          Nato/a a <strong className="text-slate-800">{cert.birth_place}</strong> il <strong className="text-slate-800">{fmtDate(cert.birth_date)}</strong>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Tipologia del corso</div>
          <div className="font-display text-[19px] sm:text-[21px] font-bold text-[#0b2545] mt-1 leading-snug" data-testid="certificate-course">{cert.course_type}</div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 mt-6">
          <Field label="Data di svolgimento" value={fmtRange(cert.course_date, cert.course_end_date)} strong />
          <Field label="Durata del corso" value={fmtHours(cert.course_hours) || '—'} />
          <Field label="Validità attestato" value={fmtValidity(cert.validity_years)} />
          <Field label="Scadenza" value={cert.expiry_date ? fmtDate(cert.expiry_date) : 'Nessuna'} strong />
        </dl>
      </div>

      <div className="px-5 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans text-[12.5px] text-slate-500">
        <span>Codice: <strong className="font-mono text-[13px] text-[#0b2545] tracking-wide" data-testid="certificate-code">{cert.code}</strong></span>
        <span>{cert.issuer}</span>
      </div>
      <div className="px-5 sm:px-8 py-2.5 border-t border-slate-100 font-sans text-[11.5px] text-slate-400">
        Verifica effettuata il {checkedAt.toLocaleDateString('it-IT')} alle {checkedAt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} sul registro ufficiale E.M. Safety.
      </div>
    </motion.article>
  );
}

function SearchForm({ initial, compact = false }: { initial?: string; compact?: boolean }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initial || '');
  useEffect(() => { setValue(initial || ''); }, [initial]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const code = value.replace(/\s+/g, '').toUpperCase();
    if (code) navigate(`/verifica/${encodeURIComponent(code)}`);
  };
  return (
    <form onSubmit={submit} className={`flex flex-col sm:flex-row gap-2.5 ${compact ? '' : 'max-w-2xl'}`} data-testid="verify-form">
      <label className="relative flex-1">
        <span className="sr-only">Codice attestato</span>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Codice attestato, es. EMS-2026-7KQ4-P9XD"
          autoCapitalize="characters"
          spellCheck={false}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-[#1e6fd9] focus:ring-4 focus:ring-[#1e6fd9]/10 outline-none font-mono text-[15px] font-semibold tracking-wide text-[#0b2545] placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 shadow-sm"
          data-testid="verify-input"
        />
      </label>
      <button type="submit" data-testid="verify-submit" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-sans text-[15px] font-bold shadow-lg shadow-[#1e6fd9]/25 transition-colors cursor-pointer">
        <BadgeCheck className="w-5 h-5" /> Verifica
      </button>
    </form>
  );
}

export default function VerificaAttestatoPage() {
  const { code } = useParams();
  const t = useText();
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'missing' | 'error'>(code ? 'loading' : 'idle');
  const [cert, setCert] = useState<PublicCertificate | null>(null);
  const [checkedAt, setCheckedAt] = useState(new Date());

  useEffect(() => {
    document.title = 'Verifica attestato | E.M SAFETY';
    return () => { document.title = 'E.M SAFETY | Consulenze e Formazioni'; };
  }, []);

  useEffect(() => {
    if (!code) { setState('idle'); setCert(null); return; }
    setState('loading');
    API.get(`/certificates/verify/${encodeURIComponent(code)}`)
      .then((r) => { setCert(r.data); setCheckedAt(new Date()); setState('found'); })
      .catch((err) => setState(err?.response?.status === 404 ? 'missing' : 'error'));
  }, [code]);

  const grid = { backgroundImage: 'linear-gradient(#0c4a6e 1px, transparent 1px), linear-gradient(90deg, #0c4a6e 1px, transparent 1px)', backgroundSize: '46px 46px' };

  if (code) {
    return (
      <section className="relative bg-[#f0f9ff] min-h-[80vh] pt-[100px] sm:pt-[128px] lg:pt-[144px] pb-16" data-testid="verify-page">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={grid} />
        <div className="relative max-w-[760px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-[#1e6fd9]" />
            <h1 className="font-display text-[19px] sm:text-[22px] font-extrabold text-[#0b2545]">Verifica attestato E.M. Safety</h1>
          </div>

          {state === 'loading' && (
            <div className="bg-white rounded-3xl border border-slate-200 py-16 flex flex-col items-center gap-3" data-testid="verify-loading">
              <Loader2 className="w-8 h-8 animate-spin text-[#1e6fd9]" />
              <span className="font-sans text-[14px] text-slate-500">Verifica in corso sul registro attestati…</span>
            </div>
          )}

          {state === 'found' && cert && <ResultCard cert={cert} checkedAt={checkedAt} />}

          {(state === 'missing' || state === 'error') && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-10 text-center" data-testid="verify-missing">
              <span className="w-14 h-14 rounded-2xl bg-[#fdecea] text-[#a8291c] flex items-center justify-center mx-auto"><SearchX className="w-7 h-7" /></span>
              <h2 className="font-display text-[22px] font-extrabold text-[#0b2545] mt-4">
                {state === 'missing' ? 'Nessun attestato trovato' : 'Verifica non disponibile'}
              </h2>
              <p className="font-sans text-[14.5px] text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                {state === 'missing'
                  ? <>Il codice <strong className="font-mono text-[#0b2545]">{code.toUpperCase()}</strong> non corrisponde a nessun attestato rilasciato da E.M. Safety. Controlla di averlo inserito correttamente.</>
                  : 'Si è verificato un problema di connessione. Riprova tra qualche istante.'}
              </p>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-5 font-sans text-[13.5px]">
                <a href={`tel:${t('company.phone').replace(/\s+/g, '')}`} className="inline-flex items-center gap-1.5 font-semibold text-[#155bb0]"><Phone className="w-4 h-4" />{t('company.phone')}</a>
                <a href={`mailto:${t('company.email')}`} className="inline-flex items-center gap-1.5 font-semibold text-[#155bb0]"><Mail className="w-4 h-4" />{t('company.email')}</a>
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="font-sans text-[13px] font-semibold text-slate-600 mb-2.5">Verifica un altro attestato</p>
            <SearchForm compact />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative bg-[#f0f9ff] pt-[104px] sm:pt-[132px] lg:pt-[150px] pb-14 sm:pb-20 overflow-hidden" data-testid="verify-page">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={grid} />
        <div className="relative max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionLabel>{t('page.verifica.label')}</SectionLabel>
            <h1 className="font-display text-neutral-900 font-extrabold tracking-tight leading-[1.06] text-[32px] sm:text-[46px] lg:text-[54px] mt-5 max-w-3xl">
              {t('page.verifica.title')} <span className="text-[#1e6fd9]">{t('page.verifica.highlight')}</span>
            </h1>
            <p className="font-sans text-[16.5px] text-slate-600 leading-relaxed mt-5 max-w-2xl">{t('page.verifica.subtitle')}</p>
            <div className="mt-8"><SearchForm /></div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-5">
          {[
            { icon: ScanLine, title: 'Inquadra il QR code', text: 'Usa la fotocamera dello smartphone sul QR code stampato sull’attestato: si apre direttamente la pagina di verifica.' },
            { icon: Search, title: 'Oppure inserisci il codice', text: 'Ogni attestato riporta un codice univoco nel formato EMS-ANNO-XXXX-XXXX. Digitalo nel campo qui sopra.' },
            { icon: ShieldCheck, title: 'Controlla i dati', text: 'Vedrai titolare, luogo e data di nascita, corso svolto, data, durata e validità, confrontandoli con l’attestato cartaceo.' },
          ].map((s, i) => (
            <div key={s.title} className="rounded-3xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <span className="w-11 h-11 rounded-2xl bg-[#e8f1fc] text-[#1e6fd9] flex items-center justify-center"><s.icon className="w-5 h-5" /></span>
                <span className="font-display text-[28px] font-extrabold text-slate-200">0{i + 1}</span>
              </div>
              <h3 className="font-display text-[18px] font-bold text-[#0b2545] mt-4">{s.title}</h3>
              <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-2">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 font-sans text-[13.5px] text-slate-500">
          Vuoi ottenere un attestato? <Link to="/corsi" className="font-semibold text-[#155bb0] underline">Scopri i corsi in partenza</Link>.
        </p>
      </section>
    </>
  );
}
