import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Quote, ShieldCheck, Award, BadgeCheck, Medal, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';

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
  const navigate = useNavigate();
  return (
    <>
      <PageHero
        label="Testimonianze"
        title="Testimonianze autentiche dai"
        highlight="clienti soddisfatti."
        subtitle="Progetti reali di consulenza e formazione: come abbiamo aiutato le aziende a raggiungere conformità, efficienza e piena tutela dei lavoratori."
      />

      {/* Highlighted testimonial */}
      <section className="bg-white py-20 lg:py-24" data-testid="testimonianze-quote">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative bg-[#0b2545] rounded-[28px] p-10 lg:p-14 text-white shadow-2xl overflow-hidden"
          >
            <Quote className="w-14 h-14 text-[#1e6fd9]/30 absolute top-6 right-8" />
            <p className="font-display text-[22px] sm:text-[28px] font-bold leading-snug tracking-tight relative z-10">
              "La nostra collaborazione con E.M Safety ha garantito soluzioni precise e conformi, migliorando
              significativamente la sicurezza aziendale."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1593757147298-e064ed1419e5?fit=crop&crop=entropy%2Cfaces&auto=format%2Ccompress&w=96&h=96"
                alt="Marco Rossi"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#1e6fd9]/50"
                loading="lazy"
              />
              <div>
                <div className="font-display text-[17px] font-bold">Marco Rossi</div>
                <div className="font-sans text-[13px] text-[#9ec7f0]">Responsabile Sicurezza Aziendale</div>
              </div>
            </div>
          </motion.div>
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
              Affidabilità comprovata,{' '}
              <span className="text-[#1e6fd9]">sicurezza garantita.</span>
            </h2>
            <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-4">
              Le nostre certificazioni principali e i riconoscimenti ottenuti nel settore testimoniano la nostra
              professionalità e serietà.
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
          <button
            onClick={() => navigate('/contatti')}
            data-testid="testimonianze-cta"
            className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Diventa il prossimo caso di successo
            <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
          </button>
        </div>
      </section>
    </>
  );
}
