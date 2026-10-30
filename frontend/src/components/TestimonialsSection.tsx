import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SectionLabel from './SectionLabel';
import TestimonialCard from './TestimonialCard';
import { useTestimonials } from '../lib/testimonials';
import { useText } from '../lib/content';

/** Home: fino a 3 testimonianze (in evidenza per prime). Non compare finché non ce n'è almeno una. */
export default function TestimonialsSection() {
  const items = useTestimonials();
  const t = useText();
  if (!items || items.length === 0) return null;
  const shown = items.slice(0, 3);
  return (
    <section className="bg-slate-50 py-20 lg:py-24 border-t border-slate-200" data-testid="home-testimonials">
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <SectionLabel>{t('home.testimonials.label')}</SectionLabel>
            <h2 className="font-display text-[30px] sm:text-[40px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1] mt-4">{t('home.testimonials.title')}</h2>
          </div>
          <Link to="/testimonianze" onClick={() => window.scrollTo({ top: 0 })} className="inline-flex items-center gap-2 font-sans text-[14px] font-bold text-[#155bb0] hover:gap-3 transition-all">
            {t('home.testimonials.cta')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className={`grid gap-5 lg:gap-6 ${shown.length === 1 ? 'max-w-2xl' : shown.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {shown.map((x, i) => (
            <motion.div key={x.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay: i * 0.08 }}>
              <TestimonialCard t={x} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
