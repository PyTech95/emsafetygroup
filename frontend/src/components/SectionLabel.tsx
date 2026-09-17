interface SectionLabelProps {
  children: React.ReactNode;
  light?: boolean;
}

export default function SectionLabel({ children, light = false }: SectionLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11.5px] font-bold uppercase tracking-[0.18em] border ${
        light
          ? 'bg-white/10 text-amber-300 border-amber-400/30'
          : 'bg-[#e8f1fc] text-[#155bb0] border-[#cfe3f8]'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e6fd9]" />
      {children}
    </div>
  );
}
