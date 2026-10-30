import { Quote, Star } from 'lucide-react';
import { fileUrl } from '../lib/api';
import { Testimonial, initials } from '../lib/testimonials';

function Rating({ value, light = false }: { value: number | null; light?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} stelle su 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-4 h-4 ${n <= value ? 'fill-[#f5a800] text-[#f5a800]' : light ? 'text-white/25' : 'text-slate-200'}`} />
      ))}
    </div>
  );
}

function Avatar({ t, light = false }: { t: Testimonial; light?: boolean }) {
  return t.photo_url ? (
    <img src={fileUrl(t.photo_url)} alt={t.name} className={`w-14 h-14 rounded-full object-cover shrink-0 ${light ? 'ring-2 ring-[#1e6fd9]/50' : 'ring-1 ring-slate-200'}`} loading="lazy" />
  ) : (
    <span className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-display text-[18px] font-bold ${light ? 'bg-white/10 text-white' : 'bg-[#e8f1fc] text-[#155bb0]'}`} aria-hidden="true">{initials(t.name)}</span>
  );
}

/** Testimonianza grande, su fondo blu: per quella in evidenza. */
export function FeaturedTestimonial({ t }: { t: Testimonial }) {
  return (
    <figure className="relative bg-[#0b2545] rounded-[28px] p-7 sm:p-10 lg:p-14 text-white shadow-2xl overflow-hidden" data-testid="testimonial-featured">
      <Quote className="w-14 h-14 text-[#1e6fd9]/30 absolute top-6 right-8" aria-hidden="true" />
      <Rating value={t.rating} light />
      <blockquote className="font-display text-[19px] sm:text-[26px] font-bold leading-snug tracking-tight relative z-10 mt-4 whitespace-pre-line">“{t.text}”</blockquote>
      <figcaption className="mt-8 flex items-center gap-4">
        <Avatar t={t} light />
        <div>
          <div className="font-display text-[17px] font-bold">{t.name}</div>
          {(t.role || t.company) && <div className="font-sans text-[13px] text-[#9ec7f0]">{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
        </div>
      </figcaption>
    </figure>
  );
}

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="h-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-[0_10px_30px_rgba(11,37,69,0.05)] flex flex-col" data-testid="testimonial-card">
      <div className="flex items-center justify-between gap-3">
        <Rating value={t.rating} />
        <Quote className="w-8 h-8 text-[#1e6fd9]/20 ml-auto" aria-hidden="true" />
      </div>
      <blockquote className="font-sans text-[15px] text-slate-700 leading-relaxed mt-3 flex-1 whitespace-pre-line">“{t.text}”</blockquote>
      <figcaption className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3.5">
        <Avatar t={t} />
        <div className="min-w-0">
          <div className="font-display text-[16px] font-bold text-[#0b2545]">{t.name}</div>
          {(t.role || t.company) && <div className="font-sans text-[12.5px] text-slate-500">{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
        </div>
      </figcaption>
    </figure>
  );
}
