import PageHero from '../components/PageHero';
import FaqSection from '../components/FaqSection';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Cpu } from 'lucide-react';

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
  return (
    <>
      <PageHero
        label="FAQ & Chiarimenti"
        title="Domande frequenti su"
        highlight="sicurezza e salute sul lavoro."
        subtitle="Risposte chiare e professionali alle principali domande relative ai nostri servizi di sicurezza sul lavoro."
      />

      <FaqSection />

      {/* Challenges */}
      <section className="bg-slate-50 py-20 lg:py-24 border-t border-slate-200" data-testid="faq-challenges">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="font-display text-[30px] sm:text-[40px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1]">
              Affrontare le sfide reali della{' '}
              <span className="text-[#1e6fd9]">sicurezza sul lavoro.</span>
            </h2>
            <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-4">
              Identifichiamo i problemi più frequenti in azienda e spieghiamo come i nostri servizi garantiscano
              soluzioni efficaci e conformi.
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
            className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 bg-[#1e6fd9] hover:bg-[#9ec7f0] text-[#0b2545] font-sans text-[14px] font-bold rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Richiedi una consulenza personalizzata
          </button>
        </div>
      </section>
    </>
  );
}
