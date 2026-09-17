import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';
import { useAsset } from '../lib/assets';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const GROUP = [
  { logo: '/assets/images/group/sarmed-safety.png', alt: 'SA.R.M.ED Safety', text: 'Consulenza e formazione per la sicurezza sul lavoro, D.Lgs 81/08.' },
  { logo: '/assets/images/group/cruscotto-sgi.png', alt: 'Cruscotto SGI', text: 'La piattaforma digitale per governare i Sistemi di Gestione Integrati.' },
  { logo: '/assets/images/group/sarmed-engineering.png', alt: 'SA.R.M.ED Engineering', text: 'Ingegneria e progettazione tecnica al servizio dell\u2019impresa.' },
  { logo: '/assets/images/group/em-consulting.png', alt: 'EM Consulting', text: 'Advisory strategico, conformità normativa e sviluppo organizzativo.' },
];

export default function GruppoSection() {
  const asset = useAsset();
  return (
    <section className="bg-white py-24 lg:py-28 border-b border-neutral-200" data-testid="gruppo-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl"
        >
          <SectionLabel>Il Gruppo</SectionLabel>
          <h2 className="font-display text-[34px] sm:text-[44px] font-extrabold text-neutral-900 tracking-tight leading-[1.08] mt-5" data-testid="gruppo-heading">
            Un ecosistema di competenze,
            <span className="block text-neutral-400">un unico interlocutore.</span>
          </h2>
          <p className="font-sans text-[16px] text-neutral-600 leading-relaxed mt-5">
            E.M Safety fa parte di un gruppo di realtà specializzate che coprono ogni area dell&apos;impresa:
            sicurezza, sistemi di gestione, ingegneria e consulenza strategica.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 mt-14 border-t border-l border-neutral-200">
          {GROUP.map((g, i) => (
            <motion.div
              key={g.alt}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
              className="group relative border-r border-b border-neutral-200 p-8 lg:p-10 hover:bg-sky-50 transition-colors duration-500 cursor-default"
              data-testid={`gruppo-card-${i}`}
            >
              <div className="font-sans text-[11px] font-bold tracking-[0.28em] text-neutral-400 group-hover:text-sky-700 transition-colors duration-500">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="mt-8 lg:mt-12 h-24 flex items-center">
                <img
                  src={asset(g.logo)}
                  alt={g.alt}
                  loading="lazy"
                  className="max-h-20 w-auto max-w-full object-contain [filter:drop-shadow(0_4px_10px_rgba(23,23,23,0.18))] transition-all duration-500 group-hover:scale-[1.04] group-hover:[filter:drop-shadow(0_8px_16px_rgba(30,111,217,0.3))]"
                  data-testid={`gruppo-logo-${i}`}
                />
              </div>
              <p className="font-sans text-[13px] text-neutral-500 leading-relaxed mt-6 transition-colors duration-500">
                {g.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
