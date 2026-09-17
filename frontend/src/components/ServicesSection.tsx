import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import SectionLabel from './SectionLabel';
import Security360Graphic from './Security360Graphic';
import { SERVICES } from '../data/siteContent';
import { useAsset } from '../lib/assets';

interface ServicesProps {
  onNavigate: (id: string) => void;
}

export default function ServicesSection({ onNavigate }: ServicesProps) {
  const asset = useAsset();
  return (
    <section id="servizi" className="bg-white pt-24 lg:pt-28 pb-20 lg:pb-24" data-testid="services-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
          <div className="max-w-2xl">
            <SectionLabel>I Nostri Servizi</SectionLabel>
            <h2 className="font-display text-[34px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight leading-[1.08] mt-5">
              Progettiamo la vostra sicurezza,{' '}
              <span className="text-[#1e6fd9]">a 360°.</span>
            </h2>
            <p className="font-sans text-[16.5px] text-slate-600 leading-relaxed mt-5">
              Un unico partner per consulenza, sistemi di gestione, valutazioni tecniche e formazione. Soluzioni complete
              per garantire conformità, efficienza e tutela dei lavoratori.
            </p>
          </div>
          <div className="order-first lg:order-last">
            <Security360Graphic />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-[#0b2545]/30 hover:shadow-[0_20px_50px_rgba(11,37,69,0.1)] transition-all duration-300 flex flex-col"
                data-testid={`service-card-${s.id}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden" data-testid={`service-image-${s.id}`}>
                  <img
                    src={asset(s.image)}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute -bottom-7 left-6 w-16 h-16 rounded-2xl bg-[#1e6fd9] text-white flex items-center justify-center shadow-[0_10px_24px_rgba(30,111,217,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] group-hover:scale-105 transition-transform border border-[#9ec7f0]">
                    <Icon className="w-8 h-8" strokeWidth={2.2} />
                  </div>
                </div>

                <div className="p-7 pt-10 flex flex-col flex-1">
                  <h3 className="font-display text-[20px] font-bold text-[#0b2545] leading-snug">{s.title}</h3>
                  <p className="font-sans text-[13px] font-semibold text-[#155bb0] mt-1">{s.tagline}</p>
                  <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-3">{s.description}</p>

                  <ul className="mt-5 space-y-2 flex-1">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 font-sans text-[13.5px] text-slate-700">
                        <Check className="w-4 h-4 text-[#1e6fd9] mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onNavigate('contatti')}
                    data-testid={`service-cta-${s.id}`}
                    className="mt-6 inline-flex items-center gap-2 font-sans text-[13.5px] font-bold text-[#1e6fd9] hover:gap-3 transition-all cursor-pointer"
                  >
                    Richiedi informazioni
                    <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
