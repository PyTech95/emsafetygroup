import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Trash2, Award, QrCode, FileSpreadsheet, Mail, Phone, Inbox, Search } from 'lucide-react';
import API from '../../lib/api';
import { AdminCourse, AdminCertificate, Enrollment, apiError, fmtDate } from '../../lib/training';
import { downloadBlob, toCsv, qrZip } from '../../lib/qr';
import { inputCls, btnPrimary, btnSecondary, iconBtn, Card, Chip, ConfirmButton, STATUS_CHIP } from './ui';

const STATUSES: Enrollment['status'][] = ['nuova', 'confermata', 'annullata'];

export default function EnrollmentsView({ showToast, courseId, onCourseChange, onChange, onOpenCertificates }: {
  showToast: (m: string) => void;
  courseId: string;
  onCourseChange: (id: string) => void;
  onChange?: () => void;
  onOpenCertificates: () => void;
}) {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [items, setItems] = useState<Enrollment[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [issued, setIssued] = useState<AdminCertificate[]>([]);
  const [zipping, setZipping] = useState(false);

  const load = useCallback(() => {
    API.get('/admin/enrollments', { params: courseId ? { course_id: courseId } : {} }).then((r) => setItems(r.data)).catch(() => setItems([]));
  }, [courseId]);
  useEffect(() => { setItems(null); setIssued([]); load(); }, [load]);
  useEffect(() => { API.get('/admin/courses').then((r) => setCourses(r.data)).catch(() => {}); }, []);

  const course = courses.find((c) => c.id === courseId);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (items || []).filter((e) => !q || `${e.first_name} ${e.last_name} ${e.email} ${e.company} ${e.course_title}`.toLowerCase().includes(q));
  }, [items, search]);

  const setStatus = async (e: Enrollment, status: string) => {
    setBusy(e.id);
    try { await API.patch(`/admin/enrollments/${e.id}`, { status }); load(); onChange?.(); }
    catch (err) { showToast(apiError(err)); } finally { setBusy(null); }
  };
  const remove = async (e: Enrollment) => {
    try { await API.delete(`/admin/enrollments/${e.id}`); load(); onChange?.(); showToast('Iscrizione eliminata'); }
    catch (err) { showToast(apiError(err)); }
  };
  const issueOne = async (e: Enrollment) => {
    setBusy(e.id);
    try {
      const { data } = await API.post(`/admin/enrollments/${e.id}/certificate`);
      setIssued((list) => [data, ...list.filter((c) => c.id !== data.id)]);
      load(); onChange?.(); showToast(`Attestato ${data.code} emesso`);
    } catch (err) { showToast(apiError(err)); } finally { setBusy(null); }
  };
  const issueAll = async () => {
    if (!courseId) return;
    setBusy('all');
    try {
      const { data } = await API.post(`/admin/courses/${courseId}/certificates`);
      setIssued(data.created);
      load(); onChange?.();
      showToast(data.created.length ? `${data.created.length} attestati emessi` : 'Nessun nuovo attestato da emettere (servono iscritti confermati)');
    } catch (err) { showToast(apiError(err)); } finally { setBusy(null); }
  };

  const exportCsv = () => {
    const rows = filtered.map((e) => [e.course_title, fmtDate(e.course_date), e.last_name, e.first_name, e.birth_place, fmtDate(e.birth_date), e.tax_code, e.company, e.email, e.phone, e.status, e.notes, e.created_at ? new Date(e.created_at).toLocaleString('it-IT') : '']);
    downloadBlob(toCsv([['Corso', 'Data corso', 'Cognome', 'Nome', 'Luogo di nascita', 'Data di nascita', 'Codice fiscale', 'Azienda', 'Email', 'Telefono', 'Stato', 'Note', 'Ricevuta il'], ...rows]), `iscritti${course ? '_' + course.start_date : ''}.csv`);
  };

  const confirmed = (items || []).filter((e) => e.status === 'confermata');
  const toIssue = confirmed.filter((e) => !e.certificate_id).length;

  return (
    <div className="space-y-6" data-testid="enrollments-view">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <label className="block flex-1">
            <span className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Corso</span>
            <select value={courseId} onChange={(e) => onCourseChange(e.target.value)} className={inputCls} data-testid="enrollments-course-filter">
              <option value="">Tutti i corsi</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{fmtDate(c.start_date)} — {c.title}{c.kind ? ` (${c.kind})` : ''}</option>)}
            </select>
          </label>
          <label className="relative block lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca iscritto…" className={`${inputCls} pl-10`} />
          </label>
          <button className={btnSecondary} onClick={exportCsv} disabled={!filtered.length} data-testid="enrollments-export"><FileSpreadsheet className="w-4 h-4 text-[#1e6fd9]" /> Esporta CSV</button>
        </div>

        {course && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#f0f7fd] border border-[#cfe3f8] px-4 py-3">
            <div className="font-sans text-[13px] text-slate-600">
              <strong className="text-[#0b2545]">{course.enrolled}</strong> iscritti{course.seats ? ` su ${course.seats} posti` : ''} · <strong className="text-[#0b2545]">{confirmed.length}</strong> confermati · {toIssue} senza attestato
            </div>
            <button className={btnPrimary} disabled={busy === 'all' || toIssue === 0} onClick={issueAll} data-testid="enrollments-issue-all">
              {busy === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />} Emetti attestati ai confermati ({toIssue})
            </button>
          </div>
        )}

        {issued.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[#bfe5d0] bg-[#f3fbf6] px-4 py-3 flex flex-wrap items-center justify-between gap-3" data-testid="enrollments-issued">
            <span className="font-sans text-[13.5px] font-bold text-[#0f6b43]">{issued.length} attestati emessi: scarica i QR da inserire negli attestati.</span>
            <div className="flex gap-2">
              <button className={btnPrimary} disabled={zipping} onClick={async () => { setZipping(true); try { downloadBlob(await qrZip(issued), 'QR_attestati.zip'); } finally { setZipping(false); } }}>
                {zipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />} Scarica QR (ZIP)
              </button>
              <button className={btnSecondary} onClick={onOpenCertificates}>Vai al registro</button>
            </div>
          </div>
        )}
      </Card>

      <Card className="px-5 sm:px-6 py-2">
        {items === null ? <div className="py-12 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#0b2545]" /></div>
          : filtered.length === 0 ? (
            <div className="text-center py-12 font-sans text-[14px] text-slate-500" data-testid="enrollments-empty">
              <Inbox className="w-9 h-9 text-slate-300 mx-auto mb-3" />Nessuna iscrizione {courseId ? 'per questo corso' : 'ancora'}. Le iscrizioni dal sito appariranno qui.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <div key={e.id} className="py-4 flex flex-col xl:flex-row xl:items-center gap-3" data-testid={`enrollment-${e.id}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[16px] font-bold text-[#0b2545]">{e.last_name} {e.first_name}</span>
                      <Chip status={e.status} />
                      {e.certificate_id && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f1fc] text-[#155bb0] font-sans text-[10.5px] font-bold uppercase"><QrCode className="w-3 h-3" /> Attestato emesso</span>}
                    </div>
                    <div className="font-sans text-[12.5px] text-slate-500 mt-0.5">
                      Nato/a a {e.birth_place} il {fmtDate(e.birth_date)}{e.tax_code ? ` · C.F. ${e.tax_code}` : ''}{e.company ? ` · ${e.company}` : ''}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 font-sans text-[12.5px]">
                      <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1 text-[#155bb0] hover:underline"><Mail className="w-3.5 h-3.5" />{e.email}</a>
                      <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 text-[#155bb0] hover:underline"><Phone className="w-3.5 h-3.5" />{e.phone}</a>
                      {!courseId && <span className="text-slate-500">{fmtDate(e.course_date)} · {e.course_title}</span>}
                      <span className="text-slate-400">ricevuta il {new Date(e.created_at).toLocaleDateString('it-IT')}</span>
                    </div>
                    {e.notes && <p className="font-sans text-[12.5px] text-slate-600 mt-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5">{e.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <select value={e.status} disabled={busy === e.id} onChange={(ev) => setStatus(e, ev.target.value)}
                      className={`px-2.5 py-1.5 rounded-lg border font-sans text-[12px] font-bold uppercase cursor-pointer ${STATUS_CHIP[e.status]}`} data-testid={`enrollment-status-${e.id}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {!e.certificate_id && e.status !== 'annullata' && (
                      <button className={`${btnSecondary} !px-3 !py-1.5 !text-[12px]`} disabled={busy === e.id} onClick={() => issueOne(e)} data-testid={`enrollment-issue-${e.id}`}>
                        {busy === e.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5 text-[#1e6fd9]" />} Emetti attestato
                      </button>
                    )}
                    <ConfirmButton className={`${iconBtn} hover:!text-[#a8291c] hover:!bg-[#fdecea]`} title="Elimina" confirmLabel="Elimina?" onConfirm={() => remove(e)}><Trash2 className="w-4 h-4" /></ConfirmButton>
                  </div>
                </div>
              ))}
            </div>
          )}
      </Card>
    </div>
  );
}
