import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2, CheckCircle2, UploadCloud, X, Star, Eye, EyeOff, MessageSquareQuote, ExternalLink } from 'lucide-react';
import API, { fileUrl } from '../../lib/api';
import { AdminTestimonial, initials } from '../../lib/testimonials';
import { apiError } from '../../lib/training';
import { inputCls, btnPrimary, btnSecondary, iconBtn, Field, Card, ConfirmButton } from './ui';

const empty = { name: '', role: '', company: '', text: '', rating: 0, featured: false, published: true, photo_path: '' as string | null };
type Form = typeof empty;

export function Stars({ value, onChange, size = 'w-5 h-5' }: { value: number; onChange?: (v: number) => void; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={value ? `${value} stelle su 5` : 'Nessuna valutazione'}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        const star = <Star className={`${size} ${on ? 'fill-[#f5a800] text-[#f5a800]' : 'text-slate-300'}`} />;
        return onChange ? (
          <button key={n} type="button" onClick={() => onChange(value === n ? 0 : n)} className="cursor-pointer p-0.5" aria-label={`${n} stelle`} data-testid={`testimonial-star-${n}`}>{star}</button>
        ) : <span key={n}>{star}</span>;
      })}
    </span>
  );
}

export default function TestimonialsView({ showToast, onChange }: { showToast: (m: string) => void; onChange?: () => void }) {
  const [items, setItems] = useState<AdminTestimonial[] | null>(null);
  const [form, setForm] = useState<Form>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => { API.get('/admin/testimonials').then((r) => setItems(r.data)).catch(() => setItems([])); }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const reset = () => { setForm({ ...empty }); setEditingId(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; };

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) { showToast('Seleziona un’immagine (JPG o PNG)'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const { data } = await API.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, photo_path: data.path }));
      setPreview(fileUrl(data.url) || null);
    } catch { showToast('Caricamento foto non riuscito'); } finally { setUploading(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) { showToast('Nome e testo sono obbligatori'); return; }
    setSaving(true);
    const payload = { ...form, rating: form.rating || null, photo_path: form.photo_path ?? '' };
    try {
      if (editingId) { await API.put(`/admin/testimonials/${editingId}`, payload); showToast('Testimonianza aggiornata'); }
      else { await API.post('/admin/testimonials', payload); showToast(form.published ? 'Testimonianza pubblicata' : 'Testimonianza salvata come bozza'); }
      reset(); load(); onChange?.();
    } catch (err) { showToast(apiError(err, 'Salvataggio non riuscito')); } finally { setSaving(false); }
  };

  const startEdit = (t: AdminTestimonial) => {
    setEditingId(t.id);
    setForm({ name: t.name, role: t.role, company: t.company, text: t.text, rating: t.rating || 0, featured: t.featured, published: t.published, photo_path: t.photo_path });
    setPreview(t.photo_url ? fileUrl(t.photo_url) || null : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const patch = async (t: AdminTestimonial, changes: Partial<AdminTestimonial>, msg: string) => {
    setBusy(t.id);
    try {
      await API.put(`/admin/testimonials/${t.id}`, { name: t.name, role: t.role, company: t.company, text: t.text, rating: t.rating, featured: t.featured, published: t.published, ...changes });
      load(); onChange?.(); showToast(msg);
    } catch (err) { showToast(apiError(err)); } finally { setBusy(null); }
  };

  const remove = async (t: AdminTestimonial) => {
    try { await API.delete(`/admin/testimonials/${t.id}`); if (editingId === t.id) reset(); load(); onChange?.(); showToast('Testimonianza eliminata'); }
    catch (err) { showToast(apiError(err)); }
  };

  const move = async (index: number, dir: -1 | 1) => {
    if (!items) return;
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    try { await API.post('/admin/testimonials/reorder', { ids: next.map((t) => t.id) }); load(); } catch { showToast('Ordinamento non salvato'); load(); }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6" data-testid="testimonials-admin-view">
      <div className="lg:col-span-5">
        <Card className="p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[19px] font-bold text-[#0b2545] flex items-center gap-2"><Plus className="w-5 h-5 text-[#1e6fd9]" /> {editingId ? 'Modifica testimonianza' : 'Nuova testimonianza'}</h2>
            {editingId && <button type="button" onClick={reset} className="font-sans text-[12.5px] font-semibold text-slate-400 hover:text-[#a8291c] cursor-pointer">Annulla</button>}
          </div>
          <form onSubmit={submit} className="space-y-4" data-testid="testimonial-form">
            <Field label="Nome e cognome (o iniziali)" required><input value={form.name} onChange={set('name')} className={inputCls} placeholder="Es. Marco R." data-testid="testimonial-name" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ruolo"><input value={form.role} onChange={set('role')} className={inputCls} placeholder="Es. Responsabile HSE" data-testid="testimonial-role" /></Field>
              <Field label="Azienda"><input value={form.company} onChange={set('company')} className={inputCls} placeholder="Es. Rossi S.r.l." data-testid="testimonial-company" /></Field>
            </div>
            <Field label="Testimonianza" required hint={`${form.text.length}/1500 caratteri`}>
              <textarea value={form.text} onChange={set('text')} maxLength={1500} rows={5} className={inputCls} placeholder="Il testo scritto dal cliente…" data-testid="testimonial-text" />
            </Field>
            <div>
              <span className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1">Valutazione (facoltativa)</span>
              <Stars value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size="w-6 h-6" />
            </div>
            <div>
              <span className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Foto o logo (facoltativo)</span>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin text-[#1e6fd9]" /> : preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <span className="font-display font-bold text-slate-400">{initials(form.name) || '?'}</span>}
                </div>
                <button type="button" onClick={() => fileRef.current?.click()} className={btnSecondary}><UploadCloud className="w-4 h-4 text-[#1e6fd9]" /> {preview ? 'Cambia' : 'Carica'}</button>
                {preview && <button type="button" onClick={() => { setPreview(null); setForm((f) => ({ ...f, photo_path: '' })); }} className="inline-flex items-center gap-1 font-sans text-[12px] text-slate-400 hover:text-[#a8291c] cursor-pointer"><X className="w-3.5 h-3.5" /> Rimuovi</button>}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />
              </div>
            </div>
            <div className="flex flex-col gap-2.5 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer font-sans text-[13.5px] text-[#0b2545]"><input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-[#1e6fd9]" data-testid="testimonial-published" /> Pubblicata sul sito</label>
              <label className="flex items-center gap-2.5 cursor-pointer font-sans text-[13.5px] text-[#0b2545]"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-[#1e6fd9]" data-testid="testimonial-featured" /> In evidenza (mostrata per prima e in home page)</label>
            </div>
            <p className="font-sans text-[11.5px] text-slate-400 leading-relaxed">Pubblica solo testimonianze reali, con il consenso del cliente a mostrare nome, ruolo e foto.</p>
            <button type="submit" disabled={saving || uploading} className={`${btnPrimary} w-full`} data-testid="testimonial-submit">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} {editingId ? 'Salva modifiche' : 'Aggiungi testimonianza'}
            </button>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[19px] font-bold text-[#0b2545]">Testimonianze <span className="text-slate-400 font-sans text-[15px]">({items?.length ?? 0})</span></h2>
          <a href="/testimonianze" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-[#1e6fd9] hover:underline"><ExternalLink className="w-4 h-4" /> Vedi la pagina</a>
        </div>
        {items === null ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#0b2545]" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl" data-testid="testimonials-empty">
            <MessageSquareQuote className="w-9 h-9 text-slate-300 mx-auto mb-3" />
            <p className="font-sans text-[14px] text-slate-500">Nessuna testimonianza. Aggiungi la prima dal modulo a sinistra.</p>
          </div>
        ) : (
          <div className="space-y-3" data-testid="testimonials-list">
            {items.map((t, i) => (
              <div key={t.id} className={`bg-white rounded-2xl border p-4 flex gap-4 ${t.published ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-75'}`} data-testid={`testimonial-${t.id}`}>
                <div className="w-12 h-12 rounded-full bg-[#0b2545] text-white overflow-hidden flex items-center justify-center shrink-0 font-display font-bold">
                  {t.photo_url ? <img src={fileUrl(t.photo_url)} alt="" className="w-full h-full object-cover" /> : initials(t.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[15.5px] font-bold text-[#0b2545]">{t.name}</span>
                    {t.featured && <span className="px-2 py-0.5 rounded-full bg-[#fff4dc] text-[#8a5a00] font-sans text-[10.5px] font-bold uppercase">In evidenza</span>}
                    {!t.published && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-sans text-[10.5px] font-bold uppercase">Bozza</span>}
                    {t.rating ? <Stars value={t.rating} size="w-3.5 h-3.5" /> : null}
                  </div>
                  {(t.role || t.company) && <div className="font-sans text-[12.5px] text-slate-500">{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
                  <p className="font-sans text-[13.5px] text-slate-700 leading-relaxed mt-1.5 line-clamp-3">“{t.text}”</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-0.5 shrink-0 self-start">
                  <button className={iconBtn} title="Sposta su" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="w-4 h-4" /></button>
                  <button className={iconBtn} title="Sposta giù" disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown className="w-4 h-4" /></button>
                  <button className={iconBtn} title={t.published ? 'Nascondi dal sito' : 'Pubblica'} disabled={busy === t.id} onClick={() => patch(t, { published: !t.published }, t.published ? 'Testimonianza nascosta' : 'Testimonianza pubblicata')} data-testid={`testimonial-toggle-${t.id}`}>{t.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                  <button className={iconBtn} title="Modifica" onClick={() => startEdit(t)} data-testid={`testimonial-edit-${t.id}`}><Pencil className="w-4 h-4" /></button>
                  <ConfirmButton className={`${iconBtn} hover:!text-[#a8291c] hover:!bg-[#fdecea]`} title="Elimina" confirmLabel="Elimina?" onConfirm={() => remove(t)} testid={`testimonial-delete-${t.id}`}><Trash2 className="w-4 h-4" /></ConfirmButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
