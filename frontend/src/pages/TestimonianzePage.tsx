import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Quote, ShieldCheck, Award, BadgeCheck, Medal, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import TestimonialCard, { FeaturedTestimonial } from '../components/TestimonialCard';
import { useTestimonials } from '../lib/testimonials';
import { useText } from '../lib/content';

const CASES = [
  {
    title: 'Un\u2019impresa che ha migliorato la conformità normativa con successo',
    text: 'Analizziamo come un\u2019azienda ha superato le sfide di sicurezza sul lavoro adottando le nostre soluzioni personalizzate, migliorando efficienza e tutela dei dipendenti.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?fit=crop&crop=entropy%2Cfaces&auto=format%2Ccompress&w=1280',
  },
  {
    title: 'Costruire un futuro sicuro con soluzioni su misura e competenza',
    text: 'Questo caso evidenzia il superamento degli ostacoli nella gestione della sicurezza, con strategie efficaci e risultati tangibili per l\u2019azienda.',
    image: 'https://images.unsplash.com/photo-1596075780750-81249df16d19?fit=crop&crop=entropy%2Cfaces&auto=format%2Ccompress&w=1280',
  },
  {
    title: 'Innovare la sicurezza aziendale con strumenti affidabili',
    text: 'Mostriamo come un\u2019azienda ha implementato i nostri servizi per migliorare i processi, ridurre i rischi e garantire conformità alle normative vigenti.',
    image: 'https://images.unsplash.com/photo-1600600457585-570c2eb88b89?fit=crop&crop=entropy%2Cfaces&auto=format%2Ccompress&w=1280',
  },
];

const CERTS = [
  { icon: ShieldCheck, title: 'Certificazione ISO 45001', text: 'Attesta il nostro impegno nel garantire standard elevati di sicurezza e salute sul lavoro, fondamentale per la protezione dei dipendenti.' },
  { icon: Award, title: 'Premio Innovazione Sicurezza', text: 'Riconoscimento per le soluzioni innovative implementate, che migliorano l\u2019efficacia delle misure di sicurezza aziendali.' },
  { icon: BadgeCheck, title: 'Marchio CE per dispositivi', text: 'Certificazione che attesta la conformità dei nostri prodotti alle normative europee, assicurando qualità e affidabilità.' },
  { icon: Medal, title: 'Certificazione OHSAS 18001', text: 'Dimostra il nostro sistema di gestione della sicurezza, orientato a migliorare continuamente le condizioni di lavoro.' },
];

export default function TestimonianzePage() {
  const t = useText();
  const items = useTestimonials();
  return (
    <>
      <PageHero
        label={t('page.test.label')}
        title={t('page.test.title')}
        highlight={t('page.test.highlight')}
        subtitle={t('page.test.subtitle')}
      />

      {/* Testimonianze dal pannello admin */}
      <section className="bg-white py-16 lg:py-24" data-testid="testimonianze-list">
        <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          {items === null && <div className="max-w-[900px] mx-auto h-64 rounded-[28px] bg-slate-100 animate-pulse" />}
          {items && items.length === 0 && (
            <div className="max-w-[760px] mx-auto text-center rounded-3xl border-2 border-dashed border-slate-200 px-6 py-12" data-testid="testimonianze-empty">
              <Quote className="w-10 h-10 text-[#1e6fd9] mx-auto mb-4" />
              <h2 className="font-display text-[22px] font-bold text-[#0b2545]">Hai lavorato con noi?</h2>
              <p className="font-sans text-[15px] text-slate-600 mt-2 leading-relaxed">Raccontaci la tua esperienza con E.M Safety: pubblicheremo qui le testimonianze dei nostri clienti.</p>
              <Link to="/contatti" onClick={() => window.scrollTo({ top: 0 })} className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b2545] text-white font-sans text-[14px] font-bold">Scrivici <ArrowRight className="w-4 h-4 text-[#1e6fd9]" /></Link>
            </div>
          )}
          {items && items.length > 0 && (
            <>
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }} className="max-w-[900px] mx-auto">
                <FeaturedTestimonial t={items[0]} />
              </motion.div>
              {items.length > 1 && (
                <div className={`grid sm:grid-cols-2 gap-5 lg:gap-6 mt-10 lg:mt-14 ${items.length - 1 <= 2 ? 'max-w-[900px] mx-auto' : 'lg:grid-cols-3'}`}>
                  {items.slice(1).map((t, i) => (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}>
                      <TestimonialCard t={t} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-slate-50 py-20 lg:py-24 border-y border-slate-200" data-testid="testimonianze-cases">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_10px_30px_rgba(11,37,69,0.05)] hover:shadow-[0_20px_50px_rgba(11,37,69,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-[18px] font-bold text-[#0b2545] leading-snug">{c.title}</h3>
                  <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-3 flex-1">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-white py-20 lg:py-24" data-testid="testimonianze-certs">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="font-display text-[30px] sm:text-[40px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1]">
              {t('page.test.certsTitle1')}{' '}
              <span className="text-[#1e6fd9]">{t('page.test.certsTitle2')}</span>
            </h2>
            <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-4">
              {t('page.test.certsDescription')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-6"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0b2545] text-[#1e6fd9] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-[16px] font-bold text-[#0b2545] leading-snug">{c.title}</h3>
                  <p className="font-sans text-[13px] text-slate-500 leading-relaxed mt-2">{c.text}</p>
                </motion.div>
              );
            })}
          </div>
          <Link to="/contatti"
            onClick={() => window.scrollTo({ top: 0 })}
            data-testid="testimonianze-cta"
            className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {t('page.test.cta')}
            <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
          </Link>
        </div>
      </section>
    </>
  );
}
