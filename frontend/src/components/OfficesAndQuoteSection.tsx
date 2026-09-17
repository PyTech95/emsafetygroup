import { useState, useEffect, FormEvent } from 'react';
import {
  Building2,
  Building,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Calculator,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { QuoteFormData } from '../types';
import { soundFX } from '../utils/audio';
import { useAsset } from '../lib/assets';

interface OfficesAndQuoteSectionProps {
  initialService?: string;
}

export default function OfficesAndQuoteSection({
  initialService = '',
}: OfficesAndQuoteSectionProps) {
  const asset = useAsset();
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: initialService,
    location: 'milano',
    notes: '',
    privacy: false,
    estimatedStaff: '10-50',
  });

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({
        ...prev,
        service: initialService,
      }));
    }
  }, [initialService]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReference, setSubmittedReference] = useState('');
  const [activeTab, setActiveTab] = useState<'quote' | 'calculator'>('quote');

  // Quick estimator state
  const [calcEmployees, setCalcEmployees] = useState(15);
  const [calcRisk, setCalcRisk] = useState<'basso' | 'medio' | 'alto'>('medio');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) {
      alert('È necessario acconsentire al trattamento dei dati personali.');
      return;
    }

    soundFX.playLaser();
    setIsSubmitting(true);
    const refCode = `EMS-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedReference(refCode);
      soundFX.playChime();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#0b2545', '#1d4ed8', '#f59e0b', '#fbbf24'],
        });
      } catch {}
    }, 900);
  };

  const handleResetForm = () => {
    soundFX.playLaser();
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      service: '',
      location: 'milano',
      notes: '',
      privacy: false,
      estimatedStaff: '10-50',
    });
    setIsSubmitted(false);
  };

  // Estimate calculations
  const calculateEstimate = () => {
    const hoursPerWorker = calcRisk === 'basso' ? 8 : calcRisk === 'medio' ? 12 : 16;
    const estimatedPreposti = Math.max(1, Math.ceil(calcEmployees / 10));
    const estimatedAntincendio = Math.max(2, Math.ceil(calcEmployees / 15));
    const estimatedPrimoSoccorso = Math.max(2, Math.ceil(calcEmployees / 15));

    return {
      workerHours: hoursPerWorker,
      preposti: estimatedPreposti,
      antincendio: estimatedAntincendio,
      primoSoccorso: estimatedPrimoSoccorso,
    };
  };

  const estimate = calculateEstimate();

  return (
    <section id="preventivo-rapido" className="w-full bg-white py-16 lg:py-24 border-b border-slate-200 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Official Offices Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e8f1fc] text-[#0b2545] rounded-full text-[12px] font-sans font-bold uppercase tracking-widest mb-3 border border-[#cfe3f8] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#1e6fd9]" />
                <span>PRESIDIO TERRITORIALE STRATEGICO</span>
              </div>
              <h2 className="font-serif text-[32px] sm:text-[42px] text-[#0b2545] font-bold leading-[1.2] mb-4">
                Due hub d'eccellenza al servizio del tuo business.
              </h2>
              <p className="font-sans text-[16px] text-slate-600 mb-8 leading-relaxed">
                Operiamo attivamente nel Triveneto e in Lombardia con aule certificate, laboratori strumentali e disponibilità per audit diretti su tutto il territorio nazionale.
              </p>

              {/* Location Cards */}
              <div className="space-y-4 mb-8">
                {/* Treviso */}
                <div className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl shadow-sm flex items-start gap-4 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-[#e8f1fc] border border-[#cfe3f8] text-[#0b2545] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                      SEDE LEGALE &amp; ACADEMY VENETO
                    </span>
                    <h4 className="font-serif text-[18px] text-[#0b2545] font-bold mt-0.5">
                      Treviso (TV) • Triveneto Hub
                    </h4>
                    <p className="font-sans text-[13.5px] text-slate-600 mt-1 leading-relaxed">
                      Strada di Boiago, 11/b • 31100 Treviso<br />
                      Desk Diretto:{' '}
                      <a
                        className="text-[#0b2545] font-bold hover:underline"
                        href="tel:+3904221456565"
                      >
                        +39 0422/1456565
                      </a>
                    </p>
                  </div>
                </div>

                {/* Milano */}
                <div className="p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl shadow-sm flex items-start gap-4 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      BUSINESS HUB • LOMBARDIA
                    </span>
                    <h4 className="font-serif text-[18px] text-[#0b2545] font-bold mt-0.5">
                      Milano (MI) • Gae Aulenti
                    </h4>
                    <p className="font-sans text-[13.5px] text-slate-600 mt-1 leading-relaxed">
                      Piazza Gae Aulenti Torre B • 20100 Milano<br />
                      Linea Rapida Executive:{' '}
                      <a
                        className="text-[#0b2545] font-bold hover:underline"
                        href="tel:+393791341270"
                      >
                        +39 3791341270
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Auditor Field Operations Visual Card */}
              <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md relative group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={asset('/assets/images/safety_audit_engineer_1789049638858.jpg')}
                    alt="Ingegnere HSE E.M Safety durante un audit in stabilimento"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b2545] via-[#0b2545]/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="font-sans text-[10px] font-bold text-[#9ec7f0] uppercase tracking-wider bg-[#0b2545]/80 px-2 py-0.5 rounded border border-[#1e6fd9]/40">
                      PRESIDIO ON-SITE
                    </span>
                    <div className="font-serif text-[16px] font-bold text-white mt-1">
                      Sopralluoghi di Verifica &amp; Assistenza Verbali
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guaranteed SLA Box */}
            <div className="p-4 bg-[#e8f1fc] border border-[#cfe3f8] rounded-2xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#155bb0] flex-shrink-0" />
              <div className="text-[13px] font-sans text-slate-700">
                <strong className="text-[#0b2545] block font-bold">SLA DI RISPOSTA: ENTRO 24H</strong>
                Tutte le richieste di offerta vengono analizzate direttamente da ingegneri abilitati.
              </div>
            </div>
          </div>

          {/* Right Column: Quote Generator & Quick Estimator Tabs */}
          <div className="lg:col-span-7 bg-slate-50/90 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md flex flex-col justify-between">
            <div>
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playLaser();
                    setActiveTab('quote');
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-sans text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'quote'
                      ? 'bg-[#0b2545] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0b2545]'
                  }`}
                >
                  <Send className="w-4 h-4 text-[#1e6fd9]" />
                  <span>Richiesta Offerta Formale</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playLaser();
                    setActiveTab('calculator');
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-sans text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'calculator'
                      ? 'bg-[#0b2545] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0b2545]'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-[#1e6fd9]" />
                  <span>Stima Rapida Requisiti</span>
                </button>
              </div>

              {activeTab === 'quote' ? (
                isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center bg-white border border-[#cfe3f8] rounded-2xl my-6 shadow-sm"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#0b2545] text-[#1e6fd9] flex items-center justify-center mx-auto mb-4 shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="font-mono text-[11.5px] font-bold text-amber-700 uppercase tracking-widest block mb-1">
                      PROTOCOLLO REGISTRATO: {submittedReference}
                    </span>
                    <h3 className="font-serif text-[26px] font-bold text-[#0b2545] mb-2">
                      Richiesta Ricevuta con Successo
                    </h3>
                    <p className="font-sans text-[14.5px] text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                      Grazie, <strong>{formData.name}</strong>. Il nostro ufficio tecnico HSE prenderà in carico i dettagli per <strong>{formData.company}</strong> e ti contatterà entro 24 ore lavorative.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0b2545] border border-slate-300 rounded-xl font-sans text-[13px] font-bold transition-colors cursor-pointer"
                    >
                      Invia un'altra richiesta
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block font-sans text-[12px] font-bold text-[#0b2545] mb-1.5 uppercase tracking-wider"
                          htmlFor="form-name"
                        >
                          Nome e Cognome *
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Mario Rossi"
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[14px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-sans text-[12px] font-bold text-[#0b2545] mb-1.5 uppercase tracking-wider"
                          htmlFor="form-company"
                        >
                          Ragione Sociale / Azienda *
                        </label>
                        <input
                          id="form-company"
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          placeholder="Azienda S.p.A."
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[14px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block font-sans text-[12px] font-bold text-[#0b2545] mb-1.5 uppercase tracking-wider"
                          htmlFor="form-email"
                        >
                          E-Mail Aziendale *
                        </label>
                        <input
                          id="form-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="m.rossi@azienda.it"
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[14px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-sans text-[12px] font-bold text-[#0b2545] mb-1.5 uppercase tracking-wider"
                          htmlFor="form-phone"
                        >
                          Telefono Diretto *
                        </label>
                        <input
                          id="form-phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+39 02 1234567"
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[14px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block font-sans text-[12px] font-bold text-[#0b2545] mb-1.5 uppercase tracking-wider"
                          htmlFor="form-service"
                        >
                          Ambito di Interesse *
                        </label>
                        <select
                          id="form-service"
                          required
                          value={formData.service}
                          onChange={(e) =>
                            setFormData({ ...formData, service: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-white text-slate-800 rounded-xl font-sans text-[13px] font-medium border border-slate-200 focus:border-[#0b2545] focus:outline-none cursor-pointer"
                        >
                          <option value="">Seleziona modulo...</option>
                          <option value="sgi">
                            Sistemi di Gestione Integrati (ISO 9001/14001/45001)
                          </option>
                          <option value="corsi">
                            Formazione del Personale (Accordo 2026)
                          </option>
                          <option value="audit">
                            Audit Ispettivo &amp; Verifica Gap Analysis
                          </option>
                          <option value="rspp">
                            Incarico RSPP Esterno &amp; Redazione DVR
                          </option>
                          <option value="altro">Altro / Consulenza HSE</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className="block font-sans text-[12px] font-bold text-[#0b2545] mb-1.5 uppercase tracking-wider"
                          htmlFor="form-location"
                        >
                          Sede di Riferimento Prevalente
                        </label>
                        <select
                          id="form-location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-white text-slate-800 rounded-xl font-sans text-[13px] font-medium border border-slate-200 focus:border-[#0b2545] focus:outline-none cursor-pointer"
                        >
                          <option value="milano">Milano &amp; Lombardia</option>
                          <option value="treviso">Treviso &amp; Triveneto</option>
                          <option value="online">FAD / Videoconferenza Sincrona</option>
                          <option value="italia">Intervento In Loco (Tutta Italia)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block font-sans text-[12px] font-bold text-[#0b2545] mb-1.5 uppercase tracking-wider"
                        htmlFor="form-notes"
                      >
                        Note, Organico Dipendenti o Esigenze Specifiche
                      </label>
                      <textarea
                        id="form-notes"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Es. Richiesta aggiornamento 15 preposti secondo nuovo accordo 2026 e nomina RSPP esterno..."
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[14px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:outline-none resize-none"
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={formData.privacy}
                        onChange={(e) =>
                          setFormData({ ...formData, privacy: e.target.checked })
                        }
                        className="mt-1 w-4 h-4 rounded text-[#0b2545] accent-[#0b2545]"
                      />
                      <span className="text-[12px] font-sans text-slate-600">
                        Dichiaro di aver letto l'informativa sulla privacy e acconsento al trattamento dei dati per la formulazione del preventivo (D.Lgs. 196/2003 e GDPR 679/2016).
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14.5px] font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-[#1e6fd9]"
                    >
                      {isSubmitting ? (
                        <span>Elaborazione richiesta in corso...</span>
                      ) : (
                        <>
                          <span>Invia Richiesta di Preventivo Gratuito</span>
                          <Send className="w-4 h-4 text-[#1e6fd9]" />
                        </>
                      )}
                    </button>
                  </form>
                )
              ) : (
                /* Fast Calculator Tab */
                <div className="space-y-6">
                  <div>
                    <label className="block font-sans text-[12px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
                      1. Numero Dipendenti Organico ({calcEmployees})
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={150}
                      value={calcEmployees}
                      onChange={(e) => setCalcEmployees(Number(e.target.value))}
                      className="w-full accent-[#0b2545] cursor-pointer"
                    />
                    <div className="flex justify-between font-sans text-[11px] text-slate-500 mt-1">
                      <span>1 Dipendente</span>
                      <span>50</span>
                      <span>100</span>
                      <span>150+ Dipendenti</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[12px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
                      2. Livello di Rischio Settore
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['basso', 'medio', 'alto'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            soundFX.playBeep(800);
                            setCalcRisk(r);
                          }}
                          className={`py-2.5 rounded-xl border text-center font-sans text-[13px] font-bold uppercase transition-all cursor-pointer ${
                            calcRisk === r
                              ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Rischio {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                    <span className="font-sans text-[12px] font-bold text-amber-800 uppercase tracking-wider block">
                      STIMA REQUISITI MINIMI CALCOLATA:
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-[13px] font-sans text-slate-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Formazione: {estimate.workerHours}h a lavoratore</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Preposti minimi: ~{estimate.preposti}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Addetti Antincendio: {estimate.antincendio}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Primo Soccorso: {estimate.primoSoccorso}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playLaser();
                      setFormData((prev) => ({
                        ...prev,
                        notes: `Stima calcolata: ${calcEmployees} dipendenti, Rischio ${calcRisk}. Ore stimate formazione: ${estimate.workerHours}h.`,
                      }));
                      setActiveTab('quote');
                    }}
                    className="w-full py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-xl transition-all cursor-pointer border-b-2 border-[#1e6fd9]"
                  >
                    Trasferisci Dati nel Modulo Preventivo &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
