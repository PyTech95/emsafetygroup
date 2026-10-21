import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Loader2, ClipboardCheck, Award, Send, CalendarX2 } from 'lucide-react';
import API from '../lib/api';
import LegalModal from '../components/LegalModal';
import { LEGAL } from '../data/legal';
import { CourseAvailability } from './CorsiPage';
import { useSeo } from '../seo/Seo';
import { courseSeo, notFoundSeo } from '../seo/dynamic';
import { UpcomingCourse, apiError, fmtHours, fmtLongDate, fmtDate, fmtValidity } from '../lib/training';

const fieldCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1e6fd9] focus:ring-2 focus:ring-[#1e6fd9]/10 outline-none font-sans text-[14px] text-slate-800 transition-all';

const XL_COLS: Record<number, string> = { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' };
const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const emptyForm = {
  first_name: '', last_name: '', birth_place: '', birth_date: '', email: '', phone: '',
  company: '', tax_code: '', notes: '', privacy: false, website: '',
};

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="block font-sans text-[12px] font-semibold text-slate-600 mb-1.5">
      {children}{required && <span className="text-[#1e6fd9]"> *</span>}
    </span>
  );
}

function EnrollForm({ course, onDone }: { course: UpcomingCourse; onDone: () => void }) {
  const [form, setForm] = useState({ ...emptyForm });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.privacy) { setError('Per completare l’iscrizione accetta l’informativa privacy.'); return; }
    setSending(true);
    try {
      await API.post(`/courses/${course.id}/enroll`, form);
      setSent(true);
      onDone();
    } catch (err) {
      setError(apiError(err, 'Invio non riuscito. Riprova o contattaci telefonicamente.'));
    } finally { setSending(false); }
  };

  if (sent) {
    return (
      <div className="text-center py-6" data-testid="enroll-success">
        <span className="w-14 h-14 rounded-full bg-[#e8f6ef] text-[#0f6b43] flex items-center justify-center mx-auto"><CheckCircle2 className="w-7 h-7" /></span>
        <h3 className="font-display text-[20px] font-bold text-[#0b2545] mt-4">Richiesta di iscrizione inviata</h3>
        <p className="font-sans text-[14px] text-slate-600 mt-2 leading-relaxed">
          Grazie {form.first_name}! Abbiamo ricevuto la tua iscrizione a <strong>{course.title}</strong>. Ti contatteremo a breve per la conferma e le informazioni sul pagamento.
        </p>
        <Link to="/corsi" className="mt-5 inline-flex items-center gap-2 font-sans text-[13.5px] font-bold text-[#155bb0] hover:underline"><ArrowLeft className="w-4 h-4" /> Torna al calendario corsi</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3.5" data-testid="enroll-form" noValidate={false}>
      <div className="grid grid-cols-2 gap-3">
        <label><Label required>Nome</Label><input required value={form.first_name} onChange={set('first_name')} autoComplete="given-name" className={fieldCls} data-testid="enroll-first-name" /></label>
        <label><Label required>Cognome</Label><input required value={form.last_name} onChange={set('last_name')} autoComplete="family-name" className={fieldCls} data-testid="enroll-last-name" /></label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label><Label required>Luogo di nascita</Label><input required value={form.birth_place} onChange={set('birth_place')} className={fieldCls} data-testid="enroll-birth-place" placeholder="Es. Treviso" /></label>
        <label><Label required>Data di nascita</Label><input required type="date" value={form.birth_date} onChange={set('birth_date')} max={new Date().toISOString().slice(0, 10)} className={fieldCls} data-testid="enroll-birth-date" /></label>
      </div>
      <p className="font-sans text-[11.5px] text-slate-400 -mt-1.5 leading-snug">Luogo e data di nascita sono necessari per l’emissione dell’attestato.</p>
      <label className="block"><Label required>Email</Label><input required type="email" value={form.email} onChange={set('email')} autoComplete="email" className={fieldCls} data-testid="enroll-email" /></label>
      <label className="block"><Label required>Telefono</Label><input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" className={fieldCls} data-testid="enroll-phone" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label><Label>Azienda</Label><input value={form.company} onChange={set('company')} autoComplete="organization" className={fieldCls} data-testid="enroll-company" /></label>
        <label><Label>Codice fiscale</Label><input value={form.tax_code} onChange={set('tax_code')} maxLength={16} className={`${fieldCls} uppercase`} data-testid="enroll-tax-code" /></label>
      </div>
      <label className="block"><Label>Note</Label><textarea value={form.notes} onChange={set('notes')} rows={2} className={fieldCls} data-testid="enroll-notes" placeholder="Esigenze particolari, fatturazione…" /></label>

      {/* Campo trappola per bot: invisibile alle persone */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>Sito web<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
        <input type="checkbox" checked={form.privacy} onChange={set('privacy')} className="mt-0.5 w-4 h-4 accent-[#1e6fd9] shrink-0" data-testid="enroll-privacy" />
        <span className="font-sans text-[12.5px] text-slate-600 leading-snug">
          Ho letto l’<button type="button" onClick={() => setPrivacyOpen(true)} className="underline font-semibold text-[#155bb0] cursor-pointer">informativa privacy</button> e acconsento al trattamento dei dati per la gestione del corso e l’emissione dell’attestato. <span className="text-[#1e6fd9]">*</span>
        </span>
      </label>

      {error && <p className="font-sans text-[13px] text-[#a8291c] bg-[#fdecea] border border-[#f5c6c0] rounded-xl px-3.5 py-2.5" role="alert" data-testid="enroll-error">{error}</p>}

      <button type="submit" disabled={sending} data-testid="enroll-submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1e6fd9] hover:bg-[#155bb0] disabled:opacity-60 text-white font-sans text-[15px] font-bold rounded-full shadow-lg shadow-[#1e6fd9]/25 transition-all active:scale-[0.98] cursor-pointer">
        {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Invio in corso…</> : <><Send className="w-4 h-4" /> Invia iscrizione</>}
      </button>
      <LegalModal isOpen={privacyOpen} title="Privacy Policy" content={LEGAL['Privacy Policy']} onClose={() => setPrivacyOpen(false)} zClass="z-[80]" />
    </form>
  );
}

export default function CorsoDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<UpcomingCourse | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');

  const load = () => {
    API.get(`/courses/${id}`).then((r) => { setCourse(r.data); setState('ok'); }).catch(() => setState('missing'));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useSeo(course && state === 'ok' ? courseSeo(course) : state === 'missing' ? notFoundSeo(`/corsi/${id}`) : null);

  if (state === 'loading') {
    return <div className="min-h-[70vh] flex items-center justify-center pt-[120px]"><Loader2 className="w-8 h-8 animate-spin text-[#0b2545]" /></div>;
  }
  if (state === 'missing' || !course) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 pt-[140px] pb-20 text-center" data-testid="course-missing">
        <div>
          <CalendarX2 className="w-10 h-10 text-[#1e6fd9] mx-auto mb-4" />
          <h1 className="font-display text-[26px] font-bold text-[#0b2545]">Corso non disponibile</h1>
          <p className="font-sans text-[15px] text-slate-600 mt-2">Il corso potrebbe essere concluso o non più in calendario.</p>
          <Link to="/corsi" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0b2545] text-white font-sans text-[14px] font-bold rounded-full"><ArrowLeft className="w-4 h-4" /> Vedi i corsi in partenza</Link>
        </div>
      </div>
    );
  }

  const c = course;
  const scrollToForm = () => {
    const el = document.getElementById('iscrizione');
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -130 });
    else el.scrollIntoView({ block: 'start' });
  };
  const infos: { label: string; main: string; sub?: string; long?: boolean }[] = [
    { label: 'Data', main: c.end_date ? `${fmtDate(c.start_date)} – ${fmtDate(c.end_date)}` : fmtDate(c.start_date), sub: [!c.end_date && capitalize(fmtLongDate(c.start_date).split(' ')[0]), c.schedule && `Orario: ${c.schedule}`].filter(Boolean).join(' · ') },
    ...(c.location ? [{ label: 'Sede', main: c.location, sub: c.modality }] : c.modality ? [{ label: 'Modalità', main: c.modality }] : []),
    ...(c.audience ? [{ label: 'Destinatari', main: c.audience, long: true }] : []),
    ...(c.trainer ? [{ label: 'Docente', main: c.trainer, sub: 'E.M. Safety S.r.l.' }] : []),
  ];
  const half = Math.ceil(c.program.length / 2);
  const columns = [c.program.slice(0, half), c.program.slice(half)];

  return (
    <div data-testid="course-detail">
      {/* Testata ispirata alla scheda corso PDF */}
      <section className="relative bg-[#0f1e3d] text-white pt-[104px] sm:pt-[132px] lg:pt-[150px] pb-12 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '46px 46px' }} />
        <div className="relative max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/corsi" className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-white/70 hover:text-white transition-colors" data-testid="course-back"><ArrowLeft className="w-4 h-4" /> Tutti i corsi in partenza</Link>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="font-sans text-[11.5px] sm:text-[12px] font-bold tracking-[0.18em] uppercase text-white/85 mt-7">Centro di Formazione E.M. Safety S.r.l.</p>
            <span className="block w-16 h-1 bg-[#f5a800] mt-3 rounded-full" />
            <h1 className="font-display font-extrabold tracking-tight leading-[1.04] text-[34px] sm:text-[50px] lg:text-[60px] mt-6 max-w-4xl" data-testid="course-title">{c.title}</h1>
            {c.subtitle && <p className="font-sans text-[16px] sm:text-[19px] text-white/85 leading-relaxed mt-4 max-w-3xl">{c.subtitle}</p>}
            <div className="flex flex-wrap gap-2.5 mt-7">
              {(c.kind || c.hours) && (
                <span className="px-3.5 py-1.5 bg-[#f5a800] text-[#0b2545] font-sans text-[12.5px] sm:text-[13px] font-extrabold uppercase tracking-wide">{[c.kind, fmtHours(c.hours)].filter(Boolean).join(' · ')}</span>
              )}
              {c.modality && <span className="px-3.5 py-1.5 border border-white/80 font-sans text-[12.5px] sm:text-[13px] font-bold">{c.modality}</span>}
              {c.legal_ref && <span className="px-3.5 py-1.5 border border-white/80 font-sans text-[12.5px] sm:text-[13px] font-bold">{c.legal_ref}</span>}
            </div>
            <button type="button" onClick={scrollToForm} className="lg:hidden mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1e6fd9] text-white font-sans text-[15px] font-bold shadow-lg cursor-pointer" data-testid="course-mobile-cta">
              {c.can_enroll ? 'Iscriviti al corso' : 'Disponibilità e contatti'}
            </button>
          </motion.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[minmax(0,1fr)_390px] gap-10 lg:gap-12 py-10 sm:py-14">
          <div className="min-w-0">
            {/* Riepilogo: data, sede, destinatari, docente */}
            <div className={`grid sm:grid-cols-2 ${XL_COLS[infos.length] || 'xl:grid-cols-4'} border-y border-slate-200`} data-testid="course-infos">
              {infos.map((info, i) => (
                <div key={info.label} className={[
                  'py-4 sm:py-5 border-slate-200 xl:border-t-0 xl:pr-5',
                  i > 0 ? 'border-t' : '',
                  i % 2 === 1 ? 'sm:border-l sm:pl-5' : 'sm:pr-5',
                  i < 2 ? 'sm:border-t-0' : 'sm:border-t',
                  i > 0 ? 'xl:border-l xl:pl-5' : '',
                ].join(' ')}>
                  <div className="font-sans text-[11.5px] font-bold uppercase tracking-[0.14em] text-slate-500">{info.label}</div>
                  <div className={`mt-1.5 text-[#0b2545] leading-snug ${info.long ? 'font-sans text-[15px] font-semibold' : 'font-display text-[18px] sm:text-[20px] font-bold'}`}>{info.main}</div>
                  {info.sub && <div className="font-sans text-[13.5px] text-slate-600 mt-1">{info.sub}</div>}
                </div>
              ))}
            </div>

            {c.program.length > 0 && (
              <div className="mt-10" data-testid="course-program">
                <h2 className="font-display text-[24px] sm:text-[26px] font-extrabold text-[#0b2545]">
                  Programma {c.program_note && <span className="font-sans text-[14px] sm:text-[15px] font-medium text-slate-600 align-middle">· {c.program_note}</span>}
                </h2>
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-3.5 mt-5">
                  {columns.map((col, ci) => (
                    <ol key={ci} className="space-y-3.5">
                      {col.map((p, pi) => {
                        const n = ci * half + pi + 1;
                        return (
                          <li key={n} className="flex gap-4 font-sans text-[14.5px] text-slate-700 leading-snug">
                            <span className="font-display text-[15px] font-extrabold text-[#9a6700] w-7 shrink-0">{String(n).padStart(2, '0')}</span>
                            <span>{p}</span>
                          </li>
                        );
                      })}
                    </ol>
                  ))}
                </div>
              </div>
            )}

            {c.final_test && (
              <div className="mt-10 bg-slate-100/80 rounded-2xl p-5 sm:p-6 flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-white text-[#0b2545] flex items-center justify-center shrink-0"><ClipboardCheck className="w-5 h-5" /></span>
                <div>
                  <h3 className="font-display text-[18px] font-bold text-[#0b2545]">Verifica finale</h3>
                  <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-1">{c.final_test}</p>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-[#cfe3f8] bg-[#f0f7fd] p-5 sm:p-6 flex gap-4">
              <span className="w-11 h-11 rounded-xl bg-white text-[#1e6fd9] flex items-center justify-center shrink-0"><Award className="w-5 h-5" /></span>
              <div>
                <h3 className="font-display text-[18px] font-bold text-[#0b2545]">Attestato con QR code verificabile</h3>
                <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-1">
                  {c.certificate_note || 'Al termine del corso viene rilasciato un attestato con codice univoco e QR code.'}
                  {c.validity_years ? ` Validità: ${fmtValidity(c.validity_years)}.` : ''}{' '}
                  L’autenticità può essere verificata da chiunque nella pagina <Link to="/verifica-attestato" className="font-semibold text-[#155bb0] underline">Verifica attestato</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Box iscrizione */}
          <aside className="lg:sticky lg:top-[140px] self-start" id="iscrizione">
            <div className="rounded-3xl border border-slate-200 shadow-[0_18px_50px_rgba(11,37,69,0.10)] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-[21px] font-extrabold text-[#0b2545]">Iscriviti al corso</h2>
                <CourseAvailability course={c} compact />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-[13px] text-slate-600 mt-2">
                <span>{fmtLongDate(c.start_date)}</span>
                {c.price && <span className="font-bold text-[#0b2545]">{c.price}</span>}
                {c.seats_left !== null && c.can_enroll && <span>{c.seats_left} posti disponibili</span>}
              </div>
              <div className="h-px bg-slate-100 my-5" />
              {c.can_enroll ? (
                <EnrollForm course={c} onDone={scrollToForm} />
              ) : (
                <div className="text-center py-4" data-testid="enroll-closed">
                  <p className="font-sans text-[14px] text-slate-600 leading-relaxed">
                    {c.is_full ? 'I posti per questa edizione sono esauriti.' : 'Le iscrizioni online per questa edizione sono chiuse.'} Contattaci per la lista d’attesa o per le prossime date.
                  </p>
                  <Link to="/contatti" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0b2545] text-white font-sans text-[13.5px] font-bold rounded-full">Contattaci</Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
