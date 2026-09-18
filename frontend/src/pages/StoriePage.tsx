import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Building2, BookOpen } from 'lucide-react';
import PageHero from '../components/PageHero';
import API, { fileUrl } from '../lib/api';
import { useText } from '../lib/content';

interface Story {
  id: string;
  title: string;
  sector: string;
  summary: string;
  cover_url?: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function StoriePage() {
  const [stories, setStories] = useState<Story[] | null>(null);
  const t = useText();

  useEffect(() => {
    API.get('/stories').then((r) => setStories(r.data)).catch(() => setStories([]));
  }, []);

  return (
    <>
      <PageHero
        label={t('page.storie.label')}
        title={t('page.storie.title')}
        highlight={t('page.storie.highlight')}
        subtitle={t('page.storie.subtitle')}
      />
      <section className="bg-white py-20 lg:py-24 min-h-[50vh]" data-testid="storie-page">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {stories === null ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0b2545] rounded-full animate-spin" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl" data-testid="storie-empty">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="font-display text-[20px] font-bold text-[#0b2545]">Nessuna storia pubblicata al momento</p>
            <p className="font-sans text-[14px] text-slate-500 mt-2">Torna presto: stiamo raccogliendo i nostri casi di successo.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}>
                <Link to={`/storie/${s.id}`} data-testid={`story-card-${s.id}`}
                  className="group flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-[#0b2545]/30 hover:shadow-[0_20px_50px_rgba(11,37,69,0.1)] transition-all duration-300">
                  <div className="h-52 bg-slate-100 overflow-hidden">
                    {s.cover_url ? (
                      <img src={fileUrl(s.cover_url)} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0b2545]"><Building2 className="w-10 h-10 text-[#1e6fd9]/60" /></div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {s.sector && <span className="inline-flex items-center w-fit px-2.5 py-1 rounded-full text-[11px] font-bold border bg-[#e8f1fc] text-[#0b2545] border-[#cfe3f8] mb-3">{s.sector}</span>}
                    <h2 className="font-display text-[19px] font-bold text-[#0b2545] leading-snug">{s.title}</h2>
                    <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed mt-2 flex-1">{s.summary}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-sans text-[12px] text-slate-400"><CalendarDays className="w-3.5 h-3.5" />{formatDate(s.created_at)}</span>
                      <span className="inline-flex items-center gap-1.5 font-sans text-[13px] font-bold text-[#0b2545] group-hover:gap-2.5 transition-all">Leggi<ArrowRight className="w-4 h-4 text-[#1e6fd9]" /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </section>
    </>
  );
}
