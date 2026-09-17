import { motion } from 'motion/react';
import { Layers, Search, Users, RefreshCw, BarChart3 } from 'lucide-react';
import SectionLabel from './SectionLabel';

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
  return (
    <section id="sgi" className="bg-slate-50 py-20 lg:py-24 border-b border-slate-200" data-testid="sgi-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <SectionLabel>Il Gruppo</SectionLabel>
          <h2 className="font-display text-[32px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1] mt-5">
            Costruiamo Sistemi di Gestione Integrati che le aziende usano,{' '}
            <span className="text-[#1e6fd9]">creando valore aggiunto, non solo conformità.</span>
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
                className="bg-white rounded-3xl border border-slate-200 p-7 shadow-[0_10px_30px_rgba(11,37,69,0.05)] hover:shadow-[0_18px_44px_rgba(11,37,69,0.1)] hover:-translate-y-1 transition-all duration-300"
                data-testid={`sgi-point-${i}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0b2545] text-[#1e6fd9] flex items-center justify-center mb-5">
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
              I nostri servizi assicurano conformità normativa e protezione della salute dei dipendenti. Dietro ogni
              soluzione su misura c'è una <span className="text-[#9ec7f0] font-semibold">rete di professionisti
              specializzati</span>, selezionati per competenza ed esperienza nei rispettivi ambiti.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
