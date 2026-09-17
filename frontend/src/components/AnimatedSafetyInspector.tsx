import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  HardHat,
  Search,
  Sliders,
  AlertCircle,
  Eye,
  Radio,
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import EmSafetyLogo from './EmSafetyLogo';

interface InspectionPoint {
  id: string;
  name: string;
  code: string;
  category: string;
  x: number; // Percentage
  y: number; // Percentage
  status: 'CONFORME' | 'COLLAUDATO' | 'CERTIFICATO';
  specs: { label: string; value: string }[];
  description: string;
  norm: string;
}

const POINTS: InspectionPoint[] = [
  {
    id: 'helmet',
    name: 'Elmetto con Visiera Policarbonato & Cuffie',
    code: 'DPI-TESTA-01',
    category: 'Protezione Cranio & Occhi',
    x: 50,
    y: 18,
    status: 'CONFORME',
    specs: [
      { label: 'Assorbimento Urto', value: '5.0 kN Max' },
      { label: 'Resistenza Dielettrica', value: '440 V A.C.' },
      { label: 'Isolamento Acustico', value: 'SNR 32 dB' },
    ],
    description: 'Calotta in HDPE ad alta densità con bardatura tessile a 6 punti di ancoraggio e visiera integrata antiappannamento per cantieri e industria.',
    norm: 'UNI EN 397:2013 // EN 166',
  },
  {
    id: 'detector',
    name: 'Rilevatore Multigas Portatile ATEX',
    code: 'SENS-GAS-04',
    category: 'Monitoraggio Atmosfere Rischio',
    x: 37,
    y: 38,
    status: 'CERTIFICATO',
    specs: [
      { label: 'Canali Sensori', value: '4 Gas (O2, CO, H2S, LEL)' },
      { label: 'Classificazione', value: 'Zona 0 / 1 / 2 ATEX' },
      { label: 'Allarme Sonoro/Luce', value: '95 dB @ 30cm' },
    ],
    description: 'Campionamento continuo per ingresso in spazi confinati ex D.P.R. 177/11 con datalogging wireless e allarme uomo a terra immediato.',
    norm: 'Direttiva ATEX 2014/34/UE',
  },
  {
    id: 'harness',
    name: 'Imbracatura Anticaduta Integrale 3 Punti',
    code: 'DPI-QUOTA-02',
    category: 'Lavori in Quota Art. 115',
    x: 52,
    y: 45,
    status: 'COLLAUDATO',
    specs: [
      { label: 'Punti Ancoraggio', value: 'Sternale + Dorsale' },
      { label: 'Carico di Rottura', value: '> 15 kN' },
      { label: 'Dissipatore Energia', value: 'Tessile a Strappo' },
    ],
    description: 'Nastri in poliestere ad alta tenacità con fibbie a sgancio rapido, cosciali imbottiti ergonomici e certificazione collaudo periodico annuale.',
    norm: 'UNI EN 361:2003 // EN 358',
  },
  {
    id: 'gloves',
    name: 'Guanti Protettivi Meccanico-Chimici',
    code: 'DPI-MANI-03',
    category: 'Protezione Arti Superiori',
    x: 24,
    y: 56,
    status: 'CONFORME',
    specs: [
      { label: 'Taglio TDM', value: 'Livello F (30 N)' },
      { label: 'Abrasione Cicli', value: 'Livello 4 (> 8000)' },
      { label: 'Grip Antiscivolo', value: 'Micro-schiuma Nitrile' },
    ],
    description: 'Fodera in HPPE con filamenti di basalto per massima destrezza e protezione contro sbavature metalliche, oli lubrificanti e contatto termico.',
    norm: 'UNI EN 388:2019 [4X44F]',
  },
  {
    id: 'shoes',
    name: 'Calzature Antinfortunistiche S3 SRC',
    code: 'DPI-PIEDI-05',
    category: 'Protezione Arti Inferiori',
    x: 51,
    y: 84,
    status: 'COLLAUDATO',
    specs: [
      { label: 'Puntale Sicurezza', value: 'Fibra di Carbonio 200J' },
      { label: 'Lamina Antiperforazione', value: 'Zero mm Kevlar PS' },
      { label: 'Suola Antiscivolo', value: 'SRC PU/Gomma HRO' },
    ],
    description: 'Tomaia idrorepellente traspirante, dissipazione elettrostatica ESD e battistrada autopulente con canali di drenaggio liquidi industriali.',
    norm: 'UNI EN ISO 20345:2022 S3',
  },
];

export default function AnimatedSafetyInspector() {
  const [selectedPoint, setSelectedPoint] = useState<InspectionPoint>(POINTS[0]);
  const [scanY, setScanY] = useState(10);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [isScanning, setIsScanning] = useState(true);

  // Animate laser scanner sweep up and down
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanY((prev) => {
        if (prev >= 90) {
          setDirection('up');
          return 89;
        }
        if (prev <= 10) {
          setDirection('down');
          return 11;
        }
        return direction === 'down' ? prev + 1.2 : prev - 1.2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [direction, isScanning]);

  const handlePointSelect = (p: InspectionPoint) => {
    soundFX.playLaser();
    setSelectedPoint(p);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9] animate-ping" />
            <span className="font-sans text-[11px] font-bold text-[#0b2545] uppercase tracking-[0.16em]">
              SCANNER DIAGNOSTICO VISIVO • SICUREZZA 4.0
            </span>
          </div>
          <h3 className="font-serif text-[22px] sm:text-[28px] font-bold text-[#0b2545] tracking-tight">
            Ispezione Interattiva DPI &amp; Presidi di Campo
          </h3>
          <p className="font-sans text-[13.5px] sm:text-[14px] text-slate-600 mt-1 max-w-xl">
            Verifica in tempo reale la corretta conformità tecnica e la marcatura CE dei presidi secondo il D.Lgs 81/08. Seleziona i punti di controllo sulla figura.
          </p>
        </div>

        {/* Scan controller pill */}
        <div className="flex items-center gap-3 bg-[#e8f1fc]/80 border border-[#cfe3f8] px-4 py-2 rounded-2xl self-start sm:self-center shadow-xs">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="flex items-center gap-2 font-mono text-[11.5px] font-bold text-[#0b2545] hover:text-blue-700 cursor-pointer"
          >
            <Radio className={`w-4 h-4 ${isScanning ? 'text-[#1e6fd9] animate-pulse' : 'text-slate-400'}`} />
            <span>SCANNER {isScanning ? 'ATTIVO' : 'IN PAUSA'}</span>
          </button>
          <span className="w-[1px] h-4 bg-slate-300" />
          <span className="font-mono text-[11px] text-[#0b2545] font-bold">POS: {Math.round(scanY)}%</span>
        </div>
      </div>

      {/* Main Grid: Animated Visual on Left, Deep Inspection Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        {/* Left Side: Animated SVG Visual Interactive Stage (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#e8f1fc]/40 via-white to-slate-50/80 rounded-2xl border border-[#cfe3f8] p-6 min-h-[460px] overflow-hidden">
          {/* Subtle blueprint grid in navy */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(11,37,69,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Animated Sweeping Laser Line (Gold and Navy) */}
          <div
            className="absolute left-0 right-0 h-[2px] pointer-events-none transition-all duration-75 z-20"
            style={{
              top: `${scanY}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.3) 15%, rgba(251,191,36,0.95) 50%, rgba(251,191,36,0.3) 85%, transparent 100%)',
              boxShadow: '0 0 16px rgba(251,191,36,0.6), 0 0 4px rgba(11,37,69,0.4)',
            }}
          >
            {/* Laser scanning beam cone */}
            <div className="w-full h-8 -mt-4 bg-gradient-to-b from-[#1e6fd9]/10 via-[#1e6fd9]/5 to-transparent pointer-events-none" />
          </div>

          {/* Stylized Animated Technical Worker Silhouette Graphic in Pure Navy & Gold SVG */}
          <div className="relative w-[280px] h-[400px] flex items-center justify-center">
            <svg
              viewBox="0 0 280 400"
              className="w-full h-full drop-shadow-sm select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer safety envelope radius */}
              <ellipse cx="140" cy="200" rx="125" ry="185" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              <ellipse cx="140" cy="200" rx="105" ry="155" stroke="#e2e8f0" strokeWidth="1" />

              {/* Pedestal / Ground Base */}
              <ellipse cx="140" cy="370" rx="80" ry="14" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
              <ellipse cx="140" cy="370" rx="45" ry="8" fill="#e2e8f0" />

              {/* Legs / Safety Trousers */}
              <path
                d="M 112 250 L 105 345 L 128 345 L 135 250 Z"
                fill="#0b2545"
                opacity="0.85"
                stroke="#0b2545"
                strokeWidth="2"
              />
              <path
                d="M 145 250 L 152 345 L 175 345 L 168 250 Z"
                fill="#0b2545"
                opacity="0.85"
                stroke="#0b2545"
                strokeWidth="2"
              />
              {/* High-visibility reflective bands on legs (Yellow) */}
              <rect x="106" y="300" width="22" height="6" fill="#fbbf24" rx="2" />
              <rect x="152" y="300" width="22" height="6" fill="#fbbf24" rx="2" />

              {/* Safety Boots S3 */}
              <path
                d="M 98 345 Q 105 340 120 345 L 132 355 Q 130 365 110 365 L 98 360 Z"
                fill="#0b2545"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
              <path
                d="M 182 345 Q 175 340 160 345 L 148 355 Q 150 365 170 365 L 182 360 Z"
                fill="#0b2545"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />

              {/* Torso with Safety High-Vis Vest */}
              <path
                d="M 100 135 L 180 135 L 175 255 L 105 255 Z"
                fill="#0b2545"
                stroke="#0b2545"
                strokeWidth="2"
              />
              {/* High-vis yellow vest overlay */}
              <path
                d="M 108 135 L 172 135 L 168 235 L 112 235 Z"
                fill="#fbbf24"
                opacity="0.95"
              />
              {/* Reflective silver cross bands */}
              <line x1="120" y1="135" x2="120" y2="235" stroke="#ffffff" strokeWidth="4" />
              <line x1="160" y1="135" x2="160" y2="235" stroke="#ffffff" strokeWidth="4" />
              <line x1="110" y1="190" x2="170" y2="190" stroke="#ffffff" strokeWidth="5" />

              {/* Arms */}
              <path
                d="M 100 138 L 70 200 L 85 220 L 108 165 Z"
                fill="#0b2545"
                opacity="0.9"
                stroke="#0b2545"
                strokeWidth="1.5"
              />
              <path
                d="M 180 138 L 210 200 L 195 220 L 172 165 Z"
                fill="#0b2545"
                opacity="0.9"
                stroke="#0b2545"
                strokeWidth="1.5"
              />

              {/* Head & Safety Helmet */}
              <circle cx="140" cy="100" r="22" fill="#e2e8f0" stroke="#0b2545" strokeWidth="1.5" />
              {/* Helmet shell (Yellow/Gold) */}
              <path
                d="M 112 96 Q 140 60 168 96 L 174 100 Q 140 92 106 100 Z"
                fill="#fbbf24"
                stroke="#0b2545"
                strokeWidth="2"
              />
              <rect x="135" y="70" width="10" height="4" fill="#0b2545" rx="2" />
              {/* Visor shield */}
              <path
                d="M 124 96 Q 140 92 156 96 L 154 110 Q 140 114 126 110 Z"
                fill="#93c5fd"
                opacity="0.6"
                stroke="#0b2545"
                strokeWidth="1"
              />

              {/* Dynamic Connecting Telemetry Lines from Center to Active Point */}
              <line
                x1="140"
                y1="200"
                x2={(selectedPoint.x * 280) / 100}
                y2={(selectedPoint.y * 400) / 100}
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            </svg>

            {/* Interactive Pins / Hotspots with Ripple Effect */}
            {POINTS.map((pt) => {
              const isCurrent = pt.id === selectedPoint.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => handlePointSelect(pt)}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer focus:outline-none"
                  aria-label={pt.name}
                >
                  {/* Outer Ripple Wave */}
                  <span
                    className={`absolute inset-0 rounded-full transition-all ${
                      isCurrent
                        ? 'w-8 h-8 -left-2 -top-2 bg-[#1e6fd9]/40 animate-ping'
                        : 'w-6 h-6 -left-1 -top-1 bg-blue-900/20 group-hover:scale-125'
                    }`}
                  />

                  {/* Core Node Button */}
                  <div
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                      isCurrent
                        ? 'bg-[#0b2545] text-[#9ec7f0] ring-3 ring-[#1e6fd9] scale-125 shadow-lg'
                        : 'bg-white text-[#0b2545] border-2 border-[#0b2545] shadow-sm hover:scale-110'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1e6fd9]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Help Hint */}
          <span className="font-sans text-[12px] text-slate-500 mt-2 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#0b2545]" />
            Tocca un punto dorato per ispezionare le specifiche e la norma di riferimento
          </span>
        </div>

        {/* Right Side: Detailed Inspection Specification Card (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Points Navigation Selector */}
          <div className="flex flex-wrap gap-2">
            {POINTS.map((pt) => {
              const isCurrent = pt.id === selectedPoint.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => handlePointSelect(pt)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0b2545] text-[#9ec7f0] shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pt.code}
                </button>
              );
            })}
          </div>

          {/* Inspection Deep Dive Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPoint.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              {/* Card Title & Verification Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#0b2545] uppercase tracking-wider block">
                    {selectedPoint.category} • {selectedPoint.code}
                  </span>
                  <h4 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0b2545] leading-snug mt-0.5">
                    {selectedPoint.name}
                  </h4>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#cfe3f8] text-[#0b2545] font-sans text-[11px] font-bold flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1e6fd9]" />
                  {selectedPoint.status}
                </span>
              </div>

              {/* Standard Norm Reference */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#1e6fd9] flex-shrink-0" />
                <span className="font-mono text-[12px] font-bold text-[#0b2545]">
                  Norma: {selectedPoint.norm}
                </span>
              </div>

              <p className="font-sans text-[14px] text-slate-600 leading-relaxed">
                {selectedPoint.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="pt-2 border-t border-slate-200">
                <span className="font-sans text-[11.5px] font-bold text-[#0b2545] uppercase tracking-wider block mb-2">
                  Parametri Tecnici Collaudati E.M Safety:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedPoint.specs.map((sp, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs"
                    >
                      <span className="font-sans text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">
                        {sp.label}
                      </span>
                      <span className="font-mono text-[12.5px] font-bold text-[#0b2545] block">
                        {sp.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Guarantee Note */}
              <div className="bg-[#e8f1fc]/70 border border-[#cfe3f8] p-3 rounded-xl flex items-center gap-2.5 text-[12.5px] text-[#0b2545]">
                <CheckCircle2 className="w-4 h-4 text-[#1e6fd9] flex-shrink-0" />
                <span>
                  Dotazione conforme al D.Lgs 81/08 con fascicolo tecnico e registro di consegna firmato.
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
