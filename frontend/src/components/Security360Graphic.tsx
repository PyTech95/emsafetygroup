import { motion } from 'motion/react';
import { ShieldCheck, HardHat, GraduationCap, FileCheck2, Siren, Search, Wrench } from 'lucide-react';

const NODES = [
  { icon: HardHat, label: 'DPI' },
  { icon: GraduationCap, label: 'Formazione' },
  { icon: FileCheck2, label: 'DVR' },
  { icon: Siren, label: 'Emergenze' },
  { icon: Search, label: 'Audit' },
  { icon: Wrench, label: 'Sistemi' },
];

const ORBIT_R = 43; // % of container

export default function Security360Graphic() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-[440px] aspect-square select-none"
      data-testid="security-360-graphic"
      aria-label="Sicurezza a 360 gradi"
    >
      {/* Radar sweep */}
      <motion.div
        className="absolute inset-[6%] rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(115,115,115,0.35) 0deg, rgba(115,115,115,0.06) 55deg, transparent 120deg, transparent 360deg)',
          maskImage: 'radial-gradient(circle, black 62%, transparent 63%)',
          WebkitMaskImage: 'radial-gradient(circle, black 62%, transparent 63%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
      />

      {/* Static concentric guide rings */}
      <div className="absolute inset-[6%] rounded-full border border-[#0b2545]/10" />
      <div className="absolute inset-[24%] rounded-full border border-[#0b2545]/10" />
      <div className="absolute inset-[41%] rounded-full border border-[#0b2545]/10" />

      {/* Outer dashed ring — rotating */}
      <motion.div
        className="absolute inset-[3%] rounded-full border-2 border-dashed border-[#0b2545]/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      />
      {/* Inner dashed ring — counter-rotating */}
      <motion.div
        className="absolute inset-[24%] rounded-full border-2 border-dashed border-[#1e6fd9]/40"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
      />

      {/* Ticks around outer ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-[3px] w-2 -translate-x-1/2 origin-[0_0]"
            style={{ transform: `rotate(${i * 15}deg) translateX(47%) translate(-50%,-50%)` }}
          >
            <span className={`block h-[2px] ${i % 6 === 0 ? 'w-3 bg-[#1e6fd9]' : 'w-1.5 bg-[#0b2545]/25'} rounded-full`} />
          </div>
        ))}
      </motion.div>

      {/* Orbiting security-domain nodes */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
      >
        {NODES.map((n, i) => {
          const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + ORBIT_R * Math.cos(angle);
          const top = 50 + ORBIT_R * Math.sin(angle);
          const Icon = n.icon;
          return (
            <div
              key={n.label}
              className="absolute"
              style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Counter-rotate so nodes stay upright */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
                  className="w-12 h-12 rounded-2xl bg-white shadow-[0_8px_24px_rgba(11,37,69,0.14)] border border-slate-100 flex items-center justify-center text-[#0b2545]"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="font-sans text-[10.5px] font-semibold text-[#0b2545] bg-white/80 backdrop-blur px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  {n.label}
                </span>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Center core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-[38%] min-w-[120px] aspect-square rounded-full"
          style={{ width: '38%' }}
        >
          {/* pulse halo */}
          <motion.span
            className="absolute inset-0 rounded-full bg-[#1e6fd9]/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 rounded-full bg-[#0b2545] shadow-[0_18px_50px_rgba(11,37,69,0.4)] border border-[#1e6fd9]/40 flex flex-col items-center justify-center gap-1">
            <ShieldCheck className="w-8 h-8 text-[#1e6fd9]" />
            <span className="font-display text-white font-extrabold text-[20px] leading-none tracking-tight">360°</span>
            <span className="font-sans text-[#9ec7f0]/90 text-[9px] font-semibold tracking-[0.18em] uppercase">Security</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
