import { useMemo, useState } from 'react';
import { Loader2, CheckCircle2, RotateCcw, Search, Type } from 'lucide-react';
import API from '../../lib/api';
import { useContentContext } from '../../lib/content';
import { TEXT_SLOTS, TEXT_GROUPS } from '../../data/textRegistry';

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1e6fd9] focus:ring-2 focus:ring-[#1e6fd9]/10 outline-none font-sans text-[14px] text-slate-800 transition-all';

export default function TextsView({ showToast }: { showToast: (m: string) => void }) {
  const { map, refresh } = useContentContext();
  const [group, setGroup] = useState<string>(TEXT_GROUPS[0]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const slots = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return TEXT_SLOTS.filter((s) => s.label.toLowerCase().includes(q) || s.default.toLowerCase().includes(q) || (map[s.key] || '').toLowerCase().includes(q));
    return TEXT_SLOTS.filter((s) => s.group === group);
  }, [group, query, map]);

  const valueOf = (key: string, def: string) => draft[key] ?? map[key] ?? def;
  const dirtyKeys = Object.keys(draft).filter((k) => draft[k] !== (map[k] ?? TEXT_SLOTS.find((s) => s.key === k)?.default));

  const save = async () => {
    if (!dirtyKeys.length) return;
    setSaving(true);
    try {
      const items: Record<string, string> = {};
      dirtyKeys.forEach((k) => { items[k] = draft[k]; });
      await API.put('/site-content', { items });
      refresh();
      setDraft({});
      showToast(`${dirtyKeys.length} testi salvati`);
    } catch { showToast('Errore durante il salvataggio'); } finally { setSaving(false); }
  };

  const reset = async (key: string) => {
    setBusyKey(key);
    try {
      await API.post('/site-content/reset', { key });
      setDraft((d) => { const n = { ...d }; delete n[key]; return n; });
      refresh();
      showToast('Testo ripristinato');
    } catch { showToast('Errore'); } finally { setBusyKey(null); }
  };

  return (
    <div className="space-y-5" data-testid="texts-view">
      <p className="font-sans text-[14px] text-slate-500 -mt-2">Modifica qualsiasi testo del sito. Scegli una sezione, cambia i testi e premi <strong>Salva modifiche</strong>. Le modifiche sono immediate su tutto il sito.</p>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca un testo…" className={`${inputCls} pl-10`} data-testid="texts-search" />
        </div>
        <button onClick={save} disabled={saving || !dirtyKeys.length} data-testid="texts-save"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0b2545] hover:bg-[#07192e] disabled:opacity-50 text-white font-sans text-[14px] font-bold rounded-xl shadow-lg transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Salva modifiche {dirtyKeys.length ? `(${dirtyKeys.length})` : ''}
        </button>
      </div>

      {!query && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" data-testid="texts-groups">
          {TEXT_GROUPS.map((g) => (
            <button key={g} onClick={() => setGroup(g)} data-testid={`texts-group-${g.replace(/[^a-zA-Z0-9]/g, '-')}`}
              className={`shrink-0 px-3.5 py-2 rounded-full font-sans text-[12.5px] font-bold border transition-colors cursor-pointer ${group === g ? 'bg-[#1e6fd9] text-white border-[#1e6fd9]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1e6fd9]/50'}`}>
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {slots.length === 0 && <p className="p-8 text-center font-sans text-[14px] text-slate-400">Nessun testo trovato.</p>}
        {slots.map((s) => {
          const overridden = map[s.key] !== undefined;
          const testid = s.key.replace(/[^a-zA-Z0-9]/g, '-');
          return (
            <div key={s.key} className="p-4 sm:p-5 grid sm:grid-cols-[220px_1fr_auto] gap-3 sm:gap-5 items-start" data-testid={`text-slot-${testid}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-sans text-[13px] font-bold text-[#0b2545]"><Type className="w-3.5 h-3.5 text-[#1e6fd9] shrink-0" /><span className="truncate">{s.label}</span></div>
                {query && <div className="font-sans text-[11px] text-slate-400 mt-1">{s.group}</div>}
                {overridden && <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#e8f1fc] text-[#155bb0] font-sans text-[10.5px] font-bold uppercase tracking-wide">modificato</span>}
              </div>
              {s.multiline ? (
                <textarea rows={3} value={valueOf(s.key, s.default)} onChange={(e) => setDraft((d) => ({ ...d, [s.key]: e.target.value }))} className={inputCls} data-testid={`text-input-${testid}`} />
              ) : (
                <input value={valueOf(s.key, s.default)} onChange={(e) => setDraft((d) => ({ ...d, [s.key]: e.target.value }))} className={inputCls} data-testid={`text-input-${testid}`} />
              )}
              <button onClick={() => reset(s.key)} disabled={!overridden || busyKey === s.key} title="Ripristina testo originale" data-testid={`text-reset-${testid}`}
                className="p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#0b2545] hover:bg-slate-50 disabled:opacity-30 cursor-pointer disabled:cursor-default">
                {busyKey === s.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
