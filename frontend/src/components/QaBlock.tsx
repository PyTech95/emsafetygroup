import type { QA } from '../seo/config';

/** Domande e risposte sempre visibili (formato "answer-first" per Google e motori di risposta AI). */
export default function QaBlock({ id, title, items, className = '' }: { id: string; title: string; items: QA[]; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className} data-testid={`qa-${id}`}>
      <h2 id={`${id}-title`} className="font-display text-[24px] sm:text-[30px] font-extrabold text-[#0b2545] tracking-tight">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {items.map((f) => (
          <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="font-display text-[17px] font-bold text-[#0b2545] leading-snug">{f.q}</h3>
            <p className="font-sans text-[14.5px] text-slate-600 leading-relaxed mt-2">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
