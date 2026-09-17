import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';
import { CLIENTS } from '../data/siteContent';
import { useAsset } from '../lib/assets';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ClientiSection() {
  const asset = useAsset();
  return (
    <section className="bg-white py-24 lg:py-28 border-b border-neutral-200" data-testid="clienti-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl"
        >
          <SectionLabel>I Nostri Clienti</SectionLabel>
          <h2 className="font-display text-[34px] sm:text-[44px] font-extrabold text-neutral-900 tracking-tight leading-[1.08] mt-5" data-testid="clienti-heading">
            Hanno creduto in noi.
          </h2>
          <p className="font-sans text-[16px] text-neutral-600 leading-relaxed mt-5">
            Aziende che ci hanno scelto per la sicurezza, la formazione e i sistemi di gestione — e che continuano a lavorare con noi.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 mt-14 border-t border-l border-neutral-200" data-testid="clienti-grid">
          {CLIENTS.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: EASE, delay: (i % 3) * 0.07 }}
              className="group border-r border-b border-neutral-200 px-6 py-10 lg:py-12 flex items-center justify-center hover:bg-sky-50 transition-colors duration-400 cursor-default"
              data-testid={`client-${i}`}
            >
              {c.logo ? (
                c.dark ? (
                  <div className="bg-neutral-900 rounded-xl px-4 py-2.5 shadow-[0_6px_16px_rgba(23,23,23,0.25)] group-hover:scale-105 transition-transform duration-400">
                    <img
                      src={asset(c.logo)}
                      alt={c.name}
                      loading="lazy"
                      className="max-h-10 sm:max-h-12 w-auto max-w-full object-contain"
                      data-testid={`client-logo-${i}`}
                    />
                  </div>
                ) : (
                  <img
                    src={asset(c.logo)}
                    alt={c.name}
                    loading="lazy"
                    className="max-h-14 sm:max-h-[68px] w-auto max-w-[80%] object-contain [filter:drop-shadow(0_3px_8px_rgba(23,23,23,0.15))] group-hover:scale-105 transition-transform duration-400"
                    data-testid={`client-logo-${i}`}
                  />
                )
              ) : (
                <span className="font-display text-[17px] sm:text-[20px] lg:text-[22px] font-light uppercase tracking-[0.14em] text-neutral-500 group-hover:text-[#155bb0] text-center transition-colors duration-400 [filter:drop-shadow(0_2px_6px_rgba(23,23,23,0.12))]">
                  {c.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
