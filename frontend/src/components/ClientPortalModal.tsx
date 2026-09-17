import { useState, FormEvent } from 'react';
import { X, CheckCircle2, FileText, BellRing, Sparkles, Send, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFX } from '../utils/audio';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientPortalModal({ isOpen, onClose }: ClientPortalModalProps) {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  if (!isOpen) return null;

  const handleWaitlist = (e: FormEvent) => {
    e.preventDefault();
    if (waitlistEmail) {
      soundFX.playLaser();
      setSignedUp(true);
      soundFX.playChime();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col text-slate-800"
      >
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 relative">
          <button
            onClick={() => {
              soundFX.playBeep(450);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0b2545] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1e6fd9]" />
            <span className="px-3 py-1 bg-[#e8f1fc] text-[#0b2545] border border-[#cfe3f8] font-sans text-[11px] font-bold rounded-lg uppercase tracking-wider">
              CLOUD SCADENZIARIO PREVISIVO • 2026 RELEASE
            </span>
          </div>
          <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#0b2545]">
            Area Riservata &amp; Hub Documentale E.M Safety
          </h2>
          <p className="font-sans text-[14.5px] text-slate-600 mt-1">
            Il cruscotto digitale per monitorare in tempo reale lo stato di conformità e patentini di ogni lavoratore.
          </p>
        </div>

        {/* Portal Feature Preview */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <BellRing className="w-6 h-6 text-[#155bb0] mb-2" />
              <h4 className="font-sans text-[13.5px] font-bold text-[#0b2545] uppercase tracking-wide">
                Alert Scadenze Predittivi
              </h4>
              <p className="font-sans text-[12.5px] text-slate-600 mt-1 leading-relaxed">
                Notifiche automatiche a 90, 60 e 30 giorni prima della scadenza di corsi e idoneità mediche.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-sans text-[13.5px] font-bold text-[#0b2545] uppercase tracking-wide">
                Fascicolo Digitale
              </h4>
              <p className="font-sans text-[12.5px] text-slate-600 mt-1 leading-relaxed">
                Tutti gli attestati e i verbali di prova pratica scaricabili in un click durante i controlli degli organi di vigilanza.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <Lock className="w-6 h-6 text-[#0b2545] mb-2" />
              <h4 className="font-sans text-[13.5px] font-bold text-[#0b2545] uppercase tracking-wide">
                Archivio Cloud GDPR
              </h4>
              <p className="font-sans text-[12.5px] text-slate-600 mt-1 leading-relaxed">
                Dati dei dipendenti cifrati end-to-end con server dedicati certificati ISO 27001 in Italia.
              </p>
            </div>
          </div>

          {/* Waitlist Box */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            {signedUp ? (
              <div className="text-center py-2 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#1e6fd9] mx-auto" />
                <h4 className="font-serif text-[18px] font-bold text-[#0b2545]">
                  Accesso Prioritario Confermato!
                </h4>
                <p className="font-sans text-[13.5px] text-slate-600">
                  Ti invieremo le credenziali di invito non appena il portale sarà aperto ai nuovi clienti convenzionati.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#155bb0]" />
                  <span className="font-sans text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    ACCESSO BETA PRIORITARIO
                  </span>
                </div>
                <h4 className="font-serif text-[18px] font-bold text-[#0b2545] mb-1">
                  Vuoi attivare il cruscotto per la tua azienda?
                </h4>
                <p className="font-sans text-[13.5px] text-slate-600 mb-4">
                  Inserisci la tua e-mail aziendale per ricevere l'accesso anticipato gratuito e il caricamento guidato dei primi 50 dipendenti.
                </p>

                <form onSubmit={handleWaitlist} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="tua.email@azienda.it"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white rounded-xl font-sans text-[13.5px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13px] font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm border-b-2 border-[#1e6fd9]"
                  >
                    <span>Attiva</span>
                    <Send className="w-4 h-4 text-[#1e6fd9]" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
