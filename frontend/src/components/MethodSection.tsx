import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';
import { METHOD, IMAGES } from '../data/siteContent';
import { useAsset } from '../lib/assets';

export default function MethodSection() {
  const asset = useAsset();
  return (
    <section id="metodo" className="relative bg-[#f0f9ff] py-24 lg:py-28 overflow-hidden" data-testid="method-section">
      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left intro + image */}
          <div className="min-w-0 lg:col-span-5">
            <SectionLabel>Il Nostro Metodo</SectionLabel>
            <h2 className="font-display text-[34px] sm:text-[44px] font-extrabold text-neutral-900 tracking-tight leading-[1.08] mt-5">
              Dall&apos;analisi alla conformità, un percorso trasparente.
            </h2>
            <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-5">
              Un approccio chiaro in cinque fasi, basato su ascolto, competenza tecnica e soluzioni su misura, senza
              sorprese e senza costi occulti.
            </p>
            <div className="mt-8 rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-xl">
              <img
                src={asset(IMAGES.team)}
                alt="Team di consulenti E.M Safety in un impianto industriale"
                className="w-full h-[260px] object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right steps */}
          <div className="min-w-0 lg:col-span-7 relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-sky-200 hidden sm:block" />
            <div className="space-y-5">
              {METHOD.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="relative w-full min-w-0 flex items-start gap-4 sm:gap-5 bg-white hover:bg-sky-50 border border-sky-100 rounded-2xl shadow-sm p-4 sm:p-6 transition-colors"
                    data-testid={`method-step-${i}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-sky-200 text-[#1e6fd9] flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#1e6fd9] text-white text-[13px] font-display font-extrabold flex items-center justify-center shadow-md">
                        {i + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 break-words">
                      <h3 data-testid={`method-step-title-${i}`} className="font-display text-[18px] sm:text-[19px] font-bold text-white">{step.title}</h3>
                      <p data-testid={`method-step-description-${i}`} className="font-sans text-[14px] text-slate-600 leading-relaxed mt-1.5">{step.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
