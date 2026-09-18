import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';
import { useLogos, logoSrc } from '../lib/logos';
import { useText } from '../lib/content';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ClientiSection() {
  const { logos } = useLogos('clients');
  const t = useText();
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28 border-b border-neutral-200" data-testid="clienti-section">
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl"
        >
          <SectionLabel>{t('home.clienti.label')}</SectionLabel>
          <h2 className="font-display text-[32px] sm:text-[44px] font-extrabold text-neutral-900 tracking-tight leading-[1.08] mt-5" data-testid="clienti-heading">
            {t('home.clienti.title')}
          </h2>
          <p className="font-sans text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed mt-5">
            {t('home.clienti.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-12 sm:mt-14 border-t border-l border-neutral-200" data-testid="clienti-grid">
          {logos.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: EASE, delay: (i % 4) * 0.07 }}
              className="group relative border-r border-b border-neutral-200 px-4 sm:px-6 py-8 sm:py-10 lg:py-12 flex items-center justify-center hover:bg-sky-50 transition-colors duration-400 cursor-default overflow-hidden"
              data-testid={`client-${i}`}
            >
              <span className="tile-shine" aria-hidden="true" />
              {c.dark ? (
                <div className="bg-neutral-900 rounded-xl px-4 py-2.5 shadow-[0_6px_16px_rgba(23,23,23,0.25)] group-hover:scale-105 transition-transform duration-400">
                  <img src={logoSrc(c.image_url)} alt={c.name} loading="lazy" className="max-h-10 sm:max-h-12 w-auto max-w-full object-contain" data-testid={`client-logo-${i}`} />
                </div>
              ) : (
                <img
                  src={logoSrc(c.image_url)}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-12 sm:max-h-14 lg:max-h-[68px] w-auto max-w-[82%] object-contain group-hover:scale-105 transition-transform duration-400"
                  data-testid={`client-logo-${i}`}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
