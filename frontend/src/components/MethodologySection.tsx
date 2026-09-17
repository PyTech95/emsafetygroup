import { ArrowRight, Layers, ClipboardCheck, Users, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import SafetyRadarGraphic from './SafetyRadarGraphic';
import { soundFX } from '../utils/audio';

interface MethodologySectionProps {
  onOpenGapAnalysis: () => void;
}

export default function MethodologySection({ onOpenGapAnalysis }: MethodologySectionProps) {
  return (
    <section id="metodologia" className="w-full bg-white py-16 lg:py-24 border-b border-slate-200 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e8f1fc] text-[#0b2545] rounded-full text-[12px] font-sans font-bold uppercase tracking-widest mb-3 border border-[#cfe3f8] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1e6fd9]" />
            <span>METODOLOGIA E.M SAFETY &amp; INGEGNERIA HSE</span>
          </div>
          <h2 className="font-serif text-[32px] sm:text-[44px] text-[#0b2545] font-bold leading-[1.18] mb-4">
            Sistemi di gestione integrati per generare valore reale, non burocrazia sterile.
          </h2>
          <p className="font-sans text-[16px] sm:text-[17.5px] text-slate-600 leading-relaxed">
            I nostri auditor e RSPP qualificati affiancano il top management nella strutturazione di protocolli certificati ISO 45001, 14001 e 9001, progettati per ridurre i tassi di infortunio e azzerare i rischi di responsabilità penale e amministrativa d'impresa (D.Lgs. 231/01).
          </p>
        </div>

        {/* 4 Core Pillars Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Pillar 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 hover:border-blue-300 flex flex-col justify-between shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[28px] font-mono font-bold text-[#0b2545]">01</span>
                <div className="w-12 h-12 rounded-2xl bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#0b2545] group-hover:scale-110 transition-all">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-serif text-[22px] font-bold text-[#0b2545] mb-2 group-hover:text-blue-700 transition-colors">
                Sistemi di Gestione Integrati (SGI)
              </h3>
              <p className="font-sans text-[14.5px] leading-relaxed text-slate-600">
                Progettiamo e implementiamo sistemi integrati Qualità (ISO 9001), Ambiente (ISO 14001), Energia (ISO 50001) e Sicurezza (ISO 45001) — costruiti per essere effettivamente usati dall'organico operativo e superare a pieni voti ogni verifica degli enti accreditati.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2 text-[#0b2545] font-sans text-[13px] font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Riduzione dei costi di non-conformità e sgravi INAIL OT23</span>
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 hover:border-[#0b2545] flex flex-col justify-between shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[28px] font-mono font-bold text-[#0b2545]">02</span>
                <div className="w-12 h-12 rounded-2xl bg-[#1e6fd9]/15 border border-[#1e6fd9]/40 flex items-center justify-center text-[#0b2545] group-hover:scale-110 transition-all">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-serif text-[22px] font-bold text-[#0b2545] mb-2 group-hover:text-blue-700 transition-colors">
                Audit &amp; Verifiche Ispettive in Campo
              </h3>
              <p className="font-sans text-[14.5px] leading-relaxed text-slate-600">
                Conduciamo audit interni e di seconda parte (su fornitori critici e cantieri) per misurare l'efficacia reale del sistema di gestione, identificare tempestivamente le aree di miglioramento e prevenire ogni prescrizione degli organi di vigilanza (SPISAL, ATS, ITL).
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2 text-[#0b2545] font-sans text-[13px] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#1e6fd9] flex-shrink-0" />
              <span>Checklist di verifica conformi ai più severi protocolli Accredia</span>
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 hover:border-blue-300 flex flex-col justify-between shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[28px] font-mono font-bold text-[#0b2545]">03</span>
                <div className="w-12 h-12 rounded-2xl bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#0b2545] group-hover:scale-110 transition-all">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-serif text-[22px] font-bold text-[#0b2545] mb-2 group-hover:text-blue-700 transition-colors">
                Cultura Organizzativa e Formazione Continua
              </h3>
              <p className="font-sans text-[14.5px] leading-relaxed text-slate-600">
                Un sistema funziona quando le persone lo capiscono e lo condividono. Supportiamo le organizzazioni nel trasformare la compliance da adempimento burocratico passivo a comportamento consapevole e responsabile dei preposti, dirigenti e operatori.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2 text-[#0b2545] font-sans text-[13px] font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Coinvolgimento attivo e addestramento pratico esperienziale</span>
            </div>
          </motion.div>

          {/* Pillar 4 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 hover:border-[#0b2545] flex flex-col justify-between shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[28px] font-mono font-bold text-[#0b2545]">04</span>
                <div className="w-12 h-12 rounded-2xl bg-[#1e6fd9]/15 border border-[#1e6fd9]/40 flex items-center justify-center text-[#0b2545] group-hover:scale-110 transition-all">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-serif text-[22px] font-bold text-[#0b2545] mb-2 group-hover:text-blue-700 transition-colors">
                Monitoraggio Normativo &amp; KPI di Performance
              </h3>
              <p className="font-sans text-[14.5px] leading-relaxed text-slate-600">
                Definiamo cruscotti di indicatori HSE per rendere visibile il valore economico e operativo generato: zero infortuni, efficienza energetica, rispetto delle scadenze e piena tracciabilità dei patentini del personale in un unico scadenziario.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2 text-[#0b2545] font-sans text-[13px] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#1e6fd9] flex-shrink-0" />
              <span>Dashboard direzionali personalizzate per CdA e Datori di Lavoro</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Graphic Radar: Interactive HSE & SGI Infographic */}
        <div className="mb-12">
          <SafetyRadarGraphic onOpenAuditModal={onOpenGapAnalysis} />
        </div>

        {/* Action Callout Banner */}
        <div className="bg-[#0b2545] text-white p-8 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#1e6fd9]" />
              <span className="font-sans text-[11.5px] font-bold text-[#9ec7f0] uppercase tracking-wider">
                AUDIT PRELIMINARE • GAP ANALYSIS NORMATIVA
              </span>
            </div>
            <h3 className="font-serif text-[24px] sm:text-[28px] text-white font-bold mb-1.5">
              Vuoi verificare lo stato del tuo attuale sistema di sicurezza?
            </h3>
            <p className="font-sans text-[15px] text-slate-300 max-w-xl">
              I nostri tecnici qualificati eseguono un check-up immediato per mappare le scadenze imminenti e le aree di potenziale non conformità D.Lgs 81/08.
            </p>
          </div>
          <button
            onClick={() => {
              soundFX.playLaser();
              onOpenGapAnalysis();
            }}
            className="px-8 py-4 bg-[#1e6fd9] hover:bg-[#9ec7f0] text-[#0b2545] font-sans text-[14.5px] rounded-xl font-bold shadow-lg transition-all flex-shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Avvia Check-up di Conformità</span>
            <ArrowRight className="w-4 h-4 text-[#0b2545]" />
          </button>
        </div>
      </div>
    </section>
  );
}
