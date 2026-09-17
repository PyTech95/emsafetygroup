import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Award, FileCheck2, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import EmSafetyLogo from './EmSafetyLogo';
import { soundFX } from '../utils/audio';

interface RadarNode {
  id: string;
  title: string;
  code: string;
  category: string;
  level: number;
  description: string;
  icon: typeof ShieldCheck;
  badge: string;
  requirements: string[];
}

const radarNodes: RadarNode[] = [
  {
    id: 'iso45001',
    title: 'Sicurezza & Salute sul Lavoro',
    code: 'ISO 45001:2018',
    category: 'Safety Management',
    level: 98,
    description:
      'Sistema di Gestione della Salute e Sicurezza sul Lavoro per azzerare gli infortuni, qualificare i fornitori e ridurre i tassi di premio INAIL (Modello OT23).',
    icon: ShieldCheck,
    badge: 'Conformità Totale',
    requirements: ['Valutazione rischi proattiva', 'Partecipazione dei lavoratori', 'Politica zero infortuni', 'Sgravi INAIL fino al 28%'],
  },
  {
    id: 'dlgs8108',
    title: 'Conformità Legislativa Obbligatoria',
    code: 'D.Lgs 81/08 & Accordo 2026',
    category: 'Compliance Normativa',
    level: 100,
    description:
      'Aggiornamento costante del Documento di Valutazione dei Rischi (DVR), nomine RSPP/RLS/Medico, piani di emergenza e verifiche periodiche degli impianti.',
    icon: FileCheck2,
    badge: 'Obbligo di Legge',
    requirements: ['DVR e Valutazioni Specifiche', 'Nomina RSPP esterno/supporto', 'Piano Emergenza & Antincendio', 'Sanzioni penali azzerate'],
  },
  {
    id: 'iso14001',
    title: 'Sostenibilità & Gestione Ambientale',
    code: 'ISO 14001:2015',
    category: 'Environmental ESG',
    level: 94,
    description:
      'Controllo degli impatti ambientali aziendali: gestione rifiuti speciali, emissioni in atmosfera, consumi energetici e conformità alle direttive ESG europee.',
    icon: ShieldCheck,
    badge: 'Conformità ESG',
    requirements: ['Registro Rifiuti & scarichi', 'Monitoraggio emissioni', 'Conformità direttive UE', 'Punteggi gare d’appalto'],
  },
  {
    id: 'iso9001',
    title: 'Qualità dei Processi Aziendali',
    code: 'ISO 9001:2015',
    category: 'Quality Governance',
    level: 96,
    description:
      'Standardizzazione dei protocolli operativi, audit interni e miglioramento continuo delle prestazioni aziendali con piena soddisfazione del cliente finale.',
    icon: Award,
    badge: 'Certificato Qualità',
    requirements: ['Mappatura processi chiave', 'KPI e metriche prestazionali', 'Audit interni di sorveglianza', 'Qualifica albo fornitori'],
  },
];

interface SafetyRadarGraphicProps {
  onOpenAuditModal: () => void;
}

export default function SafetyRadarGraphic({ onOpenAuditModal }: SafetyRadarGraphicProps) {
  const [selectedNode, setSelectedNode] = useState<RadarNode>(radarNodes[0]);

  const handleNodeClick = (node: RadarNode) => {
    soundFX.playLaser();
    setSelectedNode(node);
  };

  const NodeIcon = selectedNode.icon;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-lg relative overflow-hidden">
      {/* Header bar of graphic */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9] animate-ping" />
            <span className="font-sans text-[11.5px] font-bold uppercase tracking-[0.15em] text-[#0b2545]">
              INFOGRAFICA RADAR HSE • SISTEMI INTEGRATI
            </span>
          </div>
          <h3 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#0b2545] tracking-tight">
            Radar di Conformità &amp; Gestione SGI
          </h3>
          <p className="font-sans text-[14px] text-slate-600 mt-0.5 max-w-xl">
            Monitora l'interconnessione tra sicurezza, normativa D.Lgs 81/08, ambiente e governance aziendale. Seleziona uno standard per visualizzare metriche e requisiti.
          </p>
        </div>

        {/* Live Index Pill */}
        <div className="flex items-center gap-3 bg-[#e8f1fc]/80 border border-[#cfe3f8] px-4 py-2.5 rounded-2xl self-start sm:self-center shadow-xs">
          <Activity className="w-5 h-5 text-[#0b2545] animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-500">
              INDICE DI TENUTA GLOBALE
            </span>
            <span className="font-sans text-[17px] font-bold text-[#0b2545] leading-tight">
              98.2 / 100 <span className="text-[12px] text-[#1e6fd9] font-bold">(OTTIMALE)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Layout: Radar Visualization + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 relative z-10">
        {/* Left Side: Radar SVG Graphic with Motion Elements */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative p-4">
          <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-slate-200" />
            <div className="absolute inset-10 rounded-full border border-[#cfe3f8] border-dashed" />
            <div className="absolute inset-20 rounded-full border border-slate-200" />
            <div className="absolute inset-28 rounded-full border border-[#9ec7f0]/40 border-dashed" />

            {/* Radar Crosshairs */}
            <div className="absolute w-full h-[1px] bg-slate-200" />
            <div className="absolute h-full w-[1px] bg-slate-200" />

            {/* Rotating Radar Sweep Graphic in Navy/Gold */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-radar-sweep opacity-40">
              <div
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(11, 37, 69, 0.28) 0deg, rgba(251, 191, 36, 0.15) 30deg, transparent 70deg)',
                }}
              />
            </div>

            {/* Center Core Badge */}
            <div className="absolute z-20 w-22 h-22 rounded-full bg-white text-[#0b2545] flex flex-col items-center justify-center shadow-md border-2 border-[#0b2545] p-1">
              <EmSafetyLogo variant="dark" markOnly size="sm" className="h-6 mb-0.5" />
              <span className="font-sans text-[9px] font-extrabold uppercase tracking-widest text-[#0b2545]">SGI CORE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e6fd9] mt-0.5 animate-ping" />
            </div>

            {/* 4 Interactive Nodes along the periphery */}
            {radarNodes.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              const positions = [
                'top-1 left-1/2 -translate-x-1/2',
                'top-1/2 right-1 -translate-y-1/2',
                'bottom-1 left-1/2 -translate-x-1/2',
                'top-1/2 left-1 -translate-y-1/2',
              ];

              const BtnIcon = node.icon;

              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`absolute z-30 transition-all duration-300 p-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer ${positions[index]} ${
                    isSelected
                      ? 'bg-[#0b2545] text-white scale-105 ring-3 ring-[#1e6fd9] shadow-md font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:scale-105 hover:border-[#0b2545]'
                  }`}
                >
                  <BtnIcon className={`w-4 h-4 ${isSelected ? 'text-[#1e6fd9]' : 'text-[#0b2545]'}`} />
                  <span className="font-sans text-[12px] font-bold">{node.code}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[12px] font-sans text-slate-500 mt-4">
            Clicca sui nodi periferici per cambiare standard analizzato
          </span>
        </div>

        {/* Right Side: Selected Node Details Card */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-sans font-bold bg-[#cfe3f8] text-[#0b2545]">
                  {selectedNode.category}
                </span>
                <span className="text-[13px] font-sans font-bold text-slate-600">
                  Livello Copertura: <strong className="text-[#0b2545]">{selectedNode.level}%</strong>
                </span>
              </div>

              <h4 className="font-serif text-[24px] font-bold text-[#0b2545] mb-1">
                {selectedNode.title}
              </h4>
              <span className="font-sans text-[13px] font-bold text-[#0b2545] flex items-center gap-1.5 mb-3">
                <span className="text-[#1e6fd9]">★</span> Standard: {selectedNode.code} • {selectedNode.badge}
              </span>

              <p className="font-sans text-[14px] text-slate-600 leading-relaxed mb-4">
                {selectedNode.description}
              </p>

              <div className="mb-5">
                <span className="font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider block mb-2">
                  Requisiti di Conformità Verificati:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedNode.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-700 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  soundFX.playLaser();
                  onOpenAuditModal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border-b-2 border-[#1e6fd9]"
              >
                <span>Verifica Conformità {selectedNode.code}</span>
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
