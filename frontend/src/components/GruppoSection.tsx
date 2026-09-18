import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';
import { useLogos, logoSrc } from '../lib/logos';
import { useText } from '../lib/content';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function GruppoSection() {
  const { logos } = useLogos('group');
  const t = useText();
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28 border-b border-neutral-200" data-testid="gruppo-section">
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl"
        >
          <SectionLabel>{t('home.gruppo.label')}</SectionLabel>
          <h2 className="font-display text-[32px] sm:text-[44px] font-extrabold text-neutral-900 tracking-tight leading-[1.08] mt-5" data-testid="gruppo-heading">
            {t('home.gruppo.title1')}
            <span className="block text-neutral-400">{t('home.gruppo.title2')}</span>
          </h2>
          <p className="font-sans text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed mt-5">
            {t('home.gruppo.description')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 mt-12 sm:mt-14 border-t border-l border-neutral-200">
          {logos.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
              className="group relative overflow-hidden border-r border-b border-neutral-200 p-6 sm:p-8 lg:p-10 hover:bg-sky-50 transition-colors duration-500 cursor-default"
              data-testid={`gruppo-card-${i}`}
            >
              <span className="tile-shine" aria-hidden="true" />
              <div className="font-sans text-[11px] font-bold tracking-[0.28em] text-neutral-400 group-hover:text-sky-700 transition-colors duration-500">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="mt-6 sm:mt-8 lg:mt-12 h-20 sm:h-24 flex items-center">
                <img
                  src={logoSrc(g.image_url)}
                  alt={g.name}
                  loading="lazy"
                  className="max-h-16 sm:max-h-20 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                  data-testid={`gruppo-logo-${i}`}
                />
              </div>
              <p className="font-sans text-[13px] text-neutral-500 leading-relaxed mt-5 sm:mt-6 transition-colors duration-500">
                {g.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
