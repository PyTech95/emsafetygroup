import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';

interface PageHeroProps {
  label: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  image?: string;
}

export default function PageHero({ label, title, highlight, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative bg-[#f0f9ff] pt-[132px] pb-16 lg:pb-20 overflow-hidden" data-testid="page-hero">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(#0c4a6e 1px, transparent 1px), linear-gradient(90deg, #0c4a6e 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
      </div>

      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-10 items-center ${image ? 'lg:grid-cols-2 lg:gap-16' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>{label}</SectionLabel>
            <h1 data-testid="page-hero-heading" className="font-display text-neutral-900 font-extrabold tracking-tight leading-[1.06] text-[34px] sm:text-[46px] lg:text-[54px] mt-5">
              {title} {highlight && <span className="text-shimmer">{highlight}</span>}
            </h1>
            {subtitle && (
              <p data-testid="page-hero-subtitle" className="font-sans text-[16.5px] text-slate-600 leading-relaxed mt-6 max-w-xl">{subtitle}</p>
            )}
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative rounded-[28px] overflow-hidden shadow-xl ring-1 ring-black/5"
            >
              <img data-testid="page-hero-image" src={image} alt={title} className="w-full h-[280px] lg:h-[360px] object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
