import { useState } from 'react';
import { Loader2, Plus, Trash2, UploadCloud, ArrowUp, ArrowDown, Pencil, Check, X, Moon } from 'lucide-react';
import API from '../../lib/api';
import { useLogos, logoSrc, type Logo, type LogoSection } from '../../lib/logos';

const SECTIONS: { key: LogoSection; label: string; hint: string; hasDesc: boolean }[] = [
  { key: 'clients', label: 'Clienti (Hanno creduto in noi)', hint: 'Loghi dei clienti mostrati nella home.', hasDesc: false },
  { key: 'group', label: 'Il Gruppo', hint: 'Le società del gruppo con logo e breve descrizione.', hasDesc: true },
  { key: 'affiliations', label: 'Affiliazioni & Partner', hint: 'Enti e partner con logo e descrizione.', hasDesc: true },
];

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1e6fd9] focus:ring-2 focus:ring-[#1e6fd9]/10 outline-none font-sans text-[14px] text-slate-800 transition-all';

export default function LogosView({ showToast }: { showToast: (m: string) => void }) {
  const [section, setSection] = useState<LogoSection>('clients');
  const meta = SECTIONS.find((s) => s.key === section)!;
  const { logos, loaded, refresh } = useLogos(section);
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', dark: false });
  const [newForm, setNewForm] = useState({ name: '', description: '', dark: false, file: null as File | null });
  const [adding, setAdding] = useState(false);

  const fail = (e: unknown, fallback: string) => {
    const d = (e as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
    showToast(typeof d === 'string' ? d : fallback);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.file || !newForm.name.trim()) { showToast('Nome e immagine sono obbligatori'); return; }
    setAdding(true);
    try {
      const fd = new FormData();
      fd.append('section', section); fd.append('name', newForm.name); fd.append('description', newForm.description);
      fd.append('dark', String(newForm.dark)); fd.append('file', newForm.file);
      await API.post('/logos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewForm({ name: '', description: '', dark: false, file: null });
      refresh(); showToast('Logo aggiunto');
    } catch (err) { fail(err, 'Errore durante il caricamento'); } finally { setAdding(false); }
  };

  const replaceImage = async (l: Logo, file: File) => {
    setBusy(l.id);
    try {
      const fd = new FormData(); fd.append('file', file);
      await API.put(`/logos/${l.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      refresh(); showToast('Immagine aggiornata');
    } catch (err) { fail(err, 'Errore'); } finally { setBusy(null); }
  };

  const saveEdit = async (l: Logo) => {
    setBusy(l.id);
    try {
      const fd = new FormData(); fd.append('name', form.name); fd.append('description', form.description); fd.append('dark', String(form.dark));
      await API.put(`/logos/${l.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditing(null); refresh(); showToast('Logo aggiornato');
    } catch (err) { fail(err, 'Errore'); } finally { setBusy(null); }
  };

  const remove = async (l: Logo) => {
    if (!window.confirm(`Eliminare "${l.name}"?`)) return;
    setBusy(l.id);
    try { await API.delete(`/logos/${l.id}`); refresh(); showToast('Logo eliminato'); }
    catch (err) { fail(err, 'Errore'); } finally { setBusy(null); }
  };

  const move = async (i: number, dir: -1 | 1) => {
    const ids = logos.map((l) => l.id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    try { await API.post('/logos/reorder', { ids }); refresh(); } catch (err) { fail(err, 'Errore'); }
  };

  return (
    <div className="space-y-6" data-testid="logos-view">
      <div className="flex gap-2 overflow-x-auto pb-1" data-testid="logos-sections">
        {SECTIONS.map((s) => (
          <button key={s.key} onClick={() => { setSection(s.key); setEditing(null); }} data-testid={`logos-section-${s.key}`}
            className={`shrink-0 px-4 py-2 rounded-full font-sans text-[13px] font-bold border transition-colors cursor-pointer ${section === s.key ? 'bg-[#1e6fd9] text-white border-[#1e6fd9]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1e6fd9]/50'}`}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="font-sans text-[14px] text-slate-500 -mt-2">{meta.hint} Puoi aggiungere, sostituire, rinominare, riordinare ed eliminare i loghi.</p>

      <form onSubmit={add} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-3 items-end" data-testid="logo-add-form">
        <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Nome *</label><input value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Es. Azienda S.p.A." data-testid="logo-new-name" /></div>
        <div>
          <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Immagine (PNG/SVG/JPG) *</label>
          <label className={`${inputCls} flex items-center gap-2 cursor-pointer truncate`} data-testid="logo-new-file-label">
            <UploadCloud className="w-4 h-4 text-[#1e6fd9] shrink-0" /><span className="truncate">{newForm.file ? newForm.file.name : 'Scegli file…'}</span>
            <input type="file" accept="image/*" className="hidden" data-testid="logo-new-file" onChange={(e) => setNewForm((f) => ({ ...f, file: e.target.files?.[0] || null }))} />
          </label>
        </div>
        {meta.hasDesc && <div className="sm:col-span-2 lg:col-span-2"><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Descrizione</label><input value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} placeholder="Breve descrizione" data-testid="logo-new-description" /></div>}
        {!meta.hasDesc && (
          <label className="flex items-center gap-2 font-sans text-[13px] text-slate-600 cursor-pointer sm:col-span-2 lg:col-span-1 lg:order-none" data-testid="logo-new-dark-label">
            <input type="checkbox" checked={newForm.dark} onChange={(e) => setNewForm((f) => ({ ...f, dark: e.target.checked }))} className="w-4 h-4 accent-[#1e6fd9]" data-testid="logo-new-dark" /> Sfondo scuro (logo bianco)
          </label>
        )}
        <button type="submit" disabled={adding} data-testid="logo-add-submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0b2545] hover:bg-[#07192e] disabled:opacity-60 text-white font-sans text-[14px] font-bold rounded-xl shadow-lg transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer lg:col-start-3 lg:row-start-1">
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Aggiungi logo
        </button>
      </form>

      {!loaded ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#0b2545]" /></div>
      ) : logos.length === 0 ? (
        <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl" data-testid="logos-empty"><p className="font-sans text-[14px] text-slate-500">Nessun logo in questa sezione.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="logos-list">
          {logos.map((l, i) => {
            const isEditing = editing === l.id;
            return (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" data-testid={`logo-card-${i}`}>
                <div className={`h-32 flex items-center justify-center overflow-hidden border-b border-slate-100 relative ${l.dark ? 'bg-neutral-900' : 'bg-slate-50'}`}>
                  <img src={logoSrc(l.image_url)} alt={l.name} className="max-h-20 max-w-[80%] object-contain" data-testid={`logo-img-${i}`} />
                  {busy === l.id && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#1e6fd9]" /></div>}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[#0b2545] font-sans text-[10.5px] font-bold border border-slate-200">#{i + 1}</span>
                </div>
                <div className="p-3.5 space-y-2.5">
                  {isEditing ? (
                    <>
                      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} data-testid={`logo-edit-name-${i}`} />
                      {meta.hasDesc && <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} data-testid={`logo-edit-description-${i}`} />}
                      {!meta.hasDesc && <label className="flex items-center gap-2 font-sans text-[12.5px] text-slate-600 cursor-pointer"><input type="checkbox" checked={form.dark} onChange={(e) => setForm((f) => ({ ...f, dark: e.target.checked }))} className="w-4 h-4 accent-[#1e6fd9]" /> Sfondo scuro</label>}
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(l)} data-testid={`logo-edit-save-${i}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-sans text-[12.5px] font-bold cursor-pointer"><Check className="w-3.5 h-3.5" /> Salva</button>
                        <button onClick={() => setEditing(null)} data-testid={`logo-edit-cancel-${i}`} className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-[#0b2545] cursor-pointer"><X className="w-4 h-4" /></button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-sans text-[13.5px] font-bold text-[#0b2545] leading-snug flex items-center gap-1.5" data-testid={`logo-name-${i}`}>{l.dark && <Moon className="w-3.5 h-3.5 text-slate-400" />}{l.name}</div>
                      {l.description && <p className="font-sans text-[12px] text-slate-500 leading-relaxed line-clamp-2">{l.description}</p>}
                      <div className="flex items-center gap-1.5 pt-1">
                        <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-sans text-[12.5px] font-bold cursor-pointer transition-colors" data-testid={`logo-replace-${i}`}>
                          <UploadCloud className="w-3.5 h-3.5" /> Sostituisci
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) replaceImage(l, f); e.target.value = ''; }} />
                        </label>
                        <button onClick={() => { setEditing(l.id); setForm({ name: l.name, description: l.description, dark: l.dark }); }} title="Modifica" data-testid={`logo-edit-${i}`} className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-[#1e6fd9] hover:bg-[#e8f1fc] cursor-pointer"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => move(i, -1)} disabled={i === 0} title="Sposta su" data-testid={`logo-up-${i}`} className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-[#0b2545] disabled:opacity-30 cursor-pointer disabled:cursor-default"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => move(i, 1)} disabled={i === logos.length - 1} title="Sposta giù" data-testid={`logo-down-${i}`} className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-[#0b2545] disabled:opacity-30 cursor-pointer disabled:cursor-default"><ArrowDown className="w-4 h-4" /></button>
                        <button onClick={() => remove(l)} title="Elimina" data-testid={`logo-delete-${i}`} className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
