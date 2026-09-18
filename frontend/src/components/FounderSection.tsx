import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAsset } from '../lib/assets';
import { useText } from '../lib/content';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function FounderSection() {
  const navigate = useNavigate();
  const asset = useAsset();
  const t = useText();
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section className="relative bg-[#f0f9ff] py-20 sm:py-24 lg:py-32 overflow-hidden border-b border-sky-100" data-testid="founder-section">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#0c4a6e 1px, transparent 1px), linear-gradient(90deg, #0c4a6e 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
      </div>

      <div className="relative max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-12 lg:gap-16 items-center">
          {/* Portrait — spotlight clipped frame */}
          <motion.div
            ref={mediaRef}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative max-w-[320px] sm:max-w-md mx-auto w-full"
            data-testid="founder-media"
          >
            <div className="absolute -inset-3 border border-sky-300/60 pointer-events-none" />
            <div className="relative aspect-square overflow-hidden border border-sky-200 shadow-xl">
              <motion.img
                src={asset('/assets/images/founder.jpg')}
                alt="Il fondatore di E.M Safety — evento istituzionale CIFAL Global Network, Nazioni Unite"
                loading="lazy"
                data-testid="founder-image"
                style={{ y: imgY }}
                className="absolute inset-0 w-full h-full object-cover contrast-125 scale-[1.12] will-change-transform"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-5 bg-white px-4 py-3 border border-neutral-200" data-testid="founder-caption">
              <div className="font-display text-[13px] font-extrabold text-[#0b2545] leading-none uppercase tracking-wide">{t('home.founder.caption')}</div>
              <div className="font-sans text-[11px] text-neutral-600 mt-1">{t('home.founder.captionSub')}</div>
            </div>
          </motion.div>

          {/* Editorial copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="min-w-0"
            data-testid="founder-copy"
          >
            <Quote className="w-8 h-8 text-sky-300 mb-6" />
            <h2 className="font-display text-neutral-900 font-extrabold tracking-tight leading-[1.08] text-[30px] sm:text-[40px] lg:text-[44px]" data-testid="founder-heading">
              {t('home.founder.title1')}
              <span className="block text-neutral-400">{t('home.founder.title2')}</span>
            </h2>
            <div className="font-sans text-[14.5px] sm:text-[16px] text-neutral-600 leading-relaxed mt-6 space-y-4 max-w-xl" data-testid="founder-text">
              <p>{t('home.founder.p1')}</p>
              <p>{t('home.founder.p2')}</p>
            </div>
            <button
              onClick={() => navigate('/informazioni')}
              data-testid="founder-cta"
              className="group inline-flex items-center gap-2 mt-8 px-6 py-3.5 bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-sans text-[14px] font-bold rounded-full shadow-lg transition-[background-color,transform] active:scale-95 cursor-pointer"
            >
              {t('home.founder.cta')}
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
