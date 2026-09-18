import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { WHY, IMAGES } from '../data/siteContent';
import { useAsset } from '../lib/assets';
import { useText } from '../lib/content';

interface WhyProps {
  onNavigate: (id: string) => void;
}

export default function WhyChooseSection({ onNavigate }: WhyProps) {
  const asset = useAsset();
  const t = useText();
  return (
    <section id="perche-noi" className="bg-slate-50 py-20 sm:py-24 lg:py-28 border-y border-slate-200" data-testid="why-section">
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-1"
          >
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-slate-200">
              <img
                src={asset(IMAGES.training)}
                alt="Aula di formazione E.M Safety"
                className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute mt-[-56px] ml-6 bg-[#0b2545] text-white rounded-2xl px-5 py-4 shadow-xl border border-[#1e6fd9]/40 inline-flex items-center gap-4">
              <div>
                <div className="font-display text-[26px] font-extrabold text-[#1e6fd9] leading-none">2</div>
                <div className="font-sans text-[11.5px] text-slate-300 mt-1">sedi operative</div>
              </div>
              <div className="w-px h-9 bg-white/15" />
              <div>
                <div className="font-display text-[26px] font-extrabold text-[#1e6fd9] leading-none">ATECO</div>
                <div className="font-sans text-[11.5px] text-slate-300 mt-1">ogni settore</div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-7 order-2">
            <SectionLabel>{t('home.why.label')}</SectionLabel>
            <h2 className="font-display text-[30px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight leading-[1.08] mt-5">
              {t('home.why.title')}
            </h2>
            <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-5 max-w-xl">
              {t('home.why.description')}
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-9">
              {WHY.map((w, i) => {
                const Icon = w.icon;
                return (
                  <motion.div
                    key={w.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                    className="flex items-start gap-4"
                    data-testid={`why-item-${i}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#0b2545] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-[16.5px] font-bold text-[#0b2545]">{t(`why.${i}.title`)}</h3>
                      <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed mt-1">{t(`why.${i}.text`)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('contatti')}
              data-testid="why-cta-quote"
              className="group mt-10 inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14.5px] font-bold rounded-full shadow-lg transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer"
            >
              {t('home.why.cta')}
              <ArrowRight className="w-4 h-4 text-[#1e6fd9] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
