import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Cpu,
  Flame,
  Radio,
  Sparkles,
  ArrowUpRight,
  Fingerprint,
  CheckCircle2,
} from 'lucide-react';
import EmSafetyLogo from './EmSafetyLogo';
import { soundFX } from '../utils/audio';

interface DiagnosticLayer {
  id: string;
  code: string;
  name: string;
  category: string;
  status: 'OTTIMALE' | 'CONFORME' | 'PROTETTO';
  score: number;
  icon: typeof ShieldCheck;
  telemetry: { label: string; val: string }[];
  details: string;
  protocols: string[];
}

const LAYERS: DiagnosticLayer[] = [
  {
    id: 'sgi',
    code: 'ISO-45001 // SGI',
    name: 'Architettura SGI & Sistemi Integrati',
    category: 'Governance Aziendale',
    status: 'OTTIMALE',
    score: 99.4,
    icon: ShieldCheck,
    telemetry: [
      { label: 'Audit Readiness', val: '100%' },
      { label: 'Ciclo PDCA', val: 'Attivo' },
      { label: 'Sgravio INAIL OT23', val: '-28%' },
    ],
    details:
      'Integrazione digitale dei processi di sicurezza sul lavoro, tutela ambientale ISO 14001 e qualità ISO 9001 per aziende ad alta complessità.',
    protocols: ['Certificazione Accredia', 'Modello 231/01 Esimente', 'KPI Mensili'],
  },
  {
    id: 'accordo2026',
    code: 'DLGS-81 // 2026-REV',
    name: 'Nuovo Accordo Stato-Regioni 2026',
    category: 'Conformità Normativa',
    status: 'CONFORME',
    score: 98.7,
    icon: Cpu,
    telemetry: [
      { label: 'Preposti 2 Anni', val: 'Conforme' },
      { label: 'Registro FAD', val: 'Sincronizzato' },
      { label: 'Scudo Penale', val: 'Attivo' },
    ],
    details:
      'Adeguamento preventivo alle nuove direttive 2026: obbligo formativo datore di lavoro, revisione biennale preposti e tracciabilità certificata.',
    protocols: ['Verifica QR Code', 'Alert Scadenze -90gg', 'Validazione OPN'],
  },
  {
    id: 'hazards',
    code: 'ATEX // RILIEVI',
    name: 'Rilievi Strumentali & Agenti Fisici',
    category: 'Ingegneria di Campo',
    status: 'PROTETTO',
    score: 97.9,
    icon: Zap,
    telemetry: [
      { label: 'Fonometria Cl.1', val: '0 Rilievi' },
      { label: 'MoVaRisCh Chimico', val: 'Moderato' },
      { label: 'DPI 3° Categoria', val: 'Collaudati' },
    ],
    details:
      'Mappatura strumentale sul campo di rumore, vibrazioni mano-braccio, campi elettromagnetici CEM, rischio chimico e atmosfere esplosive ATEX.',
    protocols: ['Campioni Spettrometrici', 'Posizionamento Barriere', 'Filtrazione VOC'],
  },
  {
    id: 'emergency',
    code: 'FIRE-DM0209 // BLSD',
    name: 'Piani Emergenza & Primo Soccorso',
    category: 'Rapid Response',
    status: 'OTTIMALE',
    score: 100,
    icon: Flame,
    telemetry: [
      { label: 'Evacuazione Media', val: '2m 14s' },
      { label: 'DAE / BLSD', val: 'Operativi' },
      { label: 'Antincendio Liv.3', val: 'Addestrato' },
    ],
    details:
      'Piani di evacuazione digitali, simulazioni periodiche a sorpresa e squadre antincendio abilitate con prova pratica a fuoco vivo.',
    protocols: ['Prove Idrauliche Idranti', 'Certificato Medico BLSD', 'Planimetrie D.M. 2021'],
  },
];

export default function HolographicSafetyCore() {
  const [selectedLayer, setSelectedLayer] = useState<DiagnosticLayer>(LAYERS[0]);
  const [scanRotation, setScanRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanRotation((prev) => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (layer: DiagnosticLayer) => {
    soundFX.playLaser();
    setSelectedLayer(layer);
  };

  const Icon = selectedLayer.icon;

  return (
    <div className="w-full relative rounded-3xl bg-gradient-to-b from-[#0b2545] via-[#091e38] to-[#071629] border border-blue-900/60 shadow-[0_12px_45px_rgba(11,37,69,0.25)] p-6 sm:p-8 lg:p-10 overflow-hidden">
      {/* Background Subtle HUD Grid in Pure Blue & Gold */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(251,191,36,0.15)_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

      {/* Cybernetic Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9] animate-ping" />
            <span className="font-mono text-[11px] font-bold text-[#1e6fd9] tracking-widest uppercase">
              // MOTORE DIAGNOSTICO DIGITALE HSE
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#1e6fd9]/20 text-[#9ec7f0] font-mono text-[10px] font-bold border border-[#1e6fd9]/30">
              TELEMETRIA LIVE
            </span>
          </div>
          <h3 className="font-serif text-[24px] sm:text-[30px] font-bold text-white tracking-tight">
            Scanner Diagnostico E.M Safety Core
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-[#081a30] px-4 py-2 rounded-xl border border-blue-800/80 shadow-inner">
          <Activity className="w-4 h-4 text-[#1e6fd9] animate-pulse" />
          <span className="font-mono text-[12px] text-slate-300">
            INDICE DI PROTEZIONE: <strong className="text-[#1e6fd9] font-black">{selectedLayer.score}%</strong>
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 relative z-10">
        {/* Left: Hologram Display Stage (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[420px]">
          {/* Concentric Rotating HUD Rings in Navy & Gold */}
          <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-blue-700/40 pointer-events-none" />
          <div
            className="absolute w-60 h-60 sm:w-76 sm:h-76 rounded-full border-2 border-dashed border-[#1e6fd9]/30 pointer-events-none"
            style={{ transform: `rotate(${scanRotation}deg)` }}
          />
          <div
            className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-blue-400/30 pointer-events-none"
            style={{ transform: `rotate(-${scanRotation * 1.5}deg)` }}
          />

          {/* Sweeping Conic Radar Beam in Gold */}
          <div
            className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full overflow-hidden pointer-events-none opacity-30"
            style={{ transform: `rotate(${scanRotation * 2}deg)` }}
          >
            <div
              className="w-1/2 h-1/2 origin-bottom-right"
              style={{
                background: 'conic-gradient(from 0deg, rgba(251, 191, 36, 0.5) 0deg, transparent 90deg)',
              }}
            />
          </div>

          {/* Center Brand Mark */}
          <motion.div
            key={selectedLayer.id}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-[#0c2a4f] to-[#081a30] border-2 border-[#1e6fd9] shadow-[0_0_35px_rgba(251,191,36,0.35)] flex flex-col items-center justify-center p-3 text-center"
          >
            <EmSafetyLogo variant="light" markOnly size="sm" className="h-7 mb-1" />
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-widest text-[#9ec7f0]">
              {selectedLayer.status}
            </span>
            <span className="font-sans text-[13px] font-bold text-white mt-0.5">{selectedLayer.score}%</span>
          </motion.div>

          {/* 4 Floating Telemetry Badges */}
          <div className="absolute top-4 left-4 sm:left-6 bg-[#081a30]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-700/60 font-mono text-[11px] text-[#cfe3f8]">
            [ LATENZA: 0.2ms ]
          </div>
          <div className="absolute bottom-4 right-4 sm:right-6 bg-[#081a30]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1e6fd9]/50 font-mono text-[11px] text-[#9ec7f0]">
            [ SCUDO: ATTIVO 100% ]
          </div>
          <div className="absolute top-4 right-4 sm:right-6 bg-[#081a30]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-700/60 font-mono text-[11px] text-[#cfe3f8]">
            [ SGI: ISO 45001 ]
          </div>
          <div className="absolute bottom-4 left-4 sm:left-6 bg-[#081a30]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1e6fd9]/50 font-mono text-[11px] text-[#9ec7f0]">
            [ D.LGS 81/08 ]
          </div>
        </div>

        {/* Right: Layer Diagnostics & Telemetry Data (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Layer Selector Tabs */}
          <div className="grid grid-cols-2 gap-2.5">
            {LAYERS.map((layer) => {
              const isCurrent = layer.id === selectedLayer.id;
              const LayerIcon = layer.icon;
              return (
                <button
                  key={layer.id}
                  onClick={() => handleSelect(layer)}
                  className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1e6fd9]/15 border-[#1e6fd9] text-white shadow-sm'
                      : 'bg-[#081a30]/80 border-blue-900/80 text-slate-300 hover:border-blue-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#1e6fd9]">
                      {layer.code}
                    </span>
                    <LayerIcon className={`w-4 h-4 ${isCurrent ? 'text-[#1e6fd9]' : 'text-slate-400'}`} />
                  </div>
                  <div className="font-sans text-[13px] font-bold truncate">{layer.name}</div>
                </button>
              );
            })}
          </div>

          {/* Layer Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-[#081a30]/95 border border-blue-800/80 rounded-2xl p-5 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-blue-900/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e6fd9]/20 border border-[#1e6fd9]/40 text-[#1e6fd9] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-[16px] font-bold text-white leading-tight">
                      {selectedLayer.name}
                    </h4>
                    <span className="font-sans text-[12px] text-[#1e6fd9] font-medium">
                      {selectedLayer.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[20px] font-bold text-[#1e6fd9] block leading-tight">
                    {selectedLayer.score}%
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-slate-300">
                    CONFORMITÀ
                  </span>
                </div>
              </div>

              <p className="font-sans text-[13.5px] text-slate-200 leading-relaxed">
                {selectedLayer.details}
              </p>

              {/* Live Telemetry Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-900/80">
                {selectedLayer.telemetry.map((t, idx) => (
                  <div key={idx} className="bg-[#051221] p-2.5 rounded-xl border border-blue-900/60 text-center">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                      {t.label}
                    </span>
                    <span className="font-sans text-[13px] font-bold text-[#1e6fd9]">{t.val}</span>
                  </div>
                ))}
              </div>

              {/* Protocol Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedLayer.protocols.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-slate-200 font-sans text-[11px] font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1e6fd9]" />
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
