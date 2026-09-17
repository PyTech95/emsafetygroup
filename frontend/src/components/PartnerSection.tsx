import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Handshake,
  Stethoscope,
  HardHat,
  Building,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  Send,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';
import EmSafetyLogo from './EmSafetyLogo';
import AnimatedPartnerEcosystem from './AnimatedPartnerEcosystem';
import { soundFX } from '../utils/audio';

interface PartnerSectionProps {
  onPartnerSubmitted?: (partnerName: string) => void;
}

export default function PartnerSection({ onPartnerSubmitted }: PartnerSectionProps) {
  const [partnerType, setPartnerType] = useState<string>('medico');
  const [formData, setFormData] = useState({
    name: '',
    companyOrStudio: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    privacyAccepted: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partnerProfiles = [
    {
      id: 'medico',
      title: 'Medici Competenti & Centri Sanitari',
      icon: Stethoscope,
      badge: 'Sorveglianza Sanitaria',
      description:
        'Sinergia per la nomina e gestione delle visite mediche periodiche, esami strumentali e giudizi di idoneità alla mansione, coordinati con il nostro DVR.',
      advantages: [
        'Condivisione bidirezionale dei protocolli sanitari e rischi mansione',
        'Scadenziario visite mediche integrato nel nostro portale cloud',
        'Ampliamento del bacino aziendale su Treviso, Veneto e Milano',
      ],
    },
    {
      id: 'consulente',
      title: 'Consulenti HSE & RSPP Autonomi',
      icon: HardHat,
      badge: 'Rete Professionisti',
      description:
        'Collaborazione su grandi commesse, misurazioni strumentali complesse (rumore, vibrazioni, campi elettromagnetici, ATEX) e progetti ISO 45001.',
      advantages: [
        'Supporto tecnico di secondo livello con strumentazione tarata',
        'Possibilità di sub-appalto e co-gestione incarichi territoriali',
        'Accesso a condizioni agevolate alle nostre aule formative accreditate',
      ],
    },
    {
      id: 'ingegnere',
      title: 'Studi di Ingegneria & Cantieri',
      icon: Building,
      badge: 'Progettazione & CPI',
      description:
        'Integrazione specialistica per Pratiche Antincendio (Codice di Prevenzione Incendi, SCIA/CPI), sicurezza cantieri Titolo IV (PSC, POS, PIMUS) e perizie.',
      advantages: [
        'Interlocutore unico per la conformità di cantiere e collaudi',
        'Rapidità di asseverazione documentale per aperture cantiere 24/48h',
        'Tutela legale coordinata per il Coordinatore della Sicurezza',
      ],
    },
    {
      id: 'ente',
      title: 'Centri di Formazione & Associazioni',
      icon: GraduationCap,
      badge: 'Accademie & Enti',
      description:
        'Co-erogazione di percorsi formativi interaziendali e finanziati tramite Fondi Paritetici Interprofessionali (Fondimpresa, For.Te, Fon.Coop).',
      advantages: [
        'Riconoscimento reciproco dei crediti e attestati asseverati',
        'Docenti-formatori abilitati ai sensi del Decreto Interministeriale',
        'Completa conformità alle nuove linee guida dell’Accordo 2026',
      ],
    },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.privacyAccepted) {
      soundFX.playBeep(400);
      return;
    }

    setIsSubmitting(true);
    soundFX.playLaser();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      soundFX.playChime();
      if (onPartnerSubmitted) {
        onPartnerSubmitted(formData.companyOrStudio || formData.name);
      }
    }, 800);
  };

  return (
    <section id="partner" className="w-full py-16 lg:py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#cfe3f8]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#e8f1fc]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9]" />
              <span className="font-mono text-[11.5px] font-bold text-[#0b2545] uppercase tracking-[0.2em] block">
                RETE PROFESSIONALE &amp; CONVENZIONI
              </span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[44px] text-[#0b2545] font-bold tracking-tight">
              Diventa Nostro Partner
            </h2>
            <p className="font-sans text-[15.5px] text-slate-600 max-w-2xl mt-2">
              Costruiamo partnership strategiche con medici competenti, studi di ingegneria, consulenti HSE ed enti territoriali per offrire un presidio integrato e ad altissimo standard qualitativo.
            </p>
          </div>

          {/* Slogan with Logo Card */}
          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm self-start md:self-end">
            <EmSafetyLogo
              variant="navy"
              size="sm"
              showTagline={false}
              showSlogan={true}
              sloganPlacement="right"
            />
          </div>
        </div>

        {/* Animated Interactive Orbital Partner Topology */}
        <div className="mb-14">
          <AnimatedPartnerEcosystem
            onSelectPartnerRole={(role) => {
              if (role === 'medici') setPartnerType('medico');
              else if (role === 'rspp') setPartnerType('consulente');
              else if (role === 'antincendio') setPartnerType('ingegnere');
              else if (role === 'formazione') setPartnerType('ente');
            }}
          />
        </div>

        {/* 4 Partnership Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerProfiles.map((p) => {
            const Icon = p.icon;
            const isSelected = partnerType === p.id;
            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                onClick={() => {
                  soundFX.playBeep(850);
                  setPartnerType(p.id);
                }}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-md relative overflow-hidden ${
                  isSelected
                    ? 'border-[#0b2545] ring-2 ring-[#0b2545]/20 shadow-lg'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#0b2545] text-[#1e6fd9]'
                          : 'bg-[#e8f1fc] text-[#0b2545] border border-[#cfe3f8]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#0b2545] mb-2 leading-snug">
                    {p.title}
                  </h3>

                  <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {p.advantages.map((adv, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1e6fd9] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`font-sans text-[12.5px] font-bold flex items-center gap-1.5 ${
                      isSelected ? 'text-[#0b2545]' : 'text-slate-500'
                    }`}
                  >
                    <span>{isSelected ? 'Profilo Selezionato' : 'Seleziona per candidarti'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1e6fd9]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Partnership Application Form Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-10 shadow-xl max-w-4xl mx-auto">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-[#e8f1fc] text-[#0b2545] rounded-full flex items-center justify-center mx-auto border-2 border-[#1e6fd9]">
                <CheckCircle2 className="w-8 h-8 text-[#1e6fd9]" />
              </div>
              <h3 className="font-serif text-[26px] sm:text-[30px] font-bold text-[#0b2545]">
                Candidatura di Partnership Ricevuta!
              </h3>
              <p className="font-sans text-[15px] text-slate-600 max-w-lg mx-auto leading-relaxed">
                Grazie per il tuo interesse a collaborare con <strong>E.M Safety</strong>. Il nostro Responsabile Sviluppo e Relazioni Esterne ti contatterà entro 24 ore per programmare un incontro conoscitivo.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playBeep(700);
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      companyOrStudio: '',
                      email: '',
                      phone: '',
                      city: '',
                      message: '',
                      privacyAccepted: false,
                    });
                  }}
                  className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13px] font-bold rounded-xl shadow-xs"
                >
                  Invia un'altra richiesta
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="font-mono text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    CANDIDATURA DIRETTA AL NETWORK
                  </span>
                  <h3 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#0b2545]">
                    Proponi la tua collaborazione professionale
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-sans font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-[#155bb0]" />
                  <span>Riscontro garantito in 24h</span>
                </div>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider mb-1.5">
                    Nome e Cognome Referente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="es. Dott. Marco Ferrari"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider mb-1.5">
                    Nome Studio / Società / Ente
                  </label>
                  <input
                    type="text"
                    value={formData.companyOrStudio}
                    onChange={(e) => setFormData({ ...formData, companyOrStudio: e.target.value })}
                    placeholder="es. Studio Medico Ferrari &amp; Associati"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider mb-1.5">
                    Email Aziendale / Professionale *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="referente@studioferrari.it"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider mb-1.5">
                    Telefono Diretto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+39 340 1234567"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider mb-1.5">
                    Ambito di Partnership Principale
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="medico">Medicina del Lavoro &amp; Sorveglianza Sanitaria</option>
                    <option value="consulente">Consulente HSE / RSPP Esterno Indipendente</option>
                    <option value="ingegnere">Studio di Ingegneria / Prevenzione Incendi (CPI)</option>
                    <option value="ente">Ente Formativo / Ente Bilaterale Accreditato</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider mb-1.5">
                    Città / Area Geografica Operativa
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="es. Treviso, Padova, Milano, Monza, ecc."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider mb-1.5">
                  Descrizione delle Sinergie Proposte
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descrivi brevemente la tua struttura, i settori di intervento e come vorresti collaborare con la nostra rete..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Privacy Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="partnerPrivacy"
                  required
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-[#0b2545] border-slate-300 focus:ring-[#0b2545] cursor-pointer"
                />
                <label htmlFor="partnerPrivacy" className="font-sans text-[12.5px] text-slate-600 leading-snug cursor-pointer">
                  Autorizzo il trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) per essere ricontattato in merito alla proposta di convenzione e partnership professionale.
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14.5px] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-b-2 border-[#1e6fd9] disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>Invio candidatura in corso...</span>
                ) : (
                  <>
                    <span>Invia Candidatura Partner Ufficiale</span>
                    <Send className="w-4 h-4 text-[#1e6fd9]" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
