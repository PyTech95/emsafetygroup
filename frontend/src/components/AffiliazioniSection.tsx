import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';
import { useLogos, logoSrc } from '../lib/logos';
import { useText } from '../lib/content';

export default function AffiliazioniSection() {
  const { logos } = useLogos('affiliations');
  const t = useText();
  return (
    <section id="affiliazioni" className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-y border-slate-200/70" data-testid="affiliazioni-section">
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <SectionLabel>{t('home.affil.label')}</SectionLabel>
          <h2 className="font-display text-[30px] sm:text-[42px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1] mt-5">
            {t('home.affil.title1')}{' '}
            <span className="text-[#1e6fd9]">{t('home.affil.title2')}</span>
          </h2>
          <p className="font-sans text-[15px] sm:text-[16px] text-slate-600 leading-relaxed mt-4">
            {t('home.affil.description')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {logos.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(11,37,69,0.05)] hover:shadow-[0_20px_50px_rgba(11,37,69,0.12)] hover:-translate-y-1.5 transition-all duration-300"
              data-testid={`affiliazione-card-${i}`}
            >
              <span className="tile-shine" aria-hidden="true" />
              <div className="h-24 sm:h-28 w-full flex items-center justify-center mb-5">
                <img
                  src={logoSrc(a.image_url)}
                  alt={`${a.name} — affiliazione E.M Safety`}
                  loading="lazy"
                  data-testid={`affiliazione-logo-${i}`}
                  className="max-h-20 sm:max-h-24 max-w-full sm:max-w-[220px] w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-[opacity,transform] duration-300"
                />
              </div>
              <h3 className="font-display text-[18px] font-bold text-[#0b2545]">{a.name}</h3>
              <p className="font-sans text-[13.5px] text-slate-500 leading-relaxed mt-2 max-w-xs">{a.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
