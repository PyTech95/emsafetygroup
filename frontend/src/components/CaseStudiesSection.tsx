import { useState } from 'react';
import {
  Building2,
  Trophy,
  CheckCircle2,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  Factory,
  Truck,
  HardHat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '../utils/audio';

interface CaseStudy {
  id: string;
  category: string;
  clientTitle: string;
  location: string;
  size: string;
  icon: typeof Factory;
  challenge: string;
  actions: string[];
  metrics: { label: string; value: string; desc: string }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'manufacturing',
    category: 'Metalmeccanica & Manifattura',
    clientTitle: 'Officine Meccaniche di Precisione',
    location: 'Treviso (TV) • Polo Industriale',
    size: '145 Lavoratori • Rischio Alto',
    icon: Factory,
    challenge:
      'Impianto con macchinari complessi a controllo numerico (CNC), presenza di fumi di saldatura e necessità di adeguarsi allo standard ISO 45001 per partecipare a gare d’appalto internazionali.',
    actions: [
      'Valutazione strumentale fumi e rumore con fonometro integratore in classe 1',
      'Incarico RSPP Esterno e implementazione Sistema di Gestione Integrato SGI',
      'Formazione continua esperienziale direttamente a bordo macchina',
    ],
    metrics: [
      { label: 'Indice Infortuni', value: '- 84%', desc: 'in 24 mesi di presidio continuo' },
      { label: 'Audit ISO 45001', value: '100%', desc: 'superato al primo tentativo con zero rilievi' },
      { label: 'Sgravio INAIL OT23', value: '€ 19.200', desc: 'risparmiati ogni anno sui premi' },
    ],
  },
  {
    id: 'logistics',
    category: 'Logistica & Magazzinaggio',
    clientTitle: 'Piattaforma Intermodale Merci',
    location: 'Milano (MI) • Area Metropolitana',
    size: '90 Addetti • Rischio Medio/Alto',
    icon: Truck,
    challenge:
      'Elevata densità di carrelli elevatori in movimento continuo, frequenti mancate collisioni (near-miss) e rotazione stagionale del personale di magazzino.',
    actions: [
      'Ridisegno del piano di viabilità interna e regolamento di circolazione',
      'Addestramento pratico carrellisti con rilascio patentini 12h su carrelli trilaterali',
      'Integrazione scadenziario cloud per la verifica istantanea dei nuovi inseriti',
    ],
    metrics: [
      { label: 'Near-Miss Collisioni', value: '- 92%', desc: 'dopo il nuovo piano viabilità' },
      { label: 'Conformità Patentini', value: '100%', desc: 'personale interinale sempre in regola' },
      { label: 'Tempi Onboarding', value: '48h', desc: 'per la formazione sicurezza dei nuovi assunti' },
    ],
  },
  {
    id: 'construction',
    category: 'Edilizia & Cantieri',
    clientTitle: 'General Contractor Costruzioni',
    location: 'Veneto & Lombardia • 12 Cantieri Attivi',
    size: '70 Maestranze + Subappalti',
    icon: HardHat,
    challenge:
      'Gestione simultanea di molteplici cantieri edili, verifiche documentali subappaltatori e rischio di sospensione cantiere durante i controlli dell’Ispettorato del Lavoro.',
    actions: [
      'Redazione POS (Piani Operativi di Sicurezza) asseverati in 24-48 ore',
      'Sopralluoghi tecnici quindicinali di verifica DPI e ponteggi (PIMUS)',
      'Audit di idoneità tecnico-professionale di 45 ditte subappaltatrici',
    ],
    metrics: [
      { label: 'Ispezioni ITL/Spresal', value: '0 Verbali', desc: 'su 14 controlli a sorpresa in cantiere' },
      { label: 'Tempo Rilascio POS', value: '24 Ore', desc: 'per avvio immediato dei lavori' },
      { label: 'Stop Cantiere Evitati', value: '100%', desc: 'continuità produttiva totale garantita' },
    ],
  },
];

interface CaseStudiesSectionProps {
  onSelectCaseQuote: (serviceTitle: string) => void;
}

export default function CaseStudiesSection({ onSelectCaseQuote }: CaseStudiesSectionProps) {
  const [selectedCase, setSelectedCase] = useState<CaseStudy>(CASE_STUDIES[0]);

  const handleSelectCase = (study: CaseStudy) => {
    soundFX.playLaser();
    setSelectedCase(study);
  };

  const CurrentIcon = selectedCase.icon;

  return (
    <section className="w-full bg-white py-16 lg:py-24 border-b border-slate-200 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e8f1fc] text-[#0b2545] rounded-full text-[12px] font-sans font-bold uppercase tracking-widest mb-3 border border-[#cfe3f8] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#1e6fd9]" />
            <span>TRACK RECORD • VENETO &amp; LOMBARDIA</span>
          </div>
          <h2 className="font-serif text-[32px] sm:text-[44px] text-[#0b2545] font-bold tracking-tight mb-3">
            Casi studio e impatto aziendale misurabile
          </h2>
          <p className="font-sans text-[16px] text-slate-600 leading-relaxed">
            Scopri come abbiamo trasformato la sicurezza da vincolo burocratico a leva di efficienza e tutela legale per importanti realtà produttive italiane.
          </p>
        </div>

        {/* Sector Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {CASE_STUDIES.map((study) => {
            const Icon = study.icon;
            const isActive = selectedCase.id === study.id;
            return (
              <button
                key={study.id}
                onClick={() => handleSelectCase(study)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-sans text-[13.5px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0b2545] text-white shadow-md scale-105'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1e6fd9]' : 'text-[#0b2545]'}`} />
                <span>{study.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active Case Study Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCase.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-50/80 rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Overview & Actions (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-[#0b2545] flex items-center justify-center shadow-xs">
                    <CurrentIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                      {selectedCase.category}
                    </span>
                    <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#0b2545]">
                      {selectedCase.clientTitle}
                    </h3>
                    <span className="font-sans text-[13px] text-slate-500 font-medium">
                      {selectedCase.location} • {selectedCase.size}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-sans text-[12px] font-bold uppercase tracking-wider text-amber-800 mb-2">
                    LA SFIDA INIZIALE
                  </h4>
                  <p className="font-sans text-[14.5px] text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    {selectedCase.challenge}
                  </p>
                </div>

                <div>
                  <h4 className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#0b2545] mb-2.5">
                    INTERVENTO E.M SAFETY
                  </h4>
                  <div className="space-y-2.5">
                    {selectedCase.actions.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Metrics & Conversion (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 flex flex-col justify-between h-full shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 mb-4">
                    <Trophy className="w-5 h-5 text-[#155bb0]" />
                    <span className="font-sans text-[12px] font-bold uppercase tracking-wider">
                      Metriche di Successo Raggiunte
                    </span>
                  </div>

                  <div className="space-y-3.5 mb-6">
                    {selectedCase.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200"
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-serif text-[28px] font-bold text-[#0b2545]">
                            {metric.value}
                          </span>
                          <span className="font-sans text-[12px] font-bold text-slate-700 uppercase">
                            {metric.label}
                          </span>
                        </div>
                        <span className="font-sans text-[12.5px] text-slate-500 block mt-0.5">
                          {metric.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      soundFX.playLaser();
                      onSelectCaseQuote(selectedCase.clientTitle);
                    }}
                    className="w-full py-3.5 px-4 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-[#1e6fd9]"
                  >
                    <span>Richiedi un piano simile</span>
                    <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
                  </button>
                  <span className="text-[12px] font-sans text-center block text-slate-500 mt-2">
                    Soluzioni personalizzate per siti industriali, edili e logistici
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
