import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Copy, Trash2, Users, ExternalLink, Loader2, CheckCircle2, CalendarDays, Wand2 } from 'lucide-react';
import API from '../../lib/api';
import { AdminCourse, apiError, dateBlock, fmtHours, fmtValidity } from '../../lib/training';
import { inputCls, btnPrimary, btnSecondary, iconBtn, Field, Card, Modal, ConfirmButton, VALIDITY_OPTIONS } from './ui';

const emptyForm = {
  title: '', subtitle: '', kind: '', hours: '', modality: 'In presenza', legal_ref: '', start_date: '', end_date: '', schedule: '',
  location: '', trainer: '', audience: '', program: '', program_note: '', final_test: '',
  certificate_note: 'Attestato rilasciato con frequenza di almeno il 90% delle ore e superamento della verifica finale.',
  validity_years: '5', seats: '', price: '', registration_open: true, published: true,
};
type Form = typeof emptyForm;

// Scheda di esempio (dalla scheda PDF "Carrelli elevatori in sicurezza")
const EXAMPLE: Partial<Form> = {
  title: 'Carrelli elevatori in sicurezza',
  subtitle: 'Aggiornamento per operatori di carrelli elevatori semoventi con conducente a bordo.',
  kind: 'Aggiornamento', hours: '4', modality: 'In presenza',
  legal_ref: 'Art. 73 D.Lgs. 81/08 · Accordo Stato-Regioni 17/04/2025',
  schedule: '8:00–12:00', trainer: 'Ileana Spina', audience: 'Lavoratori addetti alla conduzione di carrelli',
  program: [
    'Aggiornamento normativo e responsabilità dell’operatore',
    'Stabilità e diagramma di portata: richiami ed errori ricorrenti',
    'Controlli prima del turno, sistemi di ritenuta e circolazione sicura',
    'Analisi di incidenti e quasi incidenti',
    'Verifiche pratiche del carrello prima dell’uso',
    'Guida e manovre con carico in spazi ristretti',
    'Prelievo e deposito in quota, parcheggio in sicurezza',
    'Verifica finale teorica e pratica',
  ].join('\n'),
  program_note: 'punti 1–4 teoria (1 ora) · punti 5–8 pratica (3 ore)',
  final_test: '30 domande a risposta multipla · superamento con almeno 21 risposte corrette (70%). Si svolge al termine del modulo pratico.',
  certificate_note: 'Attestato di aggiornamento rilasciato con frequenza di almeno il 90% delle ore e superamento della verifica finale.',
  validity_years: '5',
};

const KINDS = ['Formazione base', 'Aggiornamento', 'Abilitazione', 'Corso specialistico'];
const MODALITIES = ['In presenza', 'Online (videoconferenza)', 'Mista (presenza + online)', 'In azienda'];

function toForm(c: AdminCourse, duplicate = false): Form {
  return {
    title: c.title, subtitle: c.subtitle || '', kind: c.kind || '', hours: c.hours ? String(c.hours) : '', modality: c.modality || '',
    legal_ref: c.legal_ref || '', start_date: duplicate ? '' : c.start_date, end_date: duplicate ? '' : c.end_date || '', schedule: c.schedule || '',
    location: c.location || '', trainer: c.trainer || '', audience: c.audience || '', program: (c.program || []).join('\n'),
    program_note: c.program_note || '', final_test: c.final_test || '', certificate_note: c.certificate_note || '',
    validity_years: String(c.validity_years || 0), seats: c.seats ? String(c.seats) : '', price: c.price || '',
    registration_open: duplicate ? true : c.registration_open, published: duplicate ? true : c.published,
  };
}

function Switch({ checked, onChange, label, testid }: { checked: boolean; onChange: (v: boolean) => void; label: string; testid: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 cursor-pointer" data-testid={testid}>
      <span className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#1e6fd9]' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </span>
      <span className="font-sans text-[13.5px] font-semibold text-[#0b2545]">{label}</span>
    </button>
  );
}

export default function CoursesView({ showToast, onShowEnrollments, onChange }: { showToast: (m: string) => void; onShowEnrollments: (courseId: string) => void; onChange?: () => void }) {
  const [courses, setCourses] = useState<AdminCourse[] | null>(null);
  const [modal, setModal] = useState<{ mode: 'new' | 'edit'; id?: string } | null>(null);
  const [form, setForm] = useState<Form>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => { API.get('/admin/courses').then((r) => setCourses(r.data)).catch(() => setCourses([])); }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const openNew = () => { setForm({ ...emptyForm }); setError(null); setModal({ mode: 'new' }); };
  const openEdit = (c: AdminCourse) => { setForm(toForm(c)); setError(null); setModal({ mode: 'edit', id: c.id }); };
  const openDuplicate = (c: AdminCourse) => { setForm(toForm(c, true)); setError(null); setModal({ mode: 'new' }); showToast('Corso duplicato: imposta le nuove date'); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.start_date) { setError('Titolo e data di inizio sono obbligatori.'); return; }
    setSaving(true);
    const payload = {
      ...form,
      hours: form.hours ? Number(form.hours.replace(',', '.')) : null,
      seats: form.seats ? Number(form.seats) : null,
      validity_years: Number(form.validity_years) || null,
      program: form.program.split('\n').map((s) => s.replace(/^\s*(\d+[.)]|[-•*])\s*/, '').trim()).filter(Boolean),
    };
    try {
      if (modal?.mode === 'edit' && modal.id) { await API.put(`/admin/courses/${modal.id}`, payload); showToast('Corso aggiornato'); }
      else { await API.post('/admin/courses', payload); showToast(payload.published ? 'Corso pubblicato sul sito' : 'Corso salvato come bozza'); }
      setModal(null); load(); onChange?.();
    } catch (err) { setError(apiError(err, 'Salvataggio non riuscito')); } finally { setSaving(false); }
  };

  const remove = async (c: AdminCourse) => {
    try { await API.delete(`/admin/courses/${c.id}`); load(); onChange?.(); showToast('Corso eliminato'); } catch (err) { showToast(apiError(err)); }
  };

  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const upcoming = (courses || []).filter((c) => (c.end_date || c.start_date) >= today).sort((a, b) => a.start_date.localeCompare(b.start_date));
  const past = (courses || []).filter((c) => (c.end_date || c.start_date) < today);

  const Row = ({ c }: { c: AdminCourse }) => {
    const d = dateBlock(c.start_date);
    return (
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 py-4" data-testid={`admin-course-${c.id}`}>
        <div className="flex items-center gap-3 md:w-[86px] shrink-0">
          <div className="w-[64px] h-[64px] rounded-2xl bg-[#0b2545] text-white flex flex-col items-center justify-center leading-none">
            <span className="font-display text-[22px] font-extrabold">{d.day}</span>
            <span className="font-sans text-[10.5px] font-bold tracking-[0.16em] text-[#f5a800] mt-1">{d.month}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {!c.published && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-sans text-[10.5px] font-bold uppercase">Bozza</span>}
            {c.published && <span className="px-2 py-0.5 rounded-full bg-[#e8f1fc] text-[#155bb0] font-sans text-[10.5px] font-bold uppercase">Pubblicato</span>}
            <span className={`px-2 py-0.5 rounded-full font-sans text-[10.5px] font-bold uppercase ${c.can_enroll ? 'bg-[#e8f6ef] text-[#0f6b43]' : 'bg-slate-100 text-slate-500'}`}>{c.can_enroll ? 'Iscrizioni aperte' : c.is_full ? 'Completo' : 'Iscrizioni chiuse'}</span>
          </div>
          <div className="font-display text-[16px] font-bold text-[#0b2545] truncate">{c.title}</div>
          <div className="font-sans text-[12.5px] text-slate-500 truncate">{[d.year, c.kind, fmtHours(c.hours), c.schedule, c.location || c.modality].filter(Boolean).join(' · ')}</div>
        </div>
        <button onClick={() => onShowEnrollments(c.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#1e6fd9]/40 font-sans text-[12.5px] font-bold text-[#0b2545] cursor-pointer shrink-0 self-start md:self-auto" data-testid={`admin-course-enrollments-${c.id}`}>
          <Users className="w-4 h-4 text-[#1e6fd9]" /> {c.enrolled}{c.seats ? `/${c.seats}` : ''} iscritti
          {c.new_enrollments > 0 && <span className="px-1.5 py-0.5 rounded-full bg-[#f5a800] text-[#0b2545] text-[10.5px]">{c.new_enrollments} nuove</span>}
        </button>
        <div className="flex items-center gap-0.5 shrink-0">
          {c.published && <a className={iconBtn} title="Apri pagina pubblica" href={`/corsi/${c.id}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a>}
          <button className={iconBtn} title="Modifica" onClick={() => openEdit(c)} data-testid={`admin-course-edit-${c.id}`}><Pencil className="w-4 h-4" /></button>
          <button className={iconBtn} title="Duplica (nuova edizione)" onClick={() => openDuplicate(c)}><Copy className="w-4 h-4" /></button>
          <ConfirmButton className={`${iconBtn} hover:!text-[#a8291c] hover:!bg-[#fdecea]`} title="Elimina" confirmLabel="Elimina?" onConfirm={() => remove(c)}><Trash2 className="w-4 h-4" /></ConfirmButton>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" data-testid="courses-admin-view">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-[14px] text-slate-500 max-w-2xl">Inserisci le edizioni dei corsi: compaiono nella pagina pubblica <strong>Corsi in partenza</strong> fino alla data di svolgimento e chiunque può iscriversi online.</p>
        <button className={btnPrimary} onClick={openNew} data-testid="course-new"><Plus className="w-4 h-4" /> Nuovo corso</button>
      </div>

      <Card className="px-5 sm:px-6 py-2">
        <h2 className="font-display text-[17px] font-bold text-[#0b2545] pt-4 pb-1">In programma <span className="text-slate-400 font-sans text-[14px]">({upcoming.length})</span></h2>
        {courses === null ? <div className="py-12 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#0b2545]" /></div>
          : upcoming.length === 0 ? (
            <div className="text-center py-10 font-sans text-[14px] text-slate-500" data-testid="courses-admin-empty">
              <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />Nessun corso in programma. Clicca <strong>Nuovo corso</strong> per pubblicarne uno.
            </div>
          ) : <div className="divide-y divide-slate-100">{upcoming.map((c) => <Row key={c.id} c={c} />)}</div>}
      </Card>

      {past.length > 0 && (
        <Card className="px-5 sm:px-6 py-2">
          <h2 className="font-display text-[17px] font-bold text-[#0b2545] pt-4 pb-1">Conclusi <span className="text-slate-400 font-sans text-[14px]">({past.length})</span></h2>
          <p className="font-sans text-[12.5px] text-slate-400">Non più visibili sul sito. Da qui puoi aprire gli iscritti ed emettere gli attestati.</p>
          <div className="divide-y divide-slate-100">{past.map((c) => <Row key={c.id} c={c} />)}</div>
        </Card>
      )}

      <Modal open={!!modal} title={modal?.mode === 'edit' ? 'Modifica corso' : 'Nuovo corso'} onClose={() => setModal(null)} wide>
        <form onSubmit={save} className="space-y-5" data-testid="course-form">
          {modal?.mode === 'new' && !form.title && (
            <button type="button" onClick={() => setForm((f) => ({ ...f, ...EXAMPLE }))} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#1e6fd9]/50 bg-[#f0f7fd] text-[#155bb0] font-sans text-[13px] font-bold cursor-pointer hover:bg-[#e8f1fc]" data-testid="course-example">
              <Wand2 className="w-4 h-4" /> Compila con la scheda di esempio “Carrelli elevatori in sicurezza”
            </button>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Titolo del corso" required className="sm:col-span-2"><input value={form.title} onChange={set('title')} className={inputCls} data-testid="course-title-input" /></Field>
            <Field label="Sottotitolo / descrizione" className="sm:col-span-2"><textarea rows={2} value={form.subtitle} onChange={set('subtitle')} className={inputCls} /></Field>
            <Field label="Tipo"><input list="course-kinds" value={form.kind} onChange={set('kind')} className={inputCls} placeholder="Es. Aggiornamento" /><datalist id="course-kinds">{KINDS.map((k) => <option key={k} value={k} />)}</datalist></Field>
            <Field label="Durata (ore)"><input inputMode="decimal" value={form.hours} onChange={set('hours')} className={inputCls} placeholder="4" /></Field>
            <Field label="Modalità"><input list="course-modalities" value={form.modality} onChange={set('modality')} className={inputCls} /><datalist id="course-modalities">{MODALITIES.map((k) => <option key={k} value={k} />)}</datalist></Field>
            <Field label="Riferimento normativo"><input value={form.legal_ref} onChange={set('legal_ref')} className={inputCls} placeholder="Art. 73 D.Lgs. 81/08" /></Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Data inizio" required><input type="date" value={form.start_date} onChange={set('start_date')} className={inputCls} data-testid="course-start-input" /></Field>
            <Field label="Data fine (se più giorni)"><input type="date" value={form.end_date} min={form.start_date || undefined} onChange={set('end_date')} className={inputCls} /></Field>
            <Field label="Orario"><input value={form.schedule} onChange={set('schedule')} className={inputCls} placeholder="8:00–12:00" /></Field>
            <Field label="Sede / luogo" className="sm:col-span-2"><input value={form.location} onChange={set('location')} className={inputCls} placeholder="Es. Sede di Treviso, Strada di Boiago" /></Field>
            <Field label="Docente"><input value={form.trainer} onChange={set('trainer')} className={inputCls} /></Field>
          </div>

          <Field label="Destinatari"><textarea rows={2} value={form.audience} onChange={set('audience')} className={inputCls} placeholder="Es. Lavoratori addetti alla conduzione di carrelli" /></Field>
          <Field label="Programma" hint="Un argomento per riga: vengono numerati automaticamente (01, 02…)."><textarea rows={6} value={form.program} onChange={set('program')} className={inputCls} /></Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Nota sul programma"><input value={form.program_note} onChange={set('program_note')} className={inputCls} placeholder="punti 1–4 teoria · punti 5–8 pratica" /></Field>
            <Field label="Validità attestato"><select value={form.validity_years} onChange={set('validity_years')} className={inputCls}>{VALIDITY_OPTIONS.map((v) => <option key={v} value={v}>{fmtValidity(v)}</option>)}</select></Field>
          </div>
          <Field label="Verifica finale"><textarea rows={2} value={form.final_test} onChange={set('final_test')} className={inputCls} /></Field>
          <Field label="Nota sull’attestato"><textarea rows={2} value={form.certificate_note} onChange={set('certificate_note')} className={inputCls} /></Field>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Posti disponibili" hint="Lascia vuoto per non limitare le iscrizioni."><input type="number" min={1} value={form.seats} onChange={set('seats')} className={inputCls} /></Field>
            <Field label="Prezzo (facoltativo)"><input value={form.price} onChange={set('price')} className={inputCls} placeholder="Es. € 90 + IVA" /></Field>
          </div>
          <div className="flex flex-wrap gap-6 pt-1">
            <Switch checked={form.published} onChange={(v) => setForm((f) => ({ ...f, published: v }))} label={form.published ? 'Pubblicato sul sito' : 'Bozza (non visibile)'} testid="course-published" />
            <Switch checked={form.registration_open} onChange={(v) => setForm((f) => ({ ...f, registration_open: v }))} label={form.registration_open ? 'Iscrizioni aperte' : 'Iscrizioni chiuse'} testid="course-open" />
          </div>

          {error && <p className="font-sans text-[13px] text-[#a8291c] bg-[#fdecea] border border-[#f5c6c0] rounded-xl px-3.5 py-2.5">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className={btnSecondary} onClick={() => setModal(null)}>Annulla</button>
            <button type="submit" disabled={saving} className={btnPrimary} data-testid="course-save">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} {modal?.mode === 'edit' ? 'Salva modifiche' : 'Salva corso'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
