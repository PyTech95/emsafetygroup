import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  FileWarning,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundFX } from '../utils/audio';

interface SanctionsProtectionSectionProps {
  onOpenConsultingQuote: () => void;
}

export default function SanctionsProtectionSection({
  onOpenConsultingQuote,
}: SanctionsProtectionSectionProps) {
  const comparisonData = [
    {
      title: 'Mancata Redazione o Aggiornamento DVR',
      violation: 'Art. 28 e 29 D.Lgs 81/08',
      withoutUs: {
        penalty: 'Arresto da 3 a 6 mesi o ammenda fino a € 7.862',
        risk: 'Sospensione immediata dell’attività imprenditoriale da parte degli organi ispettivi (ASL / ITL)',
        icon: XCircle,
      },
      withUs: {
        solution: 'DVR Asseverato con rilievi strumentali sul campo',
        benefit: 'Tutela penale totale per il Datore di Lavoro e aggiornamento tempestivo a ogni variazione di layout o macchinario',
        icon: CheckCircle2,
      },
    },
    {
      title: 'Omessa Formazione Lavoratori e Preposti',
      violation: 'Art. 37 D.Lgs 81/08 e Accordo 2026',
      withoutUs: {
        penalty: 'Arresto da 2 a 4 mesi o ammenda fino a € 6.388 per lavoratore',
        risk: 'Responsabilità civile aggravata e rivalsa INAIL in caso di infortunio anche lieve',
        icon: XCircle,
      },
      withUs: {
        solution: 'Piattaforma Scadenziario Cloud + Corsi Accreditati',
        benefit: 'Copertura formativa continua, attestati asseverati e alert automatici 90 giorni prima della scadenza',
        icon: CheckCircle2,
      },
    },
    {
      title: 'Mancata Nomina RSPP Qualificato',
      violation: 'Art. 17 e 32 D.Lgs 81/08',
      withoutUs: {
        penalty: 'Arresto da 3 a 6 mesi o ammenda fino a € 7.862',
        risk: 'Assenza di presidio tecnico durante gli audit e le verifiche degli organi di vigilanza',
        icon: XCircle,
      },
      withUs: {
        solution: 'Incarico RSPP Esterno con Assunzione di Responsabilità',
        benefit: 'Ingegneri abilitati dedicati, assistenza diretta durante le visite ispettive e audit periodici programmati',
        icon: CheckCircle2,
      },
    },
    {
      title: 'Omessa Sorveglianza Sanitaria e Visite Mediche',
      violation: 'Art. 18 e 41 D.Lgs 81/08',
      withoutUs: {
        penalty: 'Ammenda da € 1.228 a € 5.164 per ogni lavoratore avviato alla mansione',
        risk: 'Inidoneità non diagnosticate e contenziosi legali con rivalse sindacali',
        icon: XCircle,
      },
      withUs: {
        solution: 'Rete Medici Competenti Convenzionati a Treviso e Milano',
        benefit: 'Protocolli sanitari mirati per mansione, visite in sede con camper attrezzato e cartelle sanitarie digitali',
        icon: CheckCircle2,
      },
    },
  ];

  return (
    <section className="w-full bg-slate-50/70 text-slate-900 py-16 lg:py-24 relative overflow-hidden border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e8f1fc] text-[#0b2545] rounded-full text-[12px] font-sans font-bold uppercase tracking-widest mb-3 border border-[#cfe3f8] shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-[#0b2545]" />
            <span>TUTELA LEGALE &amp; SCUDO PENALE D.LGS 81/08</span>
          </div>
          <h2 className="font-serif text-[32px] sm:text-[44px] font-bold text-[#0b2545] tracking-tight mb-4">
            Quanto costa davvero una mancata conformità?
          </h2>
          <p className="font-sans text-[16px] sm:text-[17.5px] text-slate-600 leading-relaxed">
            In Italia la sicurezza sul lavoro non è una mera formalità burocratica: il Datore di Lavoro risponde con il proprio patrimonio personale e penalmente. Scopri come l'ingegneria E.M Safety azzera i rischi sanzionatori.
          </p>
        </div>

        {/* 4-Item Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {comparisonData.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-serif text-[18px] sm:text-[20px] font-bold text-[#0b2545]">
                    {item.title}
                  </span>
                  <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#e8f1fc] text-amber-950 border border-[#9ec7f0]">
                    {item.violation}
                  </span>
                </div>

                {/* Scenario 1: Without E.M Safety */}
                <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 mb-3">
                  <div className="flex items-center gap-2 text-slate-800 font-sans text-[12px] font-bold uppercase tracking-wider mb-1.5">
                    <AlertOctagon className="w-4 h-4 text-[#155bb0]" />
                    <span>SENZA PRESIDIO TECNICO QUALIFICATO</span>
                  </div>
                  <p className="font-mono font-bold text-[#0b2545] text-[13.5px] mb-1">
                    {item.withoutUs.penalty}
                  </p>
                  <p className="font-sans text-[12.5px] text-slate-600 leading-relaxed">
                    {item.withoutUs.risk}
                  </p>
                </div>

                {/* Scenario 2: With E.M Safety */}
                <div className="bg-[#e8f1fc]/70 border border-[#cfe3f8] rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-[#0b2545] font-sans text-[12px] font-bold uppercase tracking-wider mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#155bb0]" />
                    <span>CON METODOLOGIA E.M SAFETY S.R.L.</span>
                  </div>
                  <p className="font-sans font-bold text-[#0b2545] text-[14px] mb-1">
                    {item.withUs.solution}
                  </p>
                  <p className="font-sans text-[12.5px] text-slate-600 leading-relaxed">
                    {item.withUs.benefit}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Executive Dark Blue Banner with INAIL OT23 & Action */}
        <div className="bg-[#0b2545] text-white border border-blue-900 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#1e6fd9]/40 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-7 h-7 text-[#1e6fd9]" />
            </div>
            <div>
              <h4 className="font-serif text-[22px] font-bold text-white mb-1">
                La sicurezza genera profitto: Modello INAIL OT23
              </h4>
              <p className="font-sans text-[14.5px] text-slate-200 max-w-2xl leading-relaxed">
                Le aziende che adottano i Sistemi di Gestione Integrati (ISO 45001) e piani di miglioramento asseverati con E.M Safety possono ottenere una riduzione del tasso di premio INAIL <strong className="text-[#9ec7f0]">fino al 28% ogni anno</strong>, ammortizzando interamente i costi di consulenza.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playChime();
              onOpenConsultingQuote();
            }}
            className="w-full lg:w-auto px-8 py-4 bg-[#1e6fd9] hover:bg-[#9ec7f0] text-[#0b2545] font-sans text-[14.5px] font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>Metti la tua azienda al sicuro</span>
            <ArrowRight className="w-4 h-4 text-[#0b2545]" />
          </button>
        </div>
      </div>
    </section>
  );
}
