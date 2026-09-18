import { motion } from 'motion/react';
import { useText } from '../lib/content';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SectionChapterProps {
  number: string;
  title: string;
  dark?: boolean;
}

export default function SectionChapter({ number, title, dark = false }: SectionChapterProps) {
  const t = useText();
  return (
    <div
      className={`border-b ${dark ? 'bg-neutral-950 text-white border-white/10' : 'bg-white text-neutral-900 border-neutral-200'}`}
      data-testid={`chapter-${number}`}
    >
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-4 sm:gap-6 min-w-0"
        >
          <span className="w-1 h-9 rounded-full bg-[#1e6fd9] shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <span
              data-testid={`chapter-title-${number}`}
              className={`block font-display text-base md:text-lg font-semibold tracking-tight ${dark ? 'text-white' : 'text-[#0b2545]'}`}
            >
              {t(`chapter.${number}.title`) === `chapter.${number}.title` ? title : t(`chapter.${number}.title`)}
            </span>
            <span className={`block mt-1 font-sans text-xs ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {t(`chapter.${number}.subtitle`) === `chapter.${number}.subtitle` ? '' : t(`chapter.${number}.subtitle`)}
            </span>
          </div>
        </motion.div>
        <span
          className={`hidden md:block font-sans text-[10px] uppercase tracking-[0.32em] ${
            dark ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          E.M Safety — Manifesto
        </span>
      </div>
    </div>
  );
}
