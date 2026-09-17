import { motion } from 'motion/react';
import {
  ShieldCheck,
  Award,
  Users,
  Compass,
  Building2,
  FileCheck2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Target,
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
} from 'lucide-react';
import EmSafetyLogo from './EmSafetyLogo';
import { soundFX } from '../utils/audio';

interface AboutUsPageProps {
  onBackToHome: () => void;
  onOpenQuote: (service?: string) => void;
  onExploreCourses: () => void;
  onOpenPartner: () => void;
}

export default function AboutUsPage({
  onBackToHome,
  onOpenQuote,
  onExploreCourses,
  onOpenPartner,
}: AboutUsPageProps) {
  const leadership = [
    {
      name: 'Ing. Marco Rossi',
      role: 'Direttore Tecnico & Lead Auditor SGI',
      spec: 'Ingegnere Civile e Ambientale, abilitato RSPP per tutti i macrosettori ATECO. Esperto in ingegneria di cantiere, direttiva macchine e asseverazione Modelli 231.',
      accreditation: 'Iscritto Ordine Ingegneri • Lead Auditor ISO 45001 / ISO 9001',
    },
    {
      name: 'Dott.ssa Elena Moretti',
      role: 'Responsabile Didattica & Formazione 4.0',
      spec: 'Specialista in andragogia applicata e dinamiche comportamentali della sicurezza (Behavior-Based Safety). Coordina le aule di Treviso, Milano e la piattaforma FAD.',
      accreditation: 'Formatore-Docente Qualificato ai sensi del D.I. 06/03/2013',
    },
    {
      name: 'Ing. Matteo Vianello',
      role: 'Senior Project Manager Antincendio & Cantieri',
      spec: 'Professionista antincendio iscritto agli elenchi ministeriali ex L. 818/84. Progettista di sistemi di evacuazione fumo e coordinatore per la sicurezza (CSP/CSE).',
      accreditation: 'Specialista CPI • Certificato Valutazione Rischio ATEX',
    },
  ];

  const values = [
    {
      title: 'Rigore Scientifico & Zero Burocrazia Cartacea',
      desc: 'Ogni nostra valutazione parte da misurazioni strumentali verificate e processi reali, non da moduli prestampati.',
      icon: Target,
    },
    {
      title: 'Scudo Giuridico per il Vertice Aziendale',
      desc: 'Proteggiamo l’organigramma dirigenziale e il Datore di Lavoro definendo catene di delega inattaccabili in sede penale.',
      icon: ShieldCheck,
    },
    {
      title: 'Valorizzazione delle Risorse Umane',
      desc: 'Formiamo le persone non per adempiere a un obbligo, ma per generare una cultura consapevole del rischio condiviso.',
      icon: Users,
    },
    {
      title: 'Innovazione Tecnologica & Digital HSE',
      desc: 'Digitalizziamo registri, scadenziari e verifiche periodiche per eliminare ogni possibilità di dimenticanza sanzionabile.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              soundFX.playBeep(700);
              onBackToHome();
            }}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-[#0b2545] font-sans text-[14px] font-bold transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 text-[#1e6fd9]" />
            <span>Torna alla Home Principale</span>
          </button>

          <span className="font-mono text-[12px] font-bold text-slate-500 hidden sm:inline uppercase tracking-widest">
            PROFILO ISTITUZIONALE // ABOUT US
          </span>
        </div>

        {/* Hero Banner with Official Slogan and Logo */}
        <div className="bg-gradient-to-r from-[#e8f1fc] via-white to-amber-50/50 rounded-3xl border border-slate-200 p-8 sm:p-12 mb-14 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9]" />
                <span className="font-mono text-[12px] font-bold text-[#0b2545] uppercase tracking-[0.2em]">
                  INGEGNERIA DELLA SICUREZZA &amp; FORMAZIONE
                </span>
              </div>
              <h1 className="font-serif text-[36px] sm:text-[48px] text-[#0b2545] font-extrabold tracking-tight leading-[1.1] mb-4">
                La Nostra Identità
              </h1>
              <p className="font-sans text-[18px] text-slate-700 leading-relaxed font-normal">
                Siamo un team multidisciplinare di ingegneri, formatori accreditati e consulenti legali giuslavoristi. Aiutiamo le aziende a trasformare la sicurezza da vincolo burocratico in leva di competitività.
              </p>
            </div>

            {/* Logo and Verbatim Slogan Lockup */}
            <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-2xl shadow-md flex flex-col items-center text-center max-w-md">
              <EmSafetyLogo
                variant="navy"
                size="md"
                showTagline={true}
                showSlogan={true}
                sloganPlacement="centered"
              />
            </div>
          </div>
        </div>

        {/* The 4 Values Grid */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              PRINCIPI ETICI E METODOLOGICI
            </span>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-bold text-[#0b2545]">
              I Valori che Guidano Ogni Nostro Intervento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#cfe3f8] text-[#0b2545] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#0b2545]" />
                    </div>
                    <h3 className="font-serif text-[18px] font-bold text-[#0b2545] mb-2 leading-snug">
                      {v.title}
                    </h3>
                    <p className="font-sans text-[14px] text-slate-600 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Leadership Team */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              DIREZIONE TECNICA &amp; LEADERSHIP
            </span>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-bold text-[#0b2545]">
              Professionisti di Primo Livello al Tuo Fianco
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((l, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-7 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#0b2545] text-[#1e6fd9] font-serif font-bold text-[22px] flex items-center justify-center mb-4">
                    {l.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h3 className="font-serif text-[20px] font-bold text-[#0b2545] mb-1">
                    {l.name}
                  </h3>
                  <span className="font-mono text-[11.5px] font-bold text-amber-700 uppercase tracking-wider block mb-3">
                    {l.role}
                  </span>
                  <p className="font-sans text-[14px] text-slate-600 leading-relaxed mb-4">
                    {l.spec}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <span className="font-sans text-[11.5px] font-semibold text-slate-500 block">
                    {l.accreditation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Hubs Contact Banner */}
        <div className="bg-[#0b2545] text-white rounded-3xl p-8 sm:p-12 border-b-4 border-[#1e6fd9] shadow-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-[11px] font-bold text-[#1e6fd9] uppercase tracking-widest block">
                PRESENZA TERRITORIALE DIRETTA
              </span>
              <h3 className="font-serif text-[28px] sm:text-[34px] font-bold text-white leading-tight">
                Le Nostre Sedi a Treviso e Milano Gae Aulenti
              </h3>
              <p className="font-sans text-[15px] text-slate-300 max-w-2xl leading-relaxed">
                Operiamo quotidianamente nelle principali zone industriali del Nord Italia con tecnici residenti e aule accreditate per la formazione sul campo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/10 p-4 rounded-xl border border-white/15">
                  <div className="flex items-center gap-2 text-[#1e6fd9] font-bold mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>Treviso • Sede Operativa &amp; Aule</span>
                  </div>
                  <p className="font-sans text-[13px] text-slate-300">Viale della Repubblica 156, Treviso</p>
                  <p className="font-mono text-[12px] text-[#9ec7f0] mt-1">Tel. +39 0422 1456565</p>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-white/15">
                  <div className="flex items-center gap-2 text-[#1e6fd9] font-bold mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>Milano • Hub Direzionale</span>
                  </div>
                  <p className="font-sans text-[13px] text-slate-300">Piazza Gae Aulenti 4, Torre B, Milano</p>
                  <p className="font-mono text-[12px] text-[#9ec7f0] mt-1">Tel. +39 02 89045612</p>
                </div>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <button
                type="button"
                onClick={() => {
                  soundFX.playChime();
                  onOpenQuote('Richiesta Audit Preliminare Chi Siamo');
                }}
                className="w-full py-3.5 bg-[#1e6fd9] hover:bg-[#1e6fd9] text-[#0b2545] font-sans text-[14px] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Richiedi un Audit con i Tecnici</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playLaser();
                  onOpenPartner();
                }}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-sans text-[13.5px] font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#1e6fd9]" />
                <span>Diventa Nostro Partner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playLaser();
                  onExploreCourses();
                }}
                className="w-full py-3 bg-white text-[#0b2545] hover:bg-slate-100 font-sans text-[13.5px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Consulta il Catalogo Formativo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
