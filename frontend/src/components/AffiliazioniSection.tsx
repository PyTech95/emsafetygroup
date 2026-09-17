import { motion } from 'motion/react';
import SectionLabel from './SectionLabel';
import { useAsset } from '../lib/assets';

const AFFILIATIONS = [
  {
    src: '/assets/images/anfos.png',
    name: 'ANFOS',
    desc: 'Centro di Formazione — Associazione Nazionale Formatori della Sicurezza sul Lavoro (L. 4/2013).',
  },
  {
    src: '/assets/images/opn.png',
    name: 'O.P.N. Italia Lavoro',
    desc: 'Organismo Paritetico Nazionale per la salute e sicurezza nei luoghi di lavoro.',
  },
  {
    src: '/assets/images/dan.png',
    name: 'DAN Partner',
    desc: 'Partner ufficiale Divers Alert Network per la sicurezza e il primo soccorso.',
  },
];

export default function AffiliazioniSection() {
  const asset = useAsset();
  return (
    <section id="affiliazioni" className="bg-slate-50 py-20 lg:py-24 border-y border-slate-200/70" data-testid="affiliazioni-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <SectionLabel>Affiliazioni &amp; Accreditamenti</SectionLabel>
          <h2 className="font-display text-[32px] sm:text-[42px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1] mt-5">
            Riconosciuti dagli enti che{' '}
            <span className="text-[#1e6fd9]">contano davvero.</span>
          </h2>
          <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-4">
            La nostra qualità è certificata da affiliazioni e accreditamenti con i principali enti nazionali della
            formazione e della sicurezza sul lavoro.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AFFILIATIONS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group bg-white rounded-3xl border border-slate-200 p-8 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(11,37,69,0.05)] hover:shadow-[0_20px_50px_rgba(11,37,69,0.12)] hover:-translate-y-1.5 transition-all duration-300"
              data-testid={`affiliazione-card-${i}`}
            >
              <div className="h-28 w-full flex items-center justify-center mb-5">
                <img
                  src={asset(a.src)}
                  alt={`${a.name} — affiliazione E.M Safety`}
                  loading="lazy"
                  data-testid={`affiliazione-logo-${i}`}
                  className="max-h-24 max-w-full sm:max-w-[220px] w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 [filter:drop-shadow(0_3px_8px_rgba(23,23,23,0.15))] transition-[opacity,transform] duration-300"
                />
              </div>
              <h3 className="font-display text-[18px] font-bold text-[#0b2545]">{a.name}</h3>
              <p className="font-sans text-[13.5px] text-slate-500 leading-relaxed mt-2 max-w-xs">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
