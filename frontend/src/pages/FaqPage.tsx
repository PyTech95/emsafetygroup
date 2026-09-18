import PageHero from '../components/PageHero';
import FaqSection from '../components/FaqSection';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Cpu } from 'lucide-react';
import { useText } from '../lib/content';

const CHALLENGES = [
  {
    icon: ShieldCheck,
    title: 'Valutazione personalizzata dei rischi',
    text: 'Un\u2019analisi dettagliata per identificare e mitigare rapidamente i rischi specifici del tuo ambiente lavorativo.',
  },
  {
    icon: Users,
    title: 'Formazione e aggiornamento professionale',
    text: 'Corsi su misura per migliorare la consapevolezza e le competenze in materia di sicurezza sul posto di lavoro.',
  },
  {
    icon: Cpu,
    title: 'Sistemi di sicurezza avanzati',
    text: 'Soluzioni tecnologiche innovative per trasformare la gestione della sicurezza in un processo efficiente e proattivo.',
  },
];

export default function FaqPage() {
  const navigate = useNavigate();
  const t = useText();
  return (
    <>
      <PageHero
        label={t('page.faq.label')}
        title={t('page.faq.title')}
        highlight={t('page.faq.highlight')}
        subtitle={t('page.faq.subtitle')}
      />

      <FaqSection />

      {/* Challenges */}
      <section className="bg-slate-50 py-20 lg:py-24 border-t border-slate-200" data-testid="faq-challenges">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="font-display text-[30px] sm:text-[40px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1]">
              {t('page.faq.challengesTitle1')}{' '}
              <span className="text-[#1e6fd9]">{t('page.faq.challengesTitle2')}</span>
            </h2>
            <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-4">
              {t('page.faq.challengesDescription')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHALLENGES.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-slate-200 p-7 shadow-[0_10px_30px_rgba(11,37,69,0.05)]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0b2545] text-[#1e6fd9] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-[18px] font-bold text-[#0b2545]">{c.title}</h3>
                  <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-2">{c.text}</p>
                </motion.div>
              );
            })}
          </div>
          <button
            onClick={() => navigate('/contatti')}
            data-testid="faq-contact-cta"
            className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 bg-[#1e6fd9] hover:bg-[#155bb0] text-white font-sans text-[14px] font-bold rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            {t('page.faq.cta')}
          </button>
        </div>
      </section>
    </>
  );
}
