import { ArrowRight, ShieldAlert, GraduationCap, Headphones, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import InteractiveRiskRoadmap from './InteractiveRiskRoadmap';
import { soundFX } from '../utils/audio';

interface NeedsSectionProps {
  onSelectOption: (type: 'consulting' | 'courses' | 'support') => void;
  onSelectSectorQuote?: (sectorName: string) => void;
}

export default function NeedsSection({ onSelectOption, onSelectSectorQuote }: NeedsSectionProps) {
  const handleSectorQuote = (sectorName: string) => {
    soundFX.playLaser();
    if (onSelectSectorQuote) {
      onSelectSectorQuote(sectorName);
    } else {
      onSelectOption('consulting');
    }
  };

  const handleCardClick = (type: 'consulting' | 'courses' | 'support') => {
    soundFX.playLaser();
    onSelectOption(type);
  };

  return (
    <section className="w-full py-16 lg:py-24 relative z-10 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9]" />
              <span className="font-mono text-[11.5px] font-bold text-[#0b2545] uppercase tracking-[0.2em] block">
                ORIENTAMENTO STRATEGICO &amp; SETTORIALE
              </span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[44px] text-[#0b2545] font-bold tracking-tight">
              Architettura dei Servizi E.M Safety
            </h2>
          </div>
          <p className="font-sans text-[15.5px] text-slate-600 max-w-md">
            Individua la soluzione di conformità idonea per la tua organizzazione: supporto specialistico per Datori di Lavoro, RSPP, responsabili HSE e direzioni HR.
          </p>
        </div>

        {/* 3 Executive Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {/* Option A: Consulenza & SGI */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => handleCardClick('consulting')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 transition-all duration-300 p-8 rounded-3xl flex flex-col justify-between shadow-md hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8f1fc] rounded-full blur-2xl pointer-events-none group-hover:bg-[#cfe3f8]/60 transition-all" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#e8f1fc] border border-[#cfe3f8] text-[#0b2545] flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 group-hover:bg-[#0b2545] group-hover:text-white transition-all">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <span className="font-mono text-[11px] font-bold text-[#0b2545] uppercase tracking-wider block mb-1">
                [ MODULO 01 • DVR &amp; SGI ]
              </span>
              <h3 className="font-serif text-[22px] font-bold text-[#0b2545] mb-3 leading-snug group-hover:text-blue-700 transition-colors">
                Consulenza Direzionale &amp; Sistemi HSE
              </h3>
              <p className="font-sans text-[14.5px] leading-relaxed text-slate-600 mb-6">
                Progettazione e mantenimento Sistemi Qualità, Ambiente, Sicurezza (SGI). Audit ispettivi, DVR specialistici, Valutazione Rischi strumentale e assunzione incarico RSPP esterno qualificato.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-sans text-[14px] font-bold">
              <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-[#0b2545]">
                <span>Esplora la consulenza</span>
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </span>
              <span className="font-mono text-[10.5px] font-bold px-2.5 py-1 rounded bg-slate-100 text-[#0b2545] border border-slate-200 uppercase tracking-wider">
                D.Lgs 81/08
              </span>
            </div>
          </motion.div>

          {/* Option B: Formazione & Corsi Obbligatori */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => handleCardClick('courses')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-[#1e6fd9] transition-all duration-300 p-8 rounded-3xl flex flex-col justify-between shadow-md hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e6fd9]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#1e6fd9]/20 transition-all" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#1e6fd9]/15 border border-[#1e6fd9]/40 text-[#0b2545] flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 group-hover:bg-[#0b2545] group-hover:text-[#9ec7f0] transition-all">
                <GraduationCap className="w-7 h-7" />
              </div>

              <span className="font-mono text-[11px] font-bold text-[#0b2545] uppercase tracking-wider block mb-1">
                [ MODULO 02 • ACADEMY 2026 ]
              </span>
              <h3 className="font-serif text-[22px] font-bold text-[#0b2545] mb-3 leading-snug group-hover:text-blue-700 transition-colors">
                Formazione &amp; Corsi Accreditati
              </h3>
              <p className="font-sans text-[14.5px] leading-relaxed text-slate-600 mb-6">
                Catalogo completo conforme al nuovo Accordo Stato-Regioni 2026: Formazione Lavoratori (Basso, Medio, Alto rischio), Preposti, Dirigenti, RLS, Antincendio e Primo Soccorso con attestati crittografati.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-sans text-[14px] font-bold">
              <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-[#0b2545]">
                <span>Vedi catalogo corsi</span>
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </span>
              <span className="font-mono text-[10.5px] font-bold px-2.5 py-1 rounded bg-[#1e6fd9]/15 text-[#0b2545] border border-[#1e6fd9]/30 uppercase tracking-wider">
                Attestati QR
              </span>
            </div>
          </motion.div>

          {/* Option C: Supporto & Monitoraggio Continuo */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => handleCardClick('support')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 transition-all duration-300 p-8 rounded-3xl flex flex-col justify-between shadow-md hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8f1fc] rounded-full blur-2xl pointer-events-none group-hover:bg-[#cfe3f8]/60 transition-all" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#e8f1fc] border border-[#cfe3f8] text-[#0b2545] flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 group-hover:bg-[#0b2545] group-hover:text-white transition-all">
                <Headphones className="w-7 h-7" />
              </div>

              <span className="font-mono text-[11px] font-bold text-[#0b2545] uppercase tracking-wider block mb-1">
                [ MODULO 03 • CLOUD DESK 24/48H ]
              </span>
              <h3 className="font-serif text-[22px] font-bold text-[#0b2545] mb-3 leading-snug group-hover:text-blue-700 transition-colors">
                Supporto &amp; Scadenziario Cloud
              </h3>
              <p className="font-sans text-[14.5px] leading-relaxed text-slate-600 mb-6">
                Un affiancamento costante per non perdere mai una scadenza formativa o di rinnovo documentale. Monitoraggio legislativo attivo con alert preventivi a -90gg e presidio in caso di ispezione SPISAL / ATS.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-sans text-[14px] font-bold">
              <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-[#0b2545]">
                <span>Contatta un referente HSE</span>
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </span>
              <span className="font-mono text-[10.5px] font-bold px-2.5 py-1 rounded bg-[#e8f1fc] text-[#0b2545] border border-[#cfe3f8] uppercase tracking-wider">
                SLA &lt; 24h
              </span>
            </div>
          </motion.div>
        </div>

        {/* Interactive Risk Roadmap Graphic */}
        <div className="pt-4">
          <InteractiveRiskRoadmap onSelectSectorQuote={handleSectorQuote} />
        </div>
      </div>
    </section>
  );
}
