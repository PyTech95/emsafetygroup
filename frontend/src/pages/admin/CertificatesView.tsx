import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  QrCode, Plus, Trash2, Download, Upload, FileSpreadsheet, Loader2, Pencil, Ban, RotateCcw, ExternalLink, Copy,
  Search, CheckCircle2, AlertTriangle, Award,
} from 'lucide-react';
import API from '../../lib/api';
import { AdminCertificate, apiError, fmtDate, fmtRange, fmtValidity, publicSiteUrl, toIsoDate, verifyUrl } from '../../lib/training';
import { downloadBlob, qrDataUrl, qrFilename, qrPngBlob, qrZip, readCsv, toCsv } from '../../lib/qr';
import { inputCls, btnPrimary, btnSecondary, iconBtn, Field, Card, Modal, ConfirmButton, Chip, VALIDITY_OPTIONS } from './ui';

interface Participant { first_name: string; last_name: string; birth_place: string; birth_date: string; tax_code: string }
const emptyParticipant: Participant = { first_name: '', last_name: '', birth_place: '', birth_date: '', tax_code: '' };
const emptyCourse = { course_type: '', course_date: '', course_end_date: '', course_hours: '', validity_years: '5' };
type EditForm = Participant & typeof emptyCourse & { notes: string };

const PAGE = 60;

function QrPreview({ cert, showToast }: { cert: AdminCertificate; showToast: (m: string) => void }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => { qrDataUrl(cert.code, 300).then(setSrc).catch(() => setSrc(null)); }, [cert.code]);
  const url = verifyUrl(cert.code);
  return (
    <div className="text-center" data-testid="qr-preview">
      <div className="inline-block p-3 rounded-2xl border border-slate-200 bg-white">
        {src ? <img src={src} alt={`QR ${cert.code}`} className="w-[240px] h-[240px]" data-testid="qr-image" /> : <div className="w-[240px] h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#1e6fd9]" /></div>}
      </div>
      <div className="font-mono text-[17px] font-bold text-[#0b2545] mt-3 tracking-wide">{cert.code}</div>
      <div className="font-sans text-[13px] text-slate-500 mt-1">{cert.first_name} {cert.last_name} · {cert.course_type}</div>
      <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 font-mono text-[12px] text-slate-600 break-all">{url}</div>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <button className={btnPrimary} onClick={async () => downloadBlob(await qrPngBlob(cert.code), qrFilename(cert))} data-testid="qr-download"><Download className="w-4 h-4" /> Scarica PNG</button>
        <button className={btnSecondary} onClick={() => { navigator.clipboard?.writeText(url).then(() => showToast('Link copiato'), () => showToast('Copia non riuscita')); }}><Copy className="w-4 h-4" /> Copia link</button>
        <a className={btnSecondary} href={url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /> Apri verifica</a>
      </div>
      <p className="font-sans text-[11.5px] text-slate-400 mt-4 leading-relaxed">Inserisci l’immagine PNG nell’attestato (consigliati almeno 2,5 × 2,5 cm). Sotto al QR è stampato il codice, utile se il QR non è leggibile.</p>
    </div>
  );
}

export default function CertificatesView({ showToast, onChange }: { showToast: (m: string) => void; onChange?: () => void }) {
  const [certs, setCerts] = useState<AdminCertificate[] | null>(null);
  const [courseTitles, setCourseTitles] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'tutti' | 'valido' | 'scaduto' | 'revocato'>('tutti');
  const [limit, setLimit] = useState(PAGE);
  const [course, setCourse] = useState({ ...emptyCourse });
  const [people, setPeople] = useState<Participant[]>([{ ...emptyParticipant }]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<AdminCertificate[]>([]);
  const [qrFor, setQrFor] = useState<AdminCertificate | null>(null);
  const [editing, setEditing] = useState<AdminCertificate | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [zipProgress, setZipProgress] = useState<string | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    API.get('/admin/certificates').then((r) => setCerts(r.data)).catch(() => setCerts([]));
  }, []);
  useEffect(() => {
    load();
    API.get('/admin/courses').then((r) => setCourseTitles(Array.from(new Set((r.data as { title: string; kind: string }[]).map((c) => (c.kind ? `${c.title} — ${c.kind}` : c.title)))))).catch(() => {});
  }, [load]);

  const suggestions = useMemo(() => Array.from(new Set([...courseTitles, ...(certs || []).map((c) => c.course_type)])).slice(0, 80), [courseTitles, certs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (certs || []).filter((c) => (status === 'tutti' || c.status === status) && (!q || `${c.code} ${c.first_name} ${c.last_name} ${c.course_type} ${c.tax_code} ${c.birth_place}`.toLowerCase().includes(q)));
  }, [certs, search, status]);

  const host = (() => { try { return new URL(publicSiteUrl()).hostname; } catch { return ''; } })();
  const provisional = /localhost|127\.0\.0\.1|preview|emergent/i.test(host);

  const setP = (i: number, k: keyof Participant, v: string) => setPeople((ps) => ps.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)));

  const importCsv = async (file: File) => {
    try {
      const rows = await readCsv(file);
      if (!rows.length) { showToast('Il file CSV è vuoto'); return; }
      const head = rows[0].map((h) => h.toLowerCase());
      const find = (...keys: string[]) => head.findIndex((h) => keys.some((k) => h.includes(k)));
      const hasHeader = find('nome', 'cognome') >= 0;
      const idx = hasHeader
        ? { first_name: head.findIndex((h) => h.startsWith('nome') || h === 'name'), last_name: find('cognome', 'surname'), birth_place: find('luogo'), birth_date: find('data'), tax_code: find('fiscale', 'cf') }
        : { first_name: 0, last_name: 1, birth_place: 2, birth_date: 3, tax_code: 4 };
      const data = (hasHeader ? rows.slice(1) : rows).map((r) => ({
        first_name: r[idx.first_name] || '', last_name: r[idx.last_name] || '', birth_place: r[idx.birth_place] || '',
        birth_date: toIsoDate(r[idx.birth_date] || ''), tax_code: idx.tax_code >= 0 ? (r[idx.tax_code] || '').toUpperCase() : '',
        _rawDate: r[idx.birth_date] || '',
      })).filter((p) => p.first_name || p.last_name);
      if (!data.length) { showToast('Nessun partecipante trovato nel file'); return; }
      const badDates = data.filter((p) => p._rawDate && !p.birth_date).length;
      setPeople((prev) => {
        const kept = prev.filter((p) => p.first_name || p.last_name || p.birth_place || p.birth_date);
        return [...kept, ...data.map(({ _rawDate, ...p }) => p)];
      });
      showToast(`${data.length} partecipanti importati${badDates ? ` · ${badDates} date di nascita da controllare` : ''}`);
    } catch {
      showToast('Impossibile leggere il file CSV');
    }
  };

  const downloadTemplate = () => downloadBlob(toCsv([['Nome', 'Cognome', 'Luogo di nascita', 'Data di nascita', 'Codice fiscale'], ['Mario', 'Rossi', 'Treviso', '15/03/1985', '']]), 'modello_partecipanti.csv');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const rows = people.filter((p) => p.first_name || p.last_name || p.birth_place || p.birth_date);
    if (!course.course_type.trim() || !course.course_date) { setFormError('Indica tipologia e data del corso.'); return; }
    if (!rows.length) { setFormError('Aggiungi almeno un partecipante.'); return; }
    const incomplete = rows.findIndex((p) => !p.first_name.trim() || !p.last_name.trim() || !p.birth_place.trim() || !p.birth_date);
    if (incomplete >= 0) { setFormError(`Partecipante ${incomplete + 1}: compila nome, cognome, luogo e data di nascita.`); return; }
    setSaving(true);
    try {
      const items = rows.map((p) => ({
        ...p, course_type: course.course_type, course_date: course.course_date, course_end_date: course.course_end_date,
        course_hours: course.course_hours ? Number(course.course_hours.replace(',', '.')) : null, validity_years: Number(course.validity_years) || null,
      }));
      const { data } = await API.post('/admin/certificates/bulk', { items });
      setLastCreated(data.created);
      setPeople([{ ...emptyParticipant }]);
      showToast(`${data.created.length} ${data.created.length === 1 ? 'attestato creato' : 'attestati creati'}`);
      load(); onChange?.();
    } catch (err) {
      setFormError(apiError(err, 'Salvataggio non riuscito'));
    } finally { setSaving(false); }
  };

  const zip = async (list: AdminCertificate[], name: string) => {
    if (!list.length) return;
    setZipProgress(`0/${list.length}`);
    try {
      const blob = await qrZip(list, (n) => setZipProgress(`${n}/${list.length}`));
      downloadBlob(blob, name);
    } catch { showToast('Errore nella creazione dello ZIP'); } finally { setZipProgress(null); }
  };

  const exportCsv = () => {
    const rows = filtered.map((c) => [c.code, c.last_name, c.first_name, c.birth_place, fmtDate(c.birth_date), c.tax_code, c.course_type, fmtDate(c.course_date), fmtDate(c.course_end_date), c.course_hours ?? '', c.validity_years ?? '', fmtDate(c.expiry_date), c.status, verifyUrl(c.code)]);
    downloadBlob(toCsv([['Codice', 'Cognome', 'Nome', 'Luogo di nascita', 'Data di nascita', 'Codice fiscale', 'Corso', 'Data corso', 'Data fine', 'Ore', 'Validità (anni)', 'Scadenza', 'Stato', 'Link verifica'], ...rows]), 'registro_attestati.csv');
  };

  const openEdit = (c: AdminCertificate) => {
    setEditing(c);
    setEditForm({
      first_name: c.first_name, last_name: c.last_name, birth_place: c.birth_place, birth_date: c.birth_date, tax_code: c.tax_code,
      course_type: c.course_type, course_date: c.course_date, course_end_date: c.course_end_date || '', course_hours: c.course_hours ? String(c.course_hours) : '',
      validity_years: String(c.validity_years || 0), notes: c.notes || '',
    });
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editForm) return;
    try {
      await API.put(`/admin/certificates/${editing.id}`, {
        ...editForm, course_hours: editForm.course_hours ? Number(editForm.course_hours.replace(',', '.')) : null, validity_years: Number(editForm.validity_years) || null,
      });
      setEditing(null); setEditForm(null); load(); showToast('Attestato aggiornato');
    } catch (err) { showToast(apiError(err, 'Salvataggio non riuscito')); }
  };
  const toggleRevoke = async (c: AdminCertificate) => {
    try { await API.patch(`/admin/certificates/${c.id}/revoke`, { revoked: !c.revoked }); load(); showToast(c.revoked ? 'Attestato riattivato' : 'Attestato revocato'); }
    catch (err) { showToast(apiError(err)); }
  };
  const remove = async (c: AdminCertificate) => {
    try { await API.delete(`/admin/certificates/${c.id}`); load(); onChange?.(); showToast('Attestato eliminato'); }
    catch (err) { showToast(apiError(err)); }
  };

  const ef = (k: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setEditForm((f) => (f ? { ...f, [k]: e.target.value } : f));

  return (
    <div className="space-y-6" data-testid="certificates-view">
      <div className={`rounded-2xl border px-4 py-3 flex items-start gap-3 font-sans text-[13px] ${provisional ? 'bg-[#fff4dc] border-[#f5dca0] text-[#6b4700]' : 'bg-[#f0f7fd] border-[#cfe3f8] text-slate-600'}`}>
        {provisional ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> : <QrCode className="w-4 h-4 mt-0.5 shrink-0 text-[#1e6fd9]" />}
        <span>
          I QR code puntano a <strong className="font-mono">{publicSiteUrl()}/verifica/…</strong>
          {provisional
            ? ' — questo sembra un indirizzo provvisorio: prima di stampare gli attestati genera i QR dal dominio definitivo del sito (o imposta REACT_APP_PUBLIC_SITE_URL).'
            : ' — chi scansiona il QR vede i dati dell’attestato in tempo reale.'}
        </span>
      </div>

      {/* ------------------------------------------------ Nuovi attestati */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="font-display text-[19px] font-bold text-[#0b2545] flex items-center gap-2"><Plus className="w-5 h-5 text-[#1e6fd9]" /> Nuovi attestati</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadTemplate} className={btnSecondary}><FileSpreadsheet className="w-4 h-4 text-[#1e6fd9]" /> Modello CSV</button>
            <button type="button" onClick={() => csvRef.current?.click()} className={btnSecondary} data-testid="cert-import-csv"><Upload className="w-4 h-4 text-[#1e6fd9]" /> Importa partecipanti</button>
            <input ref={csvRef} type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = ''; }} />
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6" data-testid="cert-form">
          <div>
            <div className="font-sans text-[11.5px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">Dati del corso</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-3">
              <Field label="Tipologia del corso" required className="sm:col-span-2 lg:col-span-5">
                <input list="cert-course-types" value={course.course_type} onChange={(e) => setCourse((c) => ({ ...c, course_type: e.target.value }))} className={inputCls} placeholder="Es. Carrelli elevatori — Aggiornamento" data-testid="cert-course-type" />
                <datalist id="cert-course-types">{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
              </Field>
              <Field label="Data del corso" required className="lg:col-span-2"><input type="date" value={course.course_date} onChange={(e) => setCourse((c) => ({ ...c, course_date: e.target.value }))} className={inputCls} data-testid="cert-course-date" /></Field>
              <Field label="Data fine (se più giorni)" className="lg:col-span-2"><input type="date" value={course.course_end_date} min={course.course_date || undefined} onChange={(e) => setCourse((c) => ({ ...c, course_end_date: e.target.value }))} className={inputCls} /></Field>
              <Field label="Durata (ore)" className="lg:col-span-1"><input inputMode="decimal" value={course.course_hours} onChange={(e) => setCourse((c) => ({ ...c, course_hours: e.target.value }))} className={inputCls} placeholder="4" data-testid="cert-course-hours" /></Field>
              <Field label="Validità attestato" className="lg:col-span-2">
                <select value={course.validity_years} onChange={(e) => setCourse((c) => ({ ...c, validity_years: e.target.value }))} className={inputCls} data-testid="cert-validity">
                  {VALIDITY_OPTIONS.map((v) => <option key={v} value={v}>{fmtValidity(v)}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div>
            <div className="font-sans text-[11.5px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">Partecipanti ({people.length})</div>
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_150px_160px_36px] gap-2 px-1 mb-1.5 font-sans text-[12px] font-semibold text-slate-500">
              <span>Nome *</span><span>Cognome *</span><span>Luogo di nascita *</span><span>Data di nascita *</span><span>Codice fiscale</span><span />
            </div>
            <div className="space-y-2.5 md:space-y-2">
              {people.map((p, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_150px_160px_36px] gap-2 p-3 md:p-0 rounded-2xl md:rounded-none bg-slate-50 md:bg-transparent border md:border-0 border-slate-100" data-testid={`cert-person-${i}`}>
                  <input aria-label="Nome" placeholder="Nome" value={p.first_name} onChange={(e) => setP(i, 'first_name', e.target.value)} className={inputCls} />
                  <input aria-label="Cognome" placeholder="Cognome" value={p.last_name} onChange={(e) => setP(i, 'last_name', e.target.value)} className={inputCls} />
                  <input aria-label="Luogo di nascita" placeholder="Luogo di nascita" value={p.birth_place} onChange={(e) => setP(i, 'birth_place', e.target.value)} className={inputCls} />
                  <input aria-label="Data di nascita" type="date" value={p.birth_date} onChange={(e) => setP(i, 'birth_date', e.target.value)} className={inputCls} />
                  <input aria-label="Codice fiscale" placeholder="C.F. (facoltativo)" value={p.tax_code} maxLength={16} onChange={(e) => setP(i, 'tax_code', e.target.value.toUpperCase())} className={`${inputCls} uppercase col-span-2 md:col-span-1`} />
                  <button type="button" onClick={() => setPeople((ps) => (ps.length > 1 ? ps.filter((_, idx) => idx !== i) : [{ ...emptyParticipant }]))} className={`${iconBtn} hover:!text-[#a8291c] hover:!bg-[#fdecea] justify-self-end md:justify-self-auto col-span-2 md:col-span-1`} aria-label="Rimuovi partecipante"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setPeople((ps) => [...ps, { ...emptyParticipant }])} className="mt-3 inline-flex items-center gap-1.5 font-sans text-[13px] font-bold text-[#1e6fd9] hover:text-[#155bb0] cursor-pointer" data-testid="cert-add-person"><Plus className="w-4 h-4" /> Aggiungi partecipante</button>
          </div>

          {formError && <p className="font-sans text-[13px] text-[#a8291c] bg-[#fdecea] border border-[#f5c6c0] rounded-xl px-3.5 py-2.5" data-testid="cert-form-error">{formError}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className={btnPrimary} data-testid="cert-submit">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              Crea {people.filter((p) => p.first_name || p.last_name).length || ''} attestat{people.filter((p) => p.first_name || p.last_name).length === 1 ? 'o' : 'i'} con QR
            </button>
            <span className="font-sans text-[12px] text-slate-400">Il codice univoco e il QR vengono generati automaticamente.</span>
          </div>
        </form>

        {lastCreated.length > 0 && (
          <div className="mt-6 rounded-2xl border border-[#bfe5d0] bg-[#f3fbf6] p-4" data-testid="cert-created">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-sans text-[14px] font-bold text-[#0f6b43]"><CheckCircle2 className="w-5 h-5" /> {lastCreated.length} {lastCreated.length === 1 ? 'attestato creato' : 'attestati creati'}</div>
              <button className={btnPrimary} disabled={!!zipProgress} onClick={() => zip(lastCreated, `QR_attestati_${new Date().toISOString().slice(0, 10)}.zip`)} data-testid="cert-created-zip">
                {zipProgress ? <><Loader2 className="w-4 h-4 animate-spin" /> {zipProgress}</> : <><Download className="w-4 h-4" /> Scarica tutti i QR (ZIP)</>}
              </button>
            </div>
            <div className="mt-3 divide-y divide-[#d7efe1]">
              {lastCreated.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 font-sans text-[13px]">
                  <span className="font-mono font-bold text-[#0b2545]">{c.code}</span>
                  <span className="text-slate-600 flex-1">{c.last_name} {c.first_name}</span>
                  <button onClick={() => setQrFor(c)} className="inline-flex items-center gap-1 font-bold text-[#155bb0] hover:underline cursor-pointer"><QrCode className="w-4 h-4" /> QR</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ------------------------------------------------ Registro */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-[19px] font-bold text-[#0b2545]">Registro attestati <span className="text-slate-400 font-sans text-[15px]">({certs?.length ?? 0})</span></h2>
          <div className="flex flex-wrap gap-2">
            <button className={btnSecondary} onClick={exportCsv} disabled={!filtered.length} data-testid="cert-export"><FileSpreadsheet className="w-4 h-4 text-[#1e6fd9]" /> Esporta CSV</button>
            <button className={btnSecondary} onClick={() => zip(filtered, 'QR_registro_attestati.zip')} disabled={!filtered.length || !!zipProgress}>
              {zipProgress ? <><Loader2 className="w-4 h-4 animate-spin" /> {zipProgress}</> : <><Download className="w-4 h-4 text-[#1e6fd9]" /> QR filtrati (ZIP)</>}
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <label className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setLimit(PAGE); }} placeholder="Cerca per nome, codice, corso, codice fiscale…" className={`${inputCls} pl-10`} data-testid="cert-search" />
          </label>
          <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setLimit(PAGE); }} className={`${inputCls} sm:w-44`}>
            <option value="tutti">Tutti gli stati</option><option value="valido">Validi</option><option value="scaduto">Scaduti</option><option value="revocato">Revocati</option>
          </select>
        </div>

        {certs === null ? (
          <div className="py-14 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#0b2545]" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl font-sans text-[14px] text-slate-500" data-testid="cert-empty">
            {certs.length ? 'Nessun attestato corrisponde alla ricerca.' : 'Nessun attestato ancora. Creane uno dal modulo qui sopra.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100" data-testid="cert-list">
            {filtered.slice(0, limit).map((c) => (
              <div key={c.id} className="py-3.5 flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4" data-testid={`cert-row-${c.code}`}>
                <div className="lg:w-[190px] shrink-0 flex items-center gap-2">
                  <span className="font-mono text-[13px] font-bold text-[#0b2545]">{c.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[15px] font-bold text-[#0b2545] truncate">{c.last_name} {c.first_name}</div>
                  <div className="font-sans text-[12.5px] text-slate-500 truncate">{c.birth_place} · {fmtDate(c.birth_date)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[13px] font-semibold text-slate-700 truncate">{c.course_type}</div>
                  <div className="font-sans text-[12.5px] text-slate-500">{fmtRange(c.course_date, c.course_end_date)}{c.expiry_date ? ` · scade ${fmtDate(c.expiry_date)}` : ''}</div>
                </div>
                <div className="flex items-center gap-1 lg:justify-end shrink-0">
                  <span className="mr-2"><Chip status={c.status} /></span>
                  <button className={iconBtn} title="QR code" onClick={() => setQrFor(c)} data-testid={`cert-qr-${c.code}`}><QrCode className="w-4 h-4" /></button>
                  <button className={iconBtn} title="Modifica" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></button>
                  <button className={iconBtn} title={c.revoked ? 'Riattiva' : 'Revoca'} onClick={() => toggleRevoke(c)}>{c.revoked ? <RotateCcw className="w-4 h-4" /> : <Ban className="w-4 h-4" />}</button>
                  <ConfirmButton className={`${iconBtn} hover:!text-[#a8291c] hover:!bg-[#fdecea]`} title="Elimina" onConfirm={() => remove(c)} confirmLabel="Elimina?"><Trash2 className="w-4 h-4" /></ConfirmButton>
                </div>
              </div>
            ))}
          </div>
        )}
        {filtered.length > limit && (
          <div className="text-center mt-4"><button className={btnSecondary} onClick={() => setLimit((l) => l + PAGE)}>Mostra altri ({filtered.length - limit})</button></div>
        )}
      </Card>

      <Modal open={!!qrFor} title="QR code attestato" onClose={() => setQrFor(null)}>
        {qrFor && <QrPreview cert={qrFor} showToast={showToast} />}
      </Modal>

      <Modal open={!!editing} title={`Modifica attestato ${editing?.code || ''}`} onClose={() => { setEditing(null); setEditForm(null); }} wide>
        {editForm && (
          <form onSubmit={saveEdit} className="grid sm:grid-cols-2 gap-3" data-testid="cert-edit-form">
            <Field label="Nome" required><input value={editForm.first_name} onChange={ef('first_name')} className={inputCls} /></Field>
            <Field label="Cognome" required><input value={editForm.last_name} onChange={ef('last_name')} className={inputCls} /></Field>
            <Field label="Luogo di nascita" required><input value={editForm.birth_place} onChange={ef('birth_place')} className={inputCls} /></Field>
            <Field label="Data di nascita" required><input type="date" value={editForm.birth_date} onChange={ef('birth_date')} className={inputCls} /></Field>
            <Field label="Tipologia del corso" required className="sm:col-span-2"><input list="cert-course-types" value={editForm.course_type} onChange={ef('course_type')} className={inputCls} /></Field>
            <Field label="Data del corso" required><input type="date" value={editForm.course_date} onChange={ef('course_date')} className={inputCls} /></Field>
            <Field label="Data fine (se più giorni)"><input type="date" value={editForm.course_end_date} onChange={ef('course_end_date')} className={inputCls} /></Field>
            <Field label="Durata (ore)"><input inputMode="decimal" value={editForm.course_hours} onChange={ef('course_hours')} className={inputCls} /></Field>
            <Field label="Validità attestato">
              <select value={editForm.validity_years} onChange={ef('validity_years')} className={inputCls}>{VALIDITY_OPTIONS.map((v) => <option key={v} value={v}>{fmtValidity(v)}</option>)}</select>
            </Field>
            <Field label="Codice fiscale (non pubblico)"><input value={editForm.tax_code} onChange={ef('tax_code')} maxLength={16} className={`${inputCls} uppercase`} /></Field>
            <Field label="Note interne (non pubbliche)"><input value={editForm.notes} onChange={ef('notes')} className={inputCls} /></Field>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button type="button" className={btnSecondary} onClick={() => { setEditing(null); setEditForm(null); }}>Annulla</button>
              <button type="submit" className={btnPrimary}><CheckCircle2 className="w-4 h-4" /> Salva modifiche</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
