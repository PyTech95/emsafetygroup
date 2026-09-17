import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSearch,
  Scale,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface WorkflowStep {
  step: number;
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  deliverable: string;
  icon: typeof FileSearch;
  details: string[];
  stat: string;
  statLabel: string;
}

const STEPS: WorkflowStep[] = [
  {
    step: 1,
    id: 'audit',
    title: 'Audit Iniziale & Gap Analysis 360°',
    subtitle: 'Sopralluogo tecnico e check-up documentale D.Lgs 81/08',
    duration: '24 - 48 Ore',
    deliverable: 'Report di Conformità & Mappatura Non-Conformità',
    icon: FileSearch,
    details: [
      'Ispezione fisica di cantieri, reparti produttivi e uffici',
      'Verifica scadenze nomine RSPP, Medico Competente e RLS',
      'Analisi preliminare dei carichi di rischio e adempimenti omessi',
    ],
    stat: '100%',
    statLabel: 'Copertura Mappata',
  },
  {
    step: 2,
    id: 'dvr',
    title: 'Valutazione Rischi & DVR Dinamico',
    subtitle: 'Stesura protocolli operativi e fascicolo tecnico specifico',
    duration: '5 - 7 Giorni',
    deliverable: 'DVR validato con firma digitale & Piani Emergenza',
    icon: Scale,
    details: [
      'Valutazioni strumentali (rumore, vibrazioni, chimico, ATEX, stress)',
      'Definizione misure di prevenzione e protezione personalizzate',
      'Redazione DUVRI per appalti e gestione interferenze cantieri',
    ],
    stat: 'Zero',
    statLabel: 'Sanzioni Residue',
  },
  {
    step: 3,
    id: 'training',
    title: 'Piano Formazione & Addestramento',
    subtitle: 'Corsi accreditati in aula, esperienziali o FAD tracciata',
    duration: 'Pianificazione Continua',
    deliverable: 'Attestati certificati con QR Code anticontraffazione',
    icon: GraduationCap,
    details: [
      'Corsi Datori di Lavoro, RSPP, Dirigenti, Preposti e Lavoratori',
      'Prove pratiche antincendio a fuoco vivo e manovre BLSD con DAE',
      'Addestramento abilitante attrezzature (PLE, carrelli, gru, spazi confinati)',
    ],
    stat: '1500+',
    statLabel: 'Lavoratori Formati/Anno',
  },
  {
    step: 4,
    id: 'shield',
    title: 'Scudo Penale 231 & Vantaggio INAIL',
    subtitle: 'Tutela legale permanente e ottimizzazione economica',
    duration: 'Presidio Annuale H24',
    deliverable: 'Modello Organizzativo 231 esimente & Domanda OT23',
    icon: ShieldCheck,
    details: [
      'Esenzione da responsabilità penale e amministrativa del Datore',
      'Sgravio tariffario INAIL Modello OT23 con risparmio fino al 28%',
      'Assistenza tecnica immediata e supporto peritale in caso di ispezione',
    ],
    stat: '-28%',
    statLabel: 'Premio INAIL Annuale',
  },
];

export default function AnimatedComplianceWorkflow() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [packetProgress, setPacketProgress] = useState(0);

  // Animated packet flowing along the pipeline
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketProgress((prev) => (prev + 1.2) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const currentStep = STEPS[activeStepIndex];
  const StepIcon = currentStep.icon;

  const handleStepClick = (idx: number) => {
    soundFX.playLaser();
    setActiveStepIndex(idx);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9] animate-ping" />
            <span className="font-sans text-[11px] font-bold text-[#0b2545] uppercase tracking-[0.16em]">
              METODOLOGIA CERTIFICATA • WORKFLOW DINAMICO
            </span>
          </div>
          <h3 className="font-serif text-[22px] sm:text-[28px] font-bold text-[#0b2545] tracking-tight">
            Il Percorso E.M Safety in 4 Fasi Sincronizzate
          </h3>
          <p className="font-sans text-[13.5px] sm:text-[14px] text-slate-600 mt-1 max-w-xl">
            Dal primo audit tecnico alla completa impermeabilità penale: un sistema fluido che trasforma gli obblighi normativi in valore economico misurabile.
          </p>
        </div>

        {/* Live Step Badge */}
        <div className="flex items-center gap-2 bg-[#e8f1fc]/80 border border-[#cfe3f8] px-4 py-2 rounded-2xl self-start sm:self-center">
          <Clock className="w-4 h-4 text-[#0b2545]" />
          <span className="font-mono text-[12px] font-bold text-[#0b2545]">
            FASE {currentStep.step} DI 4: {currentStep.duration}
          </span>
        </div>
      </div>

      {/* Animated Conduit Pipeline (Interactive Step Bar) */}
      <div className="pt-8 pb-4 relative">
        {/* Background Conduit Line */}
        <div className="hidden md:block absolute top-[52px] left-[6%] right-[6%] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          {/* Active filled line up to current step */}
          <div
            className="h-full bg-gradient-to-r from-[#0b2545] via-[#1d4ed8] to-[#1e6fd9] transition-all duration-500 rounded-full"
            style={{ width: `${((activeStepIndex + 1) / 4) * 100}%` }}
          />

          {/* Animated Gold Traveling Energy Packet */}
          <div
            className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-[#9ec7f0] to-transparent blur-[2px] opacity-90 transition-all pointer-events-none"
            style={{ left: `${packetProgress}%` }}
          />
        </div>

        {/* 4 Interactive Step Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {STEPS.map((s, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isCompleted = idx < activeStepIndex;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => handleStepClick(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group relative ${
                  isCurrent
                    ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-lg scale-102 ring-2 ring-[#1e6fd9]/80'
                    : isCompleted
                    ? 'bg-[#e8f1fc]/50 text-[#0b2545] border-[#cfe3f8] hover:border-blue-400'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-[13px] font-black transition-all ${
                      isCurrent
                        ? 'bg-[#1e6fd9] text-[#0b2545] shadow-md'
                        : isCompleted
                        ? 'bg-[#0b2545] text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    0{s.step}
                  </div>
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isCurrent ? 'text-[#9ec7f0]' : 'text-slate-400 group-hover:text-[#0b2545]'
                    }`}
                  />
                </div>

                <h4
                  className={`font-sans text-[14.5px] font-bold leading-snug mb-1 ${
                    isCurrent ? 'text-white' : 'text-[#0b2545]'
                  }`}
                >
                  {s.title}
                </h4>

                <span
                  className={`font-sans text-[11px] block ${
                    isCurrent ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {s.duration}
                </span>

                {/* Active Indicator Dot */}
                {isCurrent && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e6fd9] rotate-45" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detailed View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-6 bg-gradient-to-br from-[#e8f1fc]/50 via-white to-slate-50/70 rounded-2xl border border-[#cfe3f8] p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#0b2545] bg-[#1e6fd9]/20 px-2.5 py-1 rounded-md border border-[#1e6fd9]/30">
                  FASE 0{currentStep.step} DI 04
                </span>
                <span className="font-sans text-[12px] font-bold text-slate-500">
                  TEMPO STIMATO: {currentStep.duration}
                </span>
              </div>

              <h4 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#0b2545] leading-tight">
                {currentStep.title}
              </h4>
              <p className="font-sans text-[14.5px] text-slate-600 leading-relaxed">
                {currentStep.subtitle}
              </p>

              {/* Action Checklist */}
              <div className="space-y-2 pt-2">
                <span className="font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider block">
                  Attività Eseguite dagli Specialisti E.M Safety:
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentStep.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1e6fd9] flex-shrink-0" />
                      <span className="font-sans text-[13.5px] text-slate-700 font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverable Pill */}
              <div className="pt-2 flex items-center gap-2 text-slate-700 font-sans text-[13px]">
                <Award className="w-4 h-4 text-[#0b2545] flex-shrink-0" />
                <span>
                  <strong>Output Consegnato:</strong> {currentStep.deliverable}
                </span>
              </div>
            </div>

            {/* Right Metric Card (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-[#0b2545] text-white rounded-2xl border-2 border-[#1e6fd9] shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#9ec7f0] flex items-center justify-center mb-3">
                <StepIcon className="w-7 h-7" />
              </div>
              <span className="font-mono text-[36px] sm:text-[42px] font-black text-[#1e6fd9] leading-none mb-1">
                {currentStep.stat}
              </span>
              <span className="font-sans text-[12.5px] font-bold uppercase tracking-wider text-slate-200 mb-4">
                {currentStep.statLabel}
              </span>

              <div className="w-full pt-3 border-t border-blue-800/80 text-[11.5px] text-slate-300">
                Garanzia di Risultato Contrattuale E.M Safety
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
