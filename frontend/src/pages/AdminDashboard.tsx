import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Plus, Trash2, UploadCloud, Home, Loader2, CheckCircle2, X, ImageIcon,
  Inbox, Users, MailOpen, Newspaper, LayoutDashboard, Images, Settings, Menu,
  TrendingUp, Mail, Send, RotateCcw, Pencil,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import API, { fileUrl, BACKEND } from '../lib/api';
import { useAssetsContext, resolveAsset } from '../lib/assets';
import { MEDIA_SLOTS } from '../data/mediaRegistry';
import EmSafetyLogo from '../components/EmSafetyLogo';

interface Story { id: string; title: string; sector: string; summary: string; content: string; cover_path?: string | null; cover_url?: string | null; created_at: string; }
interface Inquiry { id: string; name: string; company: string; email: string; phone: string; service: string; message: string; status: string; created_at: string; }
interface Client { id: string; email: string; name: string; created_at: string; }
interface Stats { series: { day: string; visitors: number; inquiries: number }[]; totals: { visitors: number; visits_today: number; inquiries: number; new_inquiries: number; stories: number; clients: number }; }
interface EmailSettings { sender_email: string; sender_name: string; receiver_email: string; cc_email: string; enabled: boolean; has_app_password: boolean; }

type Section = 'dashboard' | 'media' | 'storie' | 'richieste' | 'clienti' | 'impostazioni';
const emptyStory = { title: '', sector: '', summary: '', content: '', cover_path: '' as string | null };

const NAVY = '#0b2545';
const BLUE = '#1e6fd9';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = typeof user === 'object' && user?.role === 'admin';
  const [section, setSection] = useState<Section>(isAdmin ? 'dashboard' : 'storie');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3500); };

  const [stats, setStats] = useState<Stats | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const loadStats = useCallback(() => { API.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {}); }, []);
  const loadStories = useCallback(() => API.get('/stories').then((r) => setStories(r.data)).catch(() => setStories([])), []);
  const loadInquiries = useCallback(() => API.get('/inquiries').then((r) => setInquiries(r.data)).catch(() => setInquiries([])), []);
  const loadClients = useCallback(() => API.get('/admin/clients').then((r) => setClients(r.data)).catch(() => setClients([])), []);

  useEffect(() => {
    loadStories();
    if (isAdmin) { loadStats(); loadInquiries(); loadClients(); }
  }, [isAdmin, loadStories, loadStats, loadInquiries, loadClients]);

  const navItems: { key: Section; label: string; icon: typeof Home; adminOnly?: boolean; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
    { key: 'media', label: 'Immagini Sito', icon: Images, adminOnly: true },
    { key: 'storie', label: 'Storie / Blog', icon: Newspaper },
    { key: 'richieste', label: 'Richieste', icon: Inbox, adminOnly: true, badge: inquiries.filter((q) => q.status === 'nuova').length },
    { key: 'clienti', label: 'Clienti', icon: Users, adminOnly: true },
    { key: 'impostazioni', label: 'Impostazioni', icon: Settings, adminOnly: true },
  ];
  const visibleNav = navItems.filter((n) => !n.adminOnly || isAdmin);
  const current = visibleNav.find((n) => n.key === section) || visibleNav[0];

  return (
    <div className="min-h-screen bg-slate-100 flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-[264px] bg-[#0b2545] text-white flex flex-col shrink-0 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} data-testid="admin-sidebar">
        <div className="h-[76px] flex items-center gap-3 px-5 border-b border-white/10">
          <EmSafetyLogo variant="light" size="xs" showTagline={false} showSlogan={false} />
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {visibleNav.map((n) => {
            const Icon = n.icon;
            const active = section === n.key;
            return (
              <button key={n.key} onClick={() => { setSection(n.key); setSidebarOpen(false); }} data-testid={`admin-nav-${n.key}`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-[14px] font-semibold transition-colors cursor-pointer ${active ? 'bg-[#1e6fd9] text-white shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                <Icon className="w-[18px] h-[18px]" />
                <span className="flex-1 text-left">{n.label}</span>
                {n.badge ? <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#0b2545] text-[11px] font-bold">{n.badge}</span> : null}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => navigate('/')} data-testid="admin-view-site" className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-sans text-[13px] font-semibold transition-colors cursor-pointer mb-2"><Home className="w-4 h-4" /> Vai al sito</button>
          <button onClick={async () => { await logout(); navigate('/admin/login'); }} data-testid="admin-logout" className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-[#0b2545] hover:bg-amber-300 font-sans text-[13px] font-bold transition-colors cursor-pointer"><LogOut className="w-4 h-4" /> Esci</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[76px] bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer" data-testid="admin-sidebar-toggle"><Menu className="w-5 h-5 text-[#0b2545]" /></button>
            <div>
              <h1 className="font-display text-[20px] sm:text-[22px] font-bold text-[#0b2545] leading-none">{current.label}</h1>
              <p className="font-sans text-[12px] text-slate-400 mt-1">{isAdmin ? 'Pannello Amministratore' : 'Area Cliente'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="font-sans text-[13px] font-semibold text-[#0b2545]">{typeof user === 'object' && user ? user.name : ''}</div>
              <div className="font-sans text-[11.5px] text-slate-400">{typeof user === 'object' && user ? user.email : ''}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0b2545] text-amber-400 flex items-center justify-center font-display font-bold">{(typeof user === 'object' && user ? (user.name || user.email) : 'A').charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-[1200px] w-full mx-auto">
          {section === 'dashboard' && isAdmin && <DashboardView stats={stats} inquiries={inquiries} onGo={setSection} />}
          {section === 'media' && isAdmin && <MediaView showToast={showToast} />}
          {section === 'storie' && <StorieView stories={stories} reload={() => { loadStories(); if (isAdmin) loadStats(); }} showToast={showToast} />}
          {section === 'richieste' && isAdmin && <RichiesteView inquiries={inquiries} reload={() => { loadInquiries(); loadStats(); }} showToast={showToast} />}
          {section === 'clienti' && isAdmin && <ClientiView clients={clients} reload={() => { loadClients(); loadStats(); }} showToast={showToast} />}
          {section === 'impostazioni' && isAdmin && <ImpostazioniView showToast={showToast} />}
        </main>
      </div>

      {toast && (
        <div data-testid="admin-toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#0b2545] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-400/50">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-sans text-[13px] font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Dashboard */
function StatCard({ icon: Icon, label, value, tint, testid }: { icon: typeof Home; label: string; value: number | string; tint: string; testid: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" data-testid={testid}>
      <div className="flex items-center justify-between">
        <span className="font-sans text-[12.5px] font-semibold text-slate-500">{label}</span>
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${tint}1a`, color: tint }}><Icon className="w-[18px] h-[18px]" /></span>
      </div>
      <div className="font-display text-[30px] font-extrabold text-[#0b2545] mt-3 leading-none">{value}</div>
    </div>
  );
}

function DashboardView({ stats, inquiries, onGo }: { stats: Stats | null; inquiries: Inquiry[]; onGo: (s: Section) => void }) {
  if (!stats) return <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#0b2545]" /></div>;
  const t = stats.totals;
  const data = stats.series.map((s) => ({ ...s, label: s.day.slice(8) + '/' + s.day.slice(5, 7) }));
  const recent = inquiries.slice(0, 5);
  return (
    <div className="space-y-6" data-testid="dashboard-view">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label="Visitatori totali" value={t.visitors} tint={BLUE} testid="stat-visitors" />
        <StatCard icon={LayoutDashboard} label="Visite oggi" value={t.visits_today} tint="#0ea5e9" testid="stat-visits-today" />
        <StatCard icon={Inbox} label="Richieste totali" value={t.inquiries} tint="#f59e0b" testid="stat-inquiries" />
        <StatCard icon={Mail} label="Richieste nuove" value={t.new_inquiries} tint="#ef4444" testid="stat-new-inquiries" />
        <StatCard icon={Newspaper} label="Storie pubblicate" value={t.stories} tint={NAVY} testid="stat-stories" />
        <StatCard icon={Users} label="Clienti attivi" value={t.clients} tint="#10b981" testid="stat-clients" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" data-testid="chart-visitors">
          <h3 className="font-display text-[16px] font-bold text-[#0b2545] mb-4">Visitatori · ultimi 14 giorni</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ left: -18, right: 6, top: 4 }}>
              <defs><linearGradient id="gvis" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.35} /><stop offset="100%" stopColor={BLUE} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="visitors" name="Visitatori" stroke={BLUE} strokeWidth={2.5} fill="url(#gvis)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" data-testid="chart-inquiries">
          <h3 className="font-display text-[16px] font-bold text-[#0b2545] mb-4">Richieste · ultimi 14 giorni</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ left: -18, right: 6, top: 4 }}>
              <defs><linearGradient id="ginq" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="inquiries" name="Richieste" stroke="#f59e0b" strokeWidth={2.5} fill="url(#ginq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" data-testid="dashboard-recent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-[16px] font-bold text-[#0b2545]">Richieste recenti</h3>
          <button onClick={() => onGo('richieste')} className="font-sans text-[13px] font-semibold text-[#1e6fd9] hover:underline cursor-pointer">Vedi tutte</button>
        </div>
        {recent.length === 0 ? (
          <p className="font-sans text-[14px] text-slate-400 py-6 text-center">Nessuna richiesta ancora.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((q) => (
              <div key={q.id} className="flex items-center gap-3 py-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${q.status === 'nuova' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                <div className="min-w-0 flex-1"><div className="font-sans text-[14px] font-semibold text-[#0b2545] truncate">{q.name}{q.company ? ` · ${q.company}` : ''}</div><div className="font-sans text-[12.5px] text-slate-400 truncate">{q.email}</div></div>
                <span className="font-sans text-[12px] text-slate-400 shrink-0 hidden sm:block">{q.created_at ? new Date(q.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Media */
function MediaView({ showToast }: { showToast: (m: string) => void }) {
  const { map, refresh } = useAssetsContext();
  const [busy, setBusy] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState<string | null>(null);
  const groups = Array.from(new Set(MEDIA_SLOTS.map((s) => s.group)));

  const upload = async (key: string, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setBusy(key);
    try {
      const fd = new FormData();
      fd.append('key', key);
      fd.append('file', file);
      await API.post('/site-assets', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      refresh();
      showToast('Immagine aggiornata');
    } catch { showToast('Errore durante il caricamento'); } finally { setBusy(null); }
  };
  const bulkUpload = async (group: string, files: FileList | File[]) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!imgs.length) return;
    const slots = MEDIA_SLOTS.filter((s) => s.group === group);
    const n = Math.min(imgs.length, slots.length);
    setBulkBusy(group);
    try {
      for (let i = 0; i < n; i++) {
        const fd = new FormData();
        fd.append('key', slots[i].key);
        fd.append('file', imgs[i]);
        await API.post('/site-assets', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      refresh();
      showToast(`${n} immagini aggiornate in "${group}"`);
    } catch { showToast('Errore durante il caricamento in blocco'); } finally { setBulkBusy(null); }
  };
  const reset = async (key: string) => {
    setBusy(key);
    try { await API.post('/site-assets/reset', { key }); refresh(); showToast('Immagine ripristinata'); }
    catch { showToast('Errore'); } finally { setBusy(null); }
  };

  return (
    <div className="space-y-8" data-testid="media-view">
      <p className="font-sans text-[14px] text-slate-500 -mt-2">Sostituisci qualsiasi immagine del sito. Trascina un'immagine su una card, oppure usa <strong>Carica in blocco</strong> per aggiornare tutte le foto di una sezione in una volta (assegnate in ordine). Le modifiche sono immediate.</p>
      {groups.map((g) => (
        <div key={g}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="font-display text-[16px] font-bold text-[#0b2545]">{g}</h3>
            <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); bulkUpload(g, e.dataTransfer.files); }} data-testid={`media-bulk-${g.replace(/[^a-zA-Z0-9]/g, '-')}`} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-[#1e6fd9]/50 bg-[#e8f1fc]/50 text-[#155bb0] font-sans text-[12px] font-bold cursor-pointer hover:bg-[#e8f1fc] transition-colors ${bulkBusy === g ? 'opacity-60 pointer-events-none' : ''}`}>
              {bulkBusy === g ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              Carica in blocco
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) bulkUpload(g, e.target.files); e.target.value = ''; }} />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEDIA_SLOTS.filter((s) => s.group === g).map((slot) => {
              const src = resolveAsset(map, slot.key);
              const overridden = !!map[slot.key];
              const testid = slot.key.replace(/[^a-zA-Z0-9]/g, '-');
              return (
                <div key={slot.key} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(slot.key, f); }} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#1e6fd9]/40 transition-colors" data-testid={`media-slot-${testid}`}>
                  <div className="h-36 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100 relative">
                    <img src={src} alt={slot.label} className="max-h-full max-w-full object-contain" />
                    {busy === slot.key && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#1e6fd9]" /></div>}
                  </div>
                  <div className="p-3.5">
                    <div className="font-sans text-[13px] font-semibold text-[#0b2545] leading-snug">{slot.label}</div>
                    <div className="flex items-center gap-2 mt-3">
                      <label className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-sans text-[12.5px] font-bold cursor-pointer transition-colors ${busy === slot.key ? 'opacity-60 pointer-events-none' : ''}`} data-testid={`media-upload-${testid}`}>
                        <UploadCloud className="w-3.5 h-3.5" />
                        Sostituisci
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(slot.key, f); e.target.value = ''; }} />
                      </label>
                      {overridden && (
                        <button onClick={() => reset(slot.key)} title="Ripristina originale" data-testid={`media-reset-${testid}`} className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-[#0b2545] hover:bg-slate-50 cursor-pointer"><RotateCcw className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Storie */
const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1e6fd9] focus:ring-2 focus:ring-[#1e6fd9]/10 outline-none font-sans text-[14px] text-slate-800 transition-all';

function StorieView({ stories, reload, showToast }: { stories: Story[]; reload: () => void; showToast: (m: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ ...emptyStory });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const set = (k: keyof typeof emptyStory) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const fd = new FormData(); fd.append('file', file); const { data } = await API.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); setForm((f) => ({ ...f, cover_path: data.path })); setCoverPreview(fileUrl(data.url) || null); }
    catch { showToast('Errore durante il caricamento immagine'); } finally { setUploading(false); }
  };
  const resetForm = () => { setForm({ ...emptyStory }); setCoverPreview(null); setEditingId(null); if (fileRef.current) fileRef.current.value = ''; };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editingId) { await API.put(`/stories/${editingId}`, form); showToast('Storia aggiornata'); }
      else { await API.post('/stories', form); showToast('Storia pubblicata con successo'); }
      resetForm(); reload();
    } catch { showToast('Errore durante il salvataggio'); } finally { setSaving(false); }
  };
  const startEdit = (s: Story) => { setEditingId(s.id); setForm({ title: s.title, sector: s.sector || '', summary: s.summary, content: s.content, cover_path: s.cover_path ?? null }); setCoverPreview(s.cover_url ? (fileUrl(s.cover_url) || null) : null); window.scrollTo({ top: 0 }); };
  const remove = async (id: string) => { if (editingId === id) resetForm(); await API.delete(`/stories/${id}`); reload(); showToast('Storia eliminata'); };

  return (
    <div className="grid lg:grid-cols-12 gap-6" data-testid="storie-view">
      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[19px] font-bold text-[#0b2545] flex items-center gap-2"><Plus className="w-5 h-5 text-[#1e6fd9]" /> {editingId ? 'Modifica storia' : 'Nuova storia'}</h2>
            {editingId && <button type="button" onClick={resetForm} data-testid="story-cancel-edit" className="font-sans text-[12.5px] font-semibold text-slate-400 hover:text-red-600 cursor-pointer">Annulla</button>}
          </div>
          <form onSubmit={submit} className="space-y-4" data-testid="story-form">
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Titolo *</label><input required value={form.title} onChange={set('title')} className={inputCls} data-testid="story-title" placeholder="Es. Adeguamento sicurezza azienda metalmeccanica" /></div>
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Settore / Cliente</label><input value={form.sector} onChange={set('sector')} className={inputCls} data-testid="story-sector" placeholder="Es. Metalmeccanica · 120 dipendenti" /></div>
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Sommario *</label><textarea required value={form.summary} onChange={set('summary')} rows={2} className={inputCls} data-testid="story-summary" placeholder="Breve descrizione mostrata nell'anteprima" /></div>
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Contenuto *</label><textarea required value={form.content} onChange={set('content')} rows={6} className={inputCls} data-testid="story-content" placeholder="Il racconto completo del progetto…" /></div>
            <div>
              <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Immagine di copertina</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" data-testid="story-cover-input" />
              <button type="button" onClick={() => fileRef.current?.click()} data-testid="story-cover-btn" className="w-full border-2 border-dashed border-slate-200 hover:border-[#1e6fd9]/40 rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer">
                {uploading ? (<><Loader2 className="w-6 h-6 text-[#1e6fd9] animate-spin" /><span className="font-sans text-[13px] text-slate-500">Caricamento…</span></>) : coverPreview ? (<img src={coverPreview} alt="copertina" className="w-full h-36 object-cover rounded-xl" data-testid="story-cover-preview" />) : (<><UploadCloud className="w-6 h-6 text-slate-400" /><span className="font-sans text-[13px] text-slate-500">Carica un'immagine (JPG/PNG)</span></>)}
              </button>
              {coverPreview && !uploading && (<button type="button" data-testid="story-cover-remove" onClick={() => { setCoverPreview(null); setForm((f) => ({ ...f, cover_path: null })); if (fileRef.current) fileRef.current.value = ''; }} className="mt-2 inline-flex items-center gap-1 font-sans text-[12px] text-slate-400 hover:text-red-600 cursor-pointer"><X className="w-3.5 h-3.5" /> Rimuovi immagine</button>)}
            </div>
            <button type="submit" disabled={saving || uploading} data-testid="story-submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0b2545] hover:bg-[#07192e] disabled:opacity-60 text-white font-sans text-[14px] font-bold rounded-xl shadow-lg transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Salvataggio…</>) : editingId ? (<><CheckCircle2 className="w-4 h-4" /> Salva modifiche</>) : (<><Plus className="w-4 h-4" /> Pubblica storia</>)}</button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-7">
        <h2 className="font-display text-[19px] font-bold text-[#0b2545] mb-4">Storie pubblicate <span className="text-slate-400 font-sans text-[15px]">({stories.length})</span></h2>
        {stories.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl" data-testid="admin-stories-empty"><ImageIcon className="w-9 h-9 text-slate-300 mx-auto mb-3" /><p className="font-sans text-[14px] text-slate-500">Nessuna storia ancora. Crea la prima dal modulo a sinistra.</p></div>
        ) : (
          <div className="space-y-4" data-testid="admin-stories-list">
            {stories.map((s) => (
              <div key={s.id} data-testid={`admin-story-${s.id}`} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">{s.cover_url ? <img src={fileUrl(s.cover_url)} alt={s.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-[#0b2545]"><ImageIcon className="w-5 h-5 text-[#1e6fd9]/60" /></div>}</div>
                <div className="flex-1 min-w-0">{s.sector && <span className="font-sans text-[11px] font-bold text-[#155bb0] uppercase tracking-wide">{s.sector}</span>}<h3 className="font-display text-[16px] font-bold text-[#0b2545] truncate">{s.title}</h3><p className="font-sans text-[13px] text-slate-500 line-clamp-2">{s.summary}</p></div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(s)} data-testid={`admin-edit-${s.id}`} className="p-2.5 rounded-xl text-slate-400 hover:text-[#1e6fd9] hover:bg-[#e8f1fc] transition-colors cursor-pointer" aria-label="Modifica"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(s.id)} data-testid={`admin-delete-${s.id}`} className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" aria-label="Elimina"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Richieste */
function RichiesteView({ inquiries, reload, showToast }: { inquiries: Inquiry[]; reload: () => void; showToast: (m: string) => void }) {
  const toggle = async (q: Inquiry) => { await API.patch(`/inquiries/${q.id}`, { status: q.status === 'nuova' ? 'letta' : 'nuova' }); reload(); };
  const remove = async (id: string) => { await API.delete(`/inquiries/${id}`); reload(); showToast('Richiesta eliminata'); };
  return (
    <div data-testid="inquiries-panel">
      <h2 className="font-display text-[19px] font-bold text-[#0b2545] mb-4">Richieste di contatto <span className="text-slate-400 font-sans text-[15px]">({inquiries.length})</span></h2>
      {inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl" data-testid="inquiries-empty"><Inbox className="w-9 h-9 text-slate-300 mx-auto mb-3" /><p className="font-sans text-[14px] text-slate-500">Nessuna richiesta ancora. Le richieste dal modulo Contatti appariranno qui.</p></div>
      ) : (
        <div className="space-y-4" data-testid="inquiries-list">
          {inquiries.map((q) => (
            <div key={q.id} data-testid={`inquiry-${q.id}`} className={`bg-white rounded-2xl border p-5 ${q.status === 'nuova' ? 'border-amber-300 shadow-[0_8px_24px_rgba(11,37,69,0.06)]' : 'border-slate-200'}`}>
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3 min-w-0"><span className={`px-2.5 py-1 rounded-full font-sans text-[11px] font-bold uppercase tracking-wide ${q.status === 'nuova' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`} data-testid={`inquiry-status-${q.id}`}>{q.status}</span><span className="font-display text-[16px] font-bold text-[#0b2545] truncate">{q.name}{q.company ? ` · ${q.company}` : ''}</span></div>
                <span className="font-sans text-[12px] text-slate-400">{q.created_at ? new Date(q.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 font-sans text-[13px] text-slate-500"><a href={`mailto:${q.email}`} className="hover:text-[#0b2545] underline underline-offset-2">{q.email}</a>{q.phone && <span>{q.phone}</span>}{q.service && <span className="font-semibold text-slate-600">{q.service}</span>}</div>
              <p className="font-sans text-[14px] text-slate-700 leading-relaxed mt-3 whitespace-pre-wrap">{q.message}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => toggle(q)} data-testid={`inquiry-toggle-${q.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-sans text-[12.5px] font-bold text-slate-700 transition-colors cursor-pointer"><MailOpen className="w-4 h-4" /> {q.status === 'nuova' ? 'Segna come letta' : 'Segna come nuova'}</button>
                <button onClick={() => remove(q.id)} data-testid={`inquiry-delete-${q.id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 font-sans text-[12.5px] font-bold transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /> Elimina</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Clienti */
function ClientiView({ clients, reload, showToast }: { clients: Client[]; reload: () => void; showToast: (m: string) => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { showToast('Le password non coincidono'); return; }
    setSaving(true);
    try { await API.post('/admin/clients', { name: form.name, email: form.email, password: form.password }); setForm({ name: '', email: '', password: '', confirm: '' }); reload(); showToast('Account cliente creato'); }
    catch (err: unknown) { const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail; showToast(typeof d === 'string' ? d : 'Errore durante la creazione'); } finally { setSaving(false); }
  };
  const remove = async (id: string) => { await API.delete(`/admin/clients/${id}`); reload(); showToast('Cliente rimosso'); };
  return (
    <div className="grid lg:grid-cols-12 gap-6" data-testid="clients-panel">
      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-24">
          <h2 className="font-display text-[19px] font-bold text-[#0b2545] flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-[#1e6fd9]" /> Nuovo cliente</h2>
          <p className="font-sans text-[13px] text-slate-500 mb-5">Crea le credenziali di accesso all'Area Riservata.</p>
          <form onSubmit={create} className="space-y-4" data-testid="client-form">
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Nome / Azienda</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} data-testid="client-name" placeholder="Es. Rossi S.r.l." /></div>
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Email (ID accesso) *</label><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} data-testid="client-email" placeholder="cliente@azienda.it" /></div>
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Password *</label><input required type="password" minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className={inputCls} data-testid="client-password" placeholder="Minimo 8 caratteri" /></div>
            <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Conferma password *</label><input required type="password" minLength={8} value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} className={inputCls} data-testid="client-password-confirm" placeholder="Ripeti la password" /></div>
            <button type="submit" disabled={saving} data-testid="client-submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0b2545] hover:bg-[#07192e] disabled:opacity-60 text-white font-sans text-[14px] font-bold rounded-xl shadow-lg transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Creazione…</>) : (<><Plus className="w-4 h-4" /> Crea account cliente</>)}</button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-7">
        <h2 className="font-display text-[19px] font-bold text-[#0b2545] mb-4">Clienti attivi <span className="text-slate-400 font-sans text-[15px]">({clients.length})</span></h2>
        {clients.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl" data-testid="clients-empty"><Users className="w-9 h-9 text-slate-300 mx-auto mb-3" /><p className="font-sans text-[14px] text-slate-500">Nessun cliente ancora.</p></div>
        ) : (
          <div className="space-y-3" data-testid="clients-list">
            {clients.map((c) => (
              <div key={c.id} data-testid={`client-${c.id}`} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0b2545] text-amber-400 flex items-center justify-center font-display font-bold text-[15px] shrink-0">{(c.name || c.email).charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0"><div className="font-display text-[15px] font-bold text-[#0b2545] truncate">{c.name || 'Cliente'}</div><div className="font-sans text-[13px] text-slate-500 truncate">{c.email}</div></div>
                <button onClick={() => remove(c.id)} data-testid={`client-delete-${c.id}`} className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0" aria-label="Elimina cliente"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Impostazioni (email) */
function ImpostazioniView({ showToast }: { showToast: (m: string) => void }) {
  const [s, setS] = useState<EmailSettings & { app_password: string }>({ sender_email: '', sender_name: '', receiver_email: '', cc_email: '', enabled: false, has_app_password: false, app_password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const set = (k: string, v: string | boolean) => setS((x) => ({ ...x, [k]: v }));

  useEffect(() => { API.get('/admin/email-settings').then((r) => setS((x) => ({ ...x, ...r.data, app_password: '' }))).catch(() => {}).finally(() => setLoading(false)); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { sender_email: s.sender_email, sender_name: s.sender_name, receiver_email: s.receiver_email, cc_email: s.cc_email, enabled: s.enabled };
      if (s.app_password) payload.app_password = s.app_password;
      const { data } = await API.put('/admin/email-settings', payload);
      setS((x) => ({ ...x, ...data, app_password: '' }));
      showToast('Impostazioni email salvate');
    } catch { showToast('Errore durante il salvataggio'); } finally { setSaving(false); }
  };
  const test = async () => {
    setTesting(true);
    try { await API.post('/admin/email-settings/test'); showToast('Email di test inviata! Controlla la casella.'); }
    catch (err: unknown) { const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail; showToast(typeof d === 'string' ? d : 'Invio test non riuscito'); } finally { setTesting(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#0b2545]" /></div>;
  return (
    <div className="max-w-2xl" data-testid="email-settings-view">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-1"><span className="w-10 h-10 rounded-xl bg-[#e8f1fc] text-[#1e6fd9] flex items-center justify-center"><Mail className="w-5 h-5" /></span><h2 className="font-display text-[19px] font-bold text-[#0b2545]">Notifiche Email (Gmail SMTP)</h2></div>
        <p className="font-sans text-[13.5px] text-slate-500 mb-6 leading-relaxed">Ogni richiesta dal sito viene inviata all'indirizzo destinatario. Usa un account Gmail con <strong>verifica in due passaggi</strong> attiva e una <strong>Password per le app</strong> (Account Google → Sicurezza → Password per le app).</p>
        <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4" data-testid="email-settings-form">
          <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Email mittente (Gmail) *</label><input type="email" value={s.sender_email} onChange={(e) => set('sender_email', e.target.value)} className={inputCls} data-testid="email-sender" placeholder="tuonome@gmail.com" /></div>
          <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Password per le app Google {s.has_app_password && <span className="text-emerald-600 font-normal">· configurata ✓</span>}</label><input type="password" value={s.app_password} onChange={(e) => set('app_password', e.target.value)} className={inputCls} data-testid="email-app-password" placeholder={s.has_app_password ? '•••••••••••• (lascia vuoto per non modificare)' : 'xxxx xxxx xxxx xxxx'} /></div>
          <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Nome mittente (etichetta "Da")</label><input value={s.sender_name} onChange={(e) => set('sender_name', e.target.value)} className={inputCls} data-testid="email-sender-name" placeholder="E.M Safety" /></div>
          <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Email destinatario (riceve le richieste) *</label><input type="email" value={s.receiver_email} onChange={(e) => set('receiver_email', e.target.value)} className={inputCls} data-testid="email-receiver" placeholder="info@emsafetygroup.it" /></div>
          <div><label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Email in copia (CC) — opzionale</label><input type="email" value={s.cc_email} onChange={(e) => set('cc_email', e.target.value)} className={inputCls} data-testid="email-cc" placeholder="secondo@azienda.it" /></div>
          <label className="flex items-center gap-3 py-2 cursor-pointer" data-testid="email-enabled-label">
            <button type="button" onClick={() => set('enabled', !s.enabled)} data-testid="email-enabled-toggle" className={`relative w-12 h-7 rounded-full transition-colors ${s.enabled ? 'bg-[#1e6fd9]' : 'bg-slate-300'}`}><span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${s.enabled ? 'translate-x-5' : ''}`} /></button>
            <span className="font-sans text-[14px] font-semibold text-[#0b2545]">Invio email {s.enabled ? 'attivo' : 'disattivato'}</span>
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={saving} data-testid="email-save" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b2545] hover:bg-[#07192e] disabled:opacity-60 text-white font-sans text-[14px] font-bold rounded-xl shadow-lg transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Salva impostazioni</button>
            <button type="button" onClick={test} disabled={testing} data-testid="email-test" className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 disabled:opacity-60 text-[#0b2545] font-sans text-[14px] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer">{testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-[#1e6fd9]" />} Invia email di test</button>
          </div>
        </form>
      </div>
      <p className="font-sans text-[12px] text-slate-400 mt-4 px-1">La Password per le app è cifrata sul server e non viene mai mostrata di nuovo. {BACKEND ? '' : ''}</p>
    </div>
  );
}
