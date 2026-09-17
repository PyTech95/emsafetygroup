import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Stethoscope,
  HardHat,
  Flame,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Building,
} from 'lucide-react';
import EmSafetyLogo from './EmSafetyLogo';
import { soundFX } from '../utils/audio';

interface EcosystemNode {
  id: string;
  title: string;
  role: string;
  angle: number; // in degrees
  icon: typeof Stethoscope;
  volume: string;
  benefits: string[];
  description: string;
}

const NODES: EcosystemNode[] = [
  {
    id: 'medici',
    title: 'Medici Competenti & Centri Sanitari',
    role: 'Sorveglianza Sanitaria D.Lgs 81/08',
    angle: 0,
    icon: Stethoscope,
    volume: '2.800+ Visite/Anno',
    benefits: [
      'Cartelle sanitarie digitalizzate in cloud',
      'Unità mobili per visite preventive direttamente in azienda',
      'Esami strumentali specialistici (audiometrie, spirometrie, drug-test)',
    ],
    description: 'Rete capillare di medici del lavoro per la nomina diretta e la gestione completa dei protocolli sanitari obbligatori.',
  },
  {
    id: 'rspp',
    title: 'Consulenti HSE & RSPP Autonomi',
    role: 'Ingegneria della Sicurezza & Cantieri',
    angle: 90,
    icon: HardHat,
    volume: '120+ Incarichi Attivi',
    benefits: [
      'Assunzione diretta incarico RSPP esterno per tutti i macrosettori ATECO',
      'Check-up cantieri DUVRI e piani di sicurezza e coordinamento PSC',
      'Verifiche strumentali con strumentazione tarata Accredia di proprietà',
    ],
    description: 'Specialisti abilitati con polizza RC professionale e reperibilità h24 a supporto dell’organigramma aziendale.',
  },
  {
    id: 'antincendio',
    title: 'Ingegneria Antincendio & CPI',
    role: 'Pratiche Vigili del Fuoco & Progettazione',
    angle: 180,
    icon: Flame,
    volume: '85+ Pratiche CPI',
    benefits: [
      'Progettazione Fire Safety Engineering (Codice Prevenzione Incendi)',
      'Rinnovo e rilascio Certificato Prevenzione Incendi CPI',
      'Collaudo e asseverazione idraulica reti idranti e sprinkler',
    ],
    description: 'Ingegneri iscritti agli elenchi ministeriali ex Legge 818/84 per attività soggette a controllo di prevenzione incendi.',
  },
  {
    id: 'formazione',
    title: 'Centri Formazione & Enti Bilaterali',
    role: 'Accreditamento & Certificazioni OPN',
    angle: 270,
    icon: GraduationCap,
    volume: '15.000 Ore Erogate',
    benefits: [
      'Rilascio attestati a norma con il Nuovo Accordo Stato-Regioni 2026',
      'Piattaforma E-Learning FAD tracciata con SCORM e riconoscimento biometrico',
      'Accesso ai Fondi Interprofessionali per formazione a costo zero (Fondimpresa, ecc.)',
    ],
    description: 'Poli formativi accreditati territoriali per corsi obbligatori, patentini e addestramento specialistico di campo.',
  },
];

interface AnimatedPartnerEcosystemProps {
  onSelectPartnerRole?: (role: string) => void;
}

export default function AnimatedPartnerEcosystem({ onSelectPartnerRole }: AnimatedPartnerEcosystemProps) {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode>(NODES[0]);
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  // Smooth orbital rotation
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setOrbitRotation((prev) => (prev + 0.3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating]);

  const handleNodeClick = (node: EcosystemNode) => {
    soundFX.playLaser();
    setSelectedNode(node);
  };

  const SelectedIcon = selectedNode.icon;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9] animate-ping" />
            <span className="font-sans text-[11px] font-bold text-[#0b2545] uppercase tracking-[0.16em]">
              ECOSISTEMA INTEGRATO • RETE PROFESSIONALE
            </span>
          </div>
          <h3 className="font-serif text-[22px] sm:text-[28px] font-bold text-[#0b2545] tracking-tight">
            Mappa Orbitale delle Partnership Strategiche
          </h3>
          <p className="font-sans text-[13.5px] sm:text-[14px] text-slate-600 mt-1 max-w-xl">
            Un'unica regia centrale E.M Safety che coordina medici del lavoro, tecnici della prevenzione, ingegneri antincendio e poli formativi accreditati.
          </p>
        </div>

        {/* Orbit indicator */}
        <div className="flex items-center gap-2 bg-[#e8f1fc]/80 border border-[#cfe3f8] px-4 py-2 rounded-2xl self-start sm:self-center">
          <Users className="w-4 h-4 text-[#0b2545]" />
          <span className="font-mono text-[12px] font-bold text-[#0b2545]">
            HUB MULTIDISCIPLINARE ATTIVO
          </span>
        </div>
      </div>

      {/* Main Grid: Orbit Visual on Left, Partner Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        {/* Left Side: Animated Orbiting Solar System Diagram (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[420px] bg-gradient-to-b from-[#e8f1fc]/30 to-slate-50/70 rounded-2xl border border-[#cfe3f8] p-4">
          {/* Concentric Orbit Rings */}
          <div className="absolute w-[290px] h-[290px] sm:w-[340px] sm:h-[340px] rounded-full border border-[#cfe3f8] pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full border border-[#9ec7f0]/40 border-dashed pointer-events-none" />

          {/* Central E.M Safety Hub */}
          <div className="relative z-20 w-28 h-28 rounded-3xl bg-[#0b2545] text-white flex flex-col items-center justify-center p-2 shadow-xl border-2 border-[#1e6fd9] text-center">
            <EmSafetyLogo variant="light" markOnly size="sm" className="h-7 mb-0.5" />
            <span className="font-sans text-[9px] font-black uppercase tracking-wider text-[#9ec7f0]">
              E.M SAFETY HUB
            </span>
            <span className="text-[10px] text-slate-200 font-medium">Regia Centrale</span>
          </div>

          {/* Orbiting Satellite Nodes */}
          {NODES.map((node) => {
            const isCurrent = node.id === selectedNode.id;
            const Icon = node.icon;

            // Calculate position along orbit
            const currentAngle = (node.angle + orbitRotation) * (Math.PI / 180);
            const radius = 135; // px
            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;

            return (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className={`absolute z-30 transition-transform duration-200 p-2.5 rounded-2xl flex items-center justify-center shadow-md cursor-pointer group ${
                  isCurrent
                    ? 'bg-[#0b2545] text-[#9ec7f0] ring-3 ring-[#1e6fd9] scale-115 shadow-xl'
                    : 'bg-white text-[#0b2545] border-2 border-[#cfe3f8] hover:scale-110 hover:border-[#0b2545]'
                }`}
                title={node.title}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#1e6fd9]' : 'text-[#0b2545]'}`} />

                {/* Pulsing indicator when active */}
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#1e6fd9] animate-ping" />
                )}
              </button>
            );
          })}

          {/* Hint */}
          <span className="absolute bottom-3 font-sans text-[11.5px] text-slate-500">
            Tocca un satellite in orbita per esplorare la sinergia operativa
          </span>
        </div>

        {/* Right Side: Detailed Partner Focus Card (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Fast Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2">
            {NODES.map((n) => {
              const isCurrent = n.id === selectedNode.id;
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNodeClick(n)}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer flex items-center gap-2.5 ${
                    isCurrent
                      ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-sm'
                      : 'bg-slate-100/80 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-[#1e6fd9]' : 'text-[#0b2545]'}`} />
                  <span className="font-sans text-[12px] font-bold truncate">{n.title}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Details Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#cfe3f8] text-[#0b2545] flex items-center justify-center flex-shrink-0">
                    <SelectedIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[20px] font-bold text-[#0b2545] leading-snug">
                      {selectedNode.title}
                    </h4>
                    <span className="font-sans text-[12px] font-bold text-slate-600 block">
                      {selectedNode.role}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#1e6fd9]/20 text-[#0b2545] border border-[#1e6fd9]/30 flex-shrink-0">
                  {selectedNode.volume}
                </span>
              </div>

              <p className="font-sans text-[14px] text-slate-600 leading-relaxed">
                {selectedNode.description}
              </p>

              {/* Vantaggi della Rete */}
              <div className="space-y-2 pt-1">
                <span className="font-sans text-[11.5px] font-bold text-[#0b2545] uppercase tracking-wider block">
                  Vantaggi e Servizi Coordinati:
                </span>
                <div className="space-y-2">
                  {selectedNode.benefits.map((ben, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-[12.5px] text-slate-700 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1e6fd9] flex-shrink-0" />
                      <span className="font-medium">{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              {onSelectPartnerRole && (
                <button
                  onClick={() => onSelectPartnerRole(selectedNode.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13.5px] font-bold rounded-xl shadow-md transition-all cursor-pointer border-b-2 border-[#1e6fd9]"
                >
                  <span>Candidati come {selectedNode.title}</span>
                  <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
