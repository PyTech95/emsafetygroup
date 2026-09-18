import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { IMAGES, VALUES } from '../data/siteContent';
import { useAsset } from '../lib/assets';
import { useText } from '../lib/content';
import Sparkles from './Sparkles';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface HeroProps {
  onNavigate: (id: string) => void;
}

function MaskedLine({ children, delay, shimmer = false }: { children: string; delay: number; shimmer?: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
      <motion.span
        initial={{ y: '112%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.05, ease: EASE, delay }}
        className={`block will-change-transform ${shimmer ? 'text-shimmer' : ''}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroSection({ onNavigate }: HeroProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['10%', '-16%']);
  const asset = useAsset();
  const t = useText();

  return (
    <section id="hero" className="relative pt-[80px] sm:pt-[104px] lg:pt-[120px] overflow-hidden bg-white" data-testid="hero-section">
      {/* Subtle monochrome grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
        <Sparkles />
      </div>

      <div className="relative max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-10 lg:pt-12 lg:pb-24">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 lg:gap-8 xl:gap-12 items-center" data-testid="hero-layout">
          {/* Left copy */}
          <div className="min-w-0" data-testid="hero-copy">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <SectionLabel>{t('home.hero.label')}</SectionLabel>
            </motion.div>
            <h1
              className="font-display text-neutral-900 font-extrabold leading-[1.06] text-[34px] sm:text-[48px] lg:text-[42px] xl:text-[54px] 2xl:text-[62px] mt-5 tracking-tight"
              data-testid="hero-heading"
            >
              <MaskedLine delay={0.3}>{t('home.hero.title1')}</MaskedLine>
              <MaskedLine delay={0.45} shimmer>
                {t('home.hero.title2')}
              </MaskedLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
              className="font-sans text-[15px] sm:text-[16px] 2xl:text-[18px] text-neutral-700 leading-relaxed mt-5 max-w-xl"
              data-testid="hero-description"
            >
              {t('home.hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
              className="flex flex-wrap gap-3 mt-7"
            >
              <button
                onClick={() => onNavigate('contatti')}
                data-testid="hero-cta-quote"
                className="btn-shine group inline-flex max-w-full items-center justify-center gap-2 px-5 py-3.5 bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-sans text-[14px] font-bold rounded-full shadow-lg transition-[background-color,transform] active:scale-95 cursor-pointer"
              >
                <span>{t('home.hero.cta1')}</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('servizi')}
                data-testid="hero-cta-services"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-100 text-neutral-800 font-sans text-[14.5px] font-bold rounded-full border border-neutral-300 transition-all cursor-pointer"
              >
                {t('home.hero.cta2')}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-7 text-neutral-500 font-sans text-[12px]"
            >
              <span className="inline-flex items-center gap-2" data-testid="hero-compliance">
                <ShieldCheck className="w-4 h-4 text-[#1e6fd9]" /> {t('home.hero.badge1')}
              </span>
              <span className="inline-flex items-center gap-2" data-testid="hero-offices">
                <PhoneCall className="w-4 h-4 text-[#1e6fd9]" /> {t('home.hero.badge2')}
              </span>
            </motion.div>
          </div>

          {/* Right image — parallax spotlight frame */}
          <motion.div
            ref={mediaRef}
            initial={{ opacity: 0, scale: 0.965 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="relative min-w-0"
            data-testid="hero-media"
          >
            <div
              className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/2] overflow-hidden border border-neutral-200 shadow-xl"
              data-testid="hero-image-container"
            >
              <motion.img
                src={asset(IMAGES.hero)}
                alt="Piazza Gae Aulenti, Milano — sede operativa E.M Safety"
                loading="eager"
                fetchPriority="high"
                width={1917}
                height={763}
                data-testid="hero-image"
                style={{ y: imgY }}
                className="absolute inset-0 w-full h-full object-cover object-center scale-[1.18] will-change-transform"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-transparent to-black/10" />
            </div>
            <motion.div
              style={{ y: cardY }}
              className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white px-4 py-3 border border-neutral-200 shadow-lg max-w-[220px] will-change-transform"
              data-testid="hero-compliance-stat"
            >
              <div className="font-display text-[28px] font-extrabold text-[#0b2545] leading-none">{t('home.hero.stat')}</div>
              <div className="font-sans text-[12px] text-neutral-600 mt-1 leading-snug">
                {t('home.hero.statText')}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Value props band */}
      <div className="relative bg-white">
        <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-14 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_10px_30px_rgba(11,37,69,0.06)] hover:shadow-[0_16px_40px_rgba(11,37,69,0.1)] hover:-translate-y-1 transition-[transform,box-shadow] duration-300 group"
                  data-testid={`value-card-${i}`}
                >
                  <span className="tile-shine" aria-hidden="true" />
                  <div className="w-11 h-11 rounded-xl bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#1e6fd9] mb-4 group-hover:bg-[#1e6fd9] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-[17px] font-bold text-[#0b2545]">{t(`values.${i}.title`)}</h3>
                  <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed mt-1.5">{t(`values.${i}.text`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
