import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Target,
  Award,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Compass,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import EmSafetyLogo from './EmSafetyLogo';
import { soundFX } from '../utils/audio';

interface AboutUsSectionProps {
  onOpenQuote: (service?: string) => void;
  onExploreCourses: () => void;
  onOpenPartner?: () => void;
}

export default function AboutUsSection({
  onOpenQuote,
  onExploreCourses,
  onOpenPartner,
}: AboutUsSectionProps) {
  const [activePillar, setActivePillar] = useState<'vision' | 'method' | 'team'>('vision');

  const pillars = [
    {
      id: 'vision' as const,
      label: 'La Nostra Visione',
      icon: Compass,
      title: 'Dalla conformità obbligatoria al vantaggio competitivo reale',
      desc: 'Rifiutiamo l’approccio burocratico e cartaceo alla sicurezza. La nostra ingegneria è progettata per liberare il Datore di Lavoro dal timore di sanzioni o blocchi operativi, trasformando il presidio D.Lgs 81/08 in efficienza industriale misurabile.',
      bullets: [
        'Scudo di protezione penale e civile asseverato per Datori di Lavoro e Dirigenti',
        'Integrazione certificata nei flussi produttivi secondo le norme ISO 45001 e 9001',
        'Riduzione sistematica degli infortuni e taglio del premio assicurativo INAIL (Modello OT23)',
      ],
    },
    {
      id: 'method' as const,
      label: 'Il Metodo E.M',
      icon: Target,
      title: 'Ingegneria rigorosa sul campo e presidio continuo',
      desc: 'Ogni nostro audit nasce da rilievi tecnici strumentali diretti in reparto e in cantiere. Non usiamo modelli generici: ogni DVR, piano di emergenza e protocollo formativo è modellato sul layout specifico dell’azienda cliente.',
      bullets: [
        'Mappatura dei rischi condotta con strumentazione di precisione tarata e certificata',
        'Format didattici esperienziali aggiornati in tempo reale con il Nuovo Accordo Stato-Regioni 2026',
        'Piattaforma digitale proprietaria per il controllo in tempo reale di scadenze e deleghe',
      ],
    },
    {
      id: 'team' as const,
      label: 'Accreditamenti & Team',
      icon: Award,
      title: 'Competenza multidisciplinare e presenza territoriale diretta',
      desc: 'Una squadra di ingegneri della sicurezza, RSPP qualificati per tutti i macrosettori ATECO, medici del lavoro, tecnici della prevenzione e formatori accreditati, operativi tra il polo produttivo di Treviso e l’hub direzionale di Milano.',
      bullets: [
        'Organismo accreditato per la formazione e l’aggiornamento continuo delle figure di sicurezza',
        'Lead Auditor qualificati per Sistemi di Gestione Integrati (Qualità, Ambiente, Sicurezza)',
        'Desk operativo dedicato per assistenza tecnica e urgenze 24/7 in caso di controlli ispettivi',
      ],
    },
  ];

  const milestones = [
    { year: '2014', title: 'Fondazione nel Polo Veneto', desc: 'Nasce E.M Safety a Treviso per offrire ingegneria della sicurezza ad alta specializzazione.' },
    { year: '2018', title: 'Accreditamento Formazione', desc: 'Certificazione dei moduli didattici e apertura del centro per corsi antincendio e primo soccorso.' },
    { year: '2022', title: 'Sede Esecutiva a Milano', desc: 'Inaugurazione dell’hub strategico presso Piazza Gae Aulenti per la consulenza SGI alle grandi commesse.' },
    { year: '2026', title: 'Adeguamento 4.0 & Portale Cloud', desc: 'Lancio della suite digitale di tracciamento e adeguamento globale al nuovo Accordo Stato-Regioni 2026.' },
  ];

  return (
    <section id="chi-siamo" className="w-full py-16 lg:py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Decorative Brand Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8f1fc] rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50/70 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9]" />
              <span className="font-mono text-[11.5px] font-bold text-[#0b2545] uppercase tracking-[0.2em] block">
                PROFILO AZIENDALE &amp; IDENTITÀ
              </span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[44px] text-[#0b2545] font-bold tracking-tight">
              Chi Siamo • E.M Safety
            </h2>
          </div>

          {/* Official Slogan coupled directly with logo */}
          <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl max-w-xl shadow-xs">
            <EmSafetyLogo
              variant="navy"
              size="sm"
              showTagline={false}
              showSlogan={true}
              sloganPlacement="right"
            />
          </div>
        </div>

        {/* Narrative Split: Overview & Interactive Pillar Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column (6 cols): Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-serif text-[24px] sm:text-[30px] font-bold text-[#0b2545] leading-snug">
              Specialisti nella tutela globale del Datore di Lavoro e nello sviluppo delle persone
            </h3>

            <p className="font-sans text-[16px] text-slate-700 leading-relaxed">
              <strong>E.M Safety</strong> è una società di consulenza tecnica avanzata e formazione aziendale accreditata con sedi operative a <strong>Treviso</strong> e <strong>Milano Gae Aulenti</strong>.
            </p>

            <p className="font-sans text-[15px] text-slate-600 leading-relaxed">
              Nata dall’esperienza diretta sui cantieri industriali, nelle linee manifatturiere ad alto rischio e nei grandi hub logistici, l’azienda ha sviluppato un modello operativo proprietario che unisce la competenza normativa all’ingegneria di processo. Il nostro obiettivo è semplice: garantire la totale serenità giuridica dell’organigramma aziendale e ridurre a zero l’incidenza degli infortuni sul lavoro.
            </p>

            {/* Credential Cards */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-6 h-6 text-[#0b2545] mb-2" />
                <span className="font-serif text-[22px] font-bold text-[#0b2545] block">480+</span>
                <span className="font-sans text-[12.5px] text-slate-600 font-medium">Aziende tutelate con incarichi RSPP asseverati</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-[#9ec7f0]">
                <Award className="w-6 h-6 text-[#155bb0] mb-2" />
                <span className="font-serif text-[22px] font-bold text-[#0b2545] block">12.500+</span>
                <span className="font-sans text-[12.5px] text-slate-700 font-medium">Lavoratori formati e certificati a norma di legge</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  soundFX.playChime();
                  onOpenQuote('Consulenza Istituzionale & Incarico RSPP');
                }}
                className="px-6 py-3 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13.5px] font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border-b-2 border-[#1e6fd9]"
              >
                <span>Richiedi un Audit con i Nostri Tecnici</span>
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </button>

              {onOpenPartner && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playLaser();
                    onOpenPartner();
                  }}
                  className="px-5 py-3 bg-white hover:bg-slate-50 text-[#0b2545] font-sans text-[13.5px] font-bold rounded-xl border border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#155bb0]" />
                  <span>Opportunità di Partnership</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column (6 cols): Interactive Pillars & Guarantees */}
          <div className="lg:col-span-6 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* Pillar Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-200/80 rounded-2xl mb-6">
              {pillars.map((pillar) => {
                const isActive = activePillar === pillar.id;
                const Icon = pillar.icon;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      soundFX.playBeep(850);
                      setActivePillar(pillar.id);
                    }}
                    className={`py-2.5 px-3 rounded-xl font-sans text-[12.5px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#0b2545] text-[#9ec7f0] shadow-sm'
                        : 'text-slate-600 hover:text-[#0b2545]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{pillar.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Pillar Content */}
            {(() => {
              const current = pillars.find((p) => p.id === activePillar) || pillars[0];
              return (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h4 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0b2545]">
                    {current.title}
                  </h4>
                  <p className="font-sans text-[14.5px] text-slate-600 leading-relaxed">
                    {current.desc}
                  </p>

                  <div className="pt-3 space-y-2.5">
                    {current.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                        <CheckCircle2 className="w-4 h-4 text-[#1e6fd9] flex-shrink-0 mt-0.5" />
                        <span className="font-sans text-[13.5px] text-slate-700 font-medium leading-snug">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>

        {/* Timeline of Evolution */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              LA NOSTRA STORIA DI CRESCITA
            </span>
            <h3 className="font-serif text-[26px] sm:text-[32px] font-bold text-[#0b2545]">
              Un percorso fondato su serietà tecnica e presenza continua
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-6 rounded-2xl relative shadow-sm hover:border-blue-300 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e8f1fc] text-[#0b2545] font-mono font-bold text-[18px] flex items-center justify-center mb-4 border border-[#cfe3f8] group-hover:bg-[#0b2545] group-hover:text-[#9ec7f0] transition-colors">
                  {m.year}
                </div>
                <h4 className="font-serif text-[17px] font-bold text-[#0b2545] mb-2">
                  {m.title}
                </h4>
                <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
