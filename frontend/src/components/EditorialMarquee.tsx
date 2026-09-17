const ITEMS = [
  'Sicurezza sul Lavoro',
  'D.Lgs 81/08',
  'Formazione Accreditata',
  'Sistemi di Gestione Integrati',
  'Treviso',
  'Milano',
  'Zero Non Conformità',
];

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center">
          <span
            className={`font-sans italic font-light text-[20px] sm:text-[26px] lg:text-[32px] tracking-wide whitespace-nowrap ${
              i % 2 === 0 ? 'text-[#1e6fd9]' : 'text-neutral-400'
            }`}
          >
            {item}
          </span>
          <span className="mx-8 sm:mx-12 w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-neutral-300 shrink-0" />
        </span>
      ))}
    </div>
  );
}

export default function EditorialMarquee() {
  return (
    <div
      className="relative overflow-hidden bg-white border-y border-neutral-200 py-7 sm:py-9 select-none"
      data-testid="editorial-marquee"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee-slow">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </div>
  );
}
