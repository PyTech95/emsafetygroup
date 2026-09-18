import { motion } from 'motion/react';
import { Layers, Search, Users, RefreshCw, BarChart3 } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { useText } from '../lib/content';

const POINTS = [
  {
    icon: Layers,
    title: 'Sistemi di Gestione Integrati (SGI)',
    text: 'Progettiamo e implementiamo sistemi integrati Qualità, Ambiente, Energia e Sicurezza — costruiti per essere usati, non solo certificati.',
  },
  {
    icon: Search,
    title: 'Audit e verifiche ispettive',
    text: 'Conduciamo audit interni ed esterni per misurare l\u2019efficacia reale del sistema di gestione, identificare le aree di miglioramento e anticipare le non conformità.',
  },
  {
    icon: Users,
    title: 'Cultura organizzativa e coinvolgimento',
    text: 'Un sistema funziona quando le persone lo capiscono e lo condividono. Supportiamo le organizzazioni nel trasformare la compliance in comportamento quotidiano.',
  },
  {
    icon: RefreshCw,
    title: 'Monitoraggio normativo continuo',
    text: 'Teniamo aggiornati i nostri clienti sulle evoluzioni legislative e normative, traducendo i cambiamenti in azioni concrete per l\u2019organizzazione.',
  },
  {
    icon: BarChart3,
    title: 'KPI e misurazione delle performance',
    text: 'Definiamo indicatori di performance HSE e qualità per rendere visibile il valore generato dal sistema — non solo agli auditor, ma al management.',
  },
];

export default function SgiSection() {
  const t = useText();
  return (
    <section id="sgi" className="bg-slate-50 py-20 lg:py-24 border-b border-slate-200" data-testid="sgi-section">
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <SectionLabel>{t('home.sgi.label')}</SectionLabel>
          <h2 className="font-display text-[30px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1] mt-5">
            {t('home.sgi.title1')}{' '}
            <span className="text-[#1e6fd9]">{t('home.sgi.title2')}</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {POINTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-[0_10px_30px_rgba(11,37,69,0.05)] hover:shadow-[0_18px_44px_rgba(11,37,69,0.1)] hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
                data-testid={`sgi-point-${i}`}
              >
                <span className="tile-shine" aria-hidden="true" />
                <div className="w-12 h-12 rounded-2xl bg-[#0b2545] text-[#1e6fd9] flex items-center justify-center mb-5 group-hover:bg-[#1e6fd9] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-[18px] font-bold text-[#0b2545] leading-snug">{p.title}</h3>
                <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-2.5">{p.text}</p>
              </motion.div>
            );
          })}

          {/* Closing statement as the 6th tile */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl p-7 bg-[#0b2545] text-white flex items-center shadow-[0_18px_44px_rgba(11,37,69,0.25)]"
          >
            <p className="font-sans text-[14.5px] text-slate-200 leading-relaxed">
              {t('home.sgi.closing')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
