import { Link } from 'react-router-dom';
import { SearchX, ArrowRight } from 'lucide-react';
import { NoIndex } from '../seo/Seo';

const LINKS = [
  { to: '/servizi', label: 'Servizi per la sicurezza sul lavoro' },
  { to: '/corsi', label: 'Corsi in partenza' },
  { to: '/verifica-attestato', label: 'Verifica attestato' },
  { to: '/contatti', label: 'Contatti e preventivo' },
];

export default function NotFoundPage() {
  return (
    <section className="min-h-[75vh] bg-[#f0f9ff] flex items-center pt-[110px] sm:pt-[140px] pb-20" data-testid="not-found">
      <NoIndex title="Pagina non trovata | E.M Safety" />
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 text-center">
        <span className="w-14 h-14 rounded-2xl bg-white border border-[#cfe3f8] text-[#1e6fd9] flex items-center justify-center mx-auto"><SearchX className="w-7 h-7" /></span>
        <p className="font-sans text-[12px] font-bold tracking-[0.18em] uppercase text-[#155bb0] mt-6">Errore 404</p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight mt-2">Pagina non trovata</h1>
        <p className="font-sans text-[16px] text-slate-600 mt-3">La pagina che cerchi non esiste o è stata spostata. Ecco dove puoi andare:</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-8 text-left">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-white border border-slate-200 hover:border-[#1e6fd9]/50 font-sans text-[14.5px] font-bold text-[#0b2545] transition-colors">
              {l.label} <ArrowRight className="w-4 h-4 text-[#1e6fd9] shrink-0" />
            </Link>
          ))}
        </div>
        <Link to="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-[#0b2545] text-white font-sans text-[14px] font-bold">Torna alla home</Link>
      </div>
    </section>
  );
}
