import { useState, FormEvent } from 'react';
import { X, Calendar, MapPin, CheckCircle2, ShieldCheck, Clock, Send, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { Course } from '../types';
import { soundFX } from '../utils/audio';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onBookingSuccess: (courseTitle: string) => void;
}

export default function CourseModal({
  course,
  onClose,
  onBookingSuccess,
}: CourseModalProps) {
  const [attendees, setAttendees] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!course) return null;

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    soundFX.playLaser();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmed(true);
      soundFX.playChime();
      setTimeout(() => {
        onBookingSuccess(course.title);
      }, 1400);
    }, 600);
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
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 flex flex-col text-slate-800"
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#e8f1fc] text-[#0b2545] border border-[#cfe3f8] font-sans text-[11.5px] font-bold rounded-lg uppercase tracking-wider">
              {course.badge}
            </span>
            <span className="font-sans text-[12.5px] text-slate-500 font-semibold">
              {course.legalRef}
            </span>
          </div>
          <button
            onClick={() => {
              soundFX.playBeep(450);
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-[#0b2545] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Chiudi scheda corso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-sans text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              {course.categoryLabel}
            </span>
            <h2 className="font-serif text-[26px] sm:text-[32px] text-[#0b2545] font-bold leading-tight">
              {course.title}
            </h2>
            <p className="font-sans text-[15.5px] text-slate-600 mt-2 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-sans text-[11px] text-slate-500 font-bold block uppercase">DURATA TOTALE</span>
                <span className="font-serif text-[15px] font-bold text-[#0b2545]">{course.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#155bb0]" />
              <div>
                <span className="font-sans text-[11px] text-slate-500 font-bold block uppercase">PROSSIMA SESSIONE</span>
                <span className="font-serif text-[15px] font-bold text-[#0b2545]">{course.nextDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-700" />
              <div>
                <span className="font-sans text-[11px] text-slate-500 font-bold block uppercase">SEDE / MODALITÀ</span>
                <span className="font-serif text-[15px] font-bold text-[#0b2545]">{course.location}</span>
              </div>
            </div>
          </div>

          {/* Program Syllabus */}
          <div>
            <h3 className="font-sans text-[13px] font-bold text-[#0b2545] mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#155bb0]" />
              <span>PROGRAMMA DIDATTICO MINISTERIALE</span>
            </h3>
            <ul className="space-y-2">
              {course.program.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-sans text-[14px] text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites and Accreditation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-sans text-[11px] font-bold text-[#0b2545] uppercase tracking-wider block mb-1">
                DESTINATARI &amp; PREREQUISITI
              </span>
              <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed">
                {course.prerequisites}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-amber-200">
              <span className="font-sans text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                CERTIFICAZIONE &amp; ATTESTATO
              </span>
              <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed">
                {course.certification}
              </p>
            </div>
          </div>

          {/* Quick Seat Reservation Form */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            {confirmed ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#1e6fd9] mx-auto" />
                <h4 className="font-serif text-[20px] font-bold text-[#0b2545]">
                  Iscrizione preliminare registrata!
                </h4>
                <p className="font-sans text-[14px] text-slate-600">
                  La segreteria didattica ti contatterà per l'invio dei moduli anagrafici dei partecipanti.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-[18px] font-bold text-[#0b2545]">
                      Prenota posti per questa sessione
                    </h4>
                    <span className="font-sans text-[12px] text-slate-500">
                      Nessun pagamento anticipato richiesto adesso
                    </span>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-[#0b2545] mb-1 uppercase">
                      Ragione Sociale Azienda *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Es. Officine Meccaniche Srl"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[13.5px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-[#0b2545] mb-1 uppercase">
                      Numero Partecipanti
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={attendees}
                      onChange={(e) => setAttendees(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[13.5px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-[#0b2545] mb-1 uppercase">
                      E-Mail Referente Formazione *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="hr@azienda.it"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[13.5px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-[#0b2545] mb-1 uppercase">
                      Telefono Referente *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+39 340 0000000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl font-sans text-[13.5px] text-slate-800 border border-slate-200 focus:border-[#0b2545] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13.5px] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-[#1e6fd9]"
                >
                  <Send className="w-4 h-4 text-[#1e6fd9]" />
                  <span>Conferma Richiesta Iscrizione</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
