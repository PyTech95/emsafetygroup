const SPARKS = [
  { left: '6%', top: '18%', size: 6, delay: 0, dur: 4.2 },
  { left: '14%', top: '72%', size: 4, delay: 1.1, dur: 5.1 },
  { left: '27%', top: '32%', size: 5, delay: 2.3, dur: 4.6 },
  { left: '38%', top: '84%', size: 3, delay: 0.6, dur: 5.6 },
  { left: '52%', top: '12%', size: 5, delay: 1.8, dur: 4.4 },
  { left: '63%', top: '58%', size: 4, delay: 3.1, dur: 5.3 },
  { left: '74%', top: '26%', size: 6, delay: 0.9, dur: 4.8 },
  { left: '86%', top: '70%', size: 4, delay: 2.6, dur: 5.0 },
  { left: '93%', top: '20%', size: 3, delay: 1.5, dur: 4.3 },
  { left: '45%', top: '48%', size: 3, delay: 3.6, dur: 5.8 },
];

export default function Sparkles({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" data-testid="sparkles">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="sparkle absolute block"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}
        />
      ))}
    </div>
  );
}
