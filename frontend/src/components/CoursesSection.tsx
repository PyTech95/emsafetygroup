import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, CalendarDays, X, Check, ArrowRight, ScrollText } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { COURSES_DATA } from '../data/coursesData';
import { Course } from '../types';

interface CoursesProps {
  onNavigate: (id: string) => void;
}

const badgeStyle: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  urgent: 'bg-amber-50 text-amber-700 border-amber-200',
  mandatory: 'bg-[#e8f1fc] text-[#0b2545] border-[#cfe3f8]',
};

export default function CoursesSection({ onNavigate }: CoursesProps) {
  const [selected, setSelected] = useState<Course | null>(null);

  return (
    <section id="corsi" className="bg-white py-24 lg:py-28" data-testid="courses-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <SectionLabel>Formazione Accreditata</SectionLabel>
          <h2 className="font-display text-[34px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight leading-[1.08] mt-5">
            Il catalogo corsi{' '}
            <span className="text-[#1e6fd9]">a norma di legge.</span>
          </h2>
          <p className="font-sans text-[16.5px] text-slate-600 leading-relaxed mt-5">
            Corsi conformi all&apos;Accordo Stato-Regioni e al D.Lgs 81/08, con attestati a codice univoco validi in tutta
            Italia. In aula presso le sedi di Treviso e Milano, in videoconferenza (FAD) o direttamente in azienda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {COURSES_DATA.map((course, i) => (
            <motion.button
              key={course.id}
              type="button"
              onClick={() => setSelected(course)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              data-testid={`course-card-${course.id}`}
              className="group text-left bg-white rounded-3xl border border-slate-200 p-6 hover:border-[#0b2545]/30 hover:shadow-[0_20px_50px_rgba(11,37,69,0.1)] transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeStyle[course.badgeType] || badgeStyle.open}`}>
                  {course.badge}
                </span>
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {course.categoryLabel}
                </span>
              </div>

              <h3 className="font-display text-[19px] font-bold text-[#0b2545] leading-snug">{course.title}</h3>
              <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed mt-3 flex-1">{course.description}</p>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 font-sans text-[12.5px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#1e6fd9] shrink-0" />
                  <span>{course.legalRef}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-[#1e6fd9] shrink-0" />
                  <span>Prossima edizione: {course.nextDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#1e6fd9] shrink-0" />
                  <span>{course.location}</span>
                </div>
              </div>

              <span className="mt-5 inline-flex items-center gap-2 font-sans text-[13.5px] font-bold text-[#0b2545] group-hover:gap-3 transition-all">
                Programma e dettagli
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#0b2545]/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            data-testid="course-modal"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
            >
              <div className="sticky top-0 bg-[#0b2545] text-white px-6 py-5 flex items-start justify-between gap-4 rounded-t-3xl">
                <div>
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#1e6fd9]">
                    {selected.categoryLabel}
                  </span>
                  <h3 className="font-display text-[21px] font-bold mt-1 leading-snug">{selected.title}</h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  data-testid="course-modal-close"
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Chiudi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="font-display text-[18px] font-extrabold text-[#0b2545]">{selected.hours}h</div>
                    <div className="font-sans text-[11px] text-slate-500 mt-0.5">Durata</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="font-display text-[13px] font-bold text-[#0b2545] leading-tight">{selected.nextDate}</div>
                    <div className="font-sans text-[11px] text-slate-500 mt-0.5">Prossima edizione</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="font-display text-[13px] font-bold text-[#0b2545] leading-tight">{selected.duration}</div>
                    <div className="font-sans text-[11px] text-slate-500 mt-0.5">Modalità</div>
                  </div>
                </div>

                <p className="font-sans text-[14.5px] text-slate-600 leading-relaxed">{selected.description}</p>

                <div>
                  <h4 className="font-display text-[15px] font-bold text-[#0b2545] flex items-center gap-2 mb-3">
                    <ScrollText className="w-4 h-4 text-[#1e6fd9]" /> Programma del corso
                  </h4>
                  <ul className="space-y-2">
                    {selected.program.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 font-sans text-[13.5px] text-slate-700">
                        <Check className="w-4 h-4 text-[#1e6fd9] mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Prerequisiti</div>
                    <p className="font-sans text-[13px] text-slate-600 leading-relaxed">{selected.prerequisites}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Destinatari</div>
                    <p className="font-sans text-[13px] text-slate-600 leading-relaxed">{selected.targetAudience}</p>
                  </div>
                </div>

                <div className="bg-[#e8f1fc] rounded-2xl p-4 border border-[#cfe3f8]">
                  <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#0b2545] mb-1">Attestato</div>
                  <p className="font-sans text-[13px] text-slate-700 leading-relaxed">{selected.certification}</p>
                </div>

                <button
                  onClick={() => {
                    setSelected(null);
                    onNavigate('contatti');
                  }}
                  data-testid="course-modal-cta"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14.5px] font-bold rounded-full shadow-lg transition-all active:scale-95 border-b-2 border-[#1e6fd9] cursor-pointer"
                >
                  Iscriviti o richiedi informazioni
                  <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
