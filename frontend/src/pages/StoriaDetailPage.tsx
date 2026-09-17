import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Building2, ArrowRight } from 'lucide-react';
import API, { fileUrl } from '../lib/api';

interface Story {
  id: string;
  title: string;
  sector: string;
  summary: string;
  content: string;
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

export default function StoriaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null | false>(null);

  useEffect(() => {
    API.get(`/stories/${id}`).then((r) => setStory(r.data)).catch(() => setStory(false));
  }, [id]);

  if (story === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0b2545] rounded-full animate-spin" />
      </div>
    );
  }

  if (story === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center" data-testid="story-not-found">
        <h1 className="font-display text-[26px] font-bold text-[#0b2545]">Storia non trovata</h1>
        <Link to="/storie" className="inline-flex items-center gap-2 font-sans text-[14px] font-bold text-[#0b2545]"><ArrowLeft className="w-4 h-4 text-[#1e6fd9]" /> Torna alle storie</Link>
      </div>
    );
  }

  return (
    <article className="bg-white pt-[100px] pb-24" data-testid="story-detail">
      <div className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/storie')} data-testid="story-back" className="inline-flex items-center gap-2 font-sans text-[13.5px] font-bold text-slate-500 hover:text-[#0b2545] transition-colors mb-8 cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-[#1e6fd9]" /> Tutte le storie
        </button>

        {story.sector && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border bg-[#e8f1fc] text-[#0b2545] border-[#cfe3f8]">{story.sector}</span>}
        <h1 className="font-display text-[34px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1] mt-4">{story.title}</h1>
        <div className="flex items-center gap-2 font-sans text-[13px] text-slate-400 mt-4">
          <CalendarDays className="w-4 h-4" /> {formatDate(story.created_at)}
        </div>

        <div className="mt-8 rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
          {story.cover_url ? (
            <img src={fileUrl(story.cover_url)} alt={story.title} className="w-full max-h-[460px] object-cover" />
          ) : (
            <div className="w-full h-[280px] flex items-center justify-center bg-[#0b2545]"><Building2 className="w-12 h-12 text-[#1e6fd9]/60" /></div>
          )}
        </div>

        <p className="font-display text-[19px] text-slate-700 leading-relaxed mt-8 font-medium">{story.summary}</p>
        <div className="font-sans text-[16px] text-slate-700 leading-[1.9] mt-6 whitespace-pre-wrap">{story.content}</div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link to="/" state={{ scrollTo: 'contatti' }} className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14.5px] font-bold rounded-full shadow-lg transition-all border-b-2 border-[#1e6fd9]">
            Vuoi un risultato simile? Contattaci
            <ArrowRight className="w-4 h-4 text-[#1e6fd9] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
