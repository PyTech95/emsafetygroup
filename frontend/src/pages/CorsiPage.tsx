import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Clock, MapPin, Users, MonitorSmartphone, CalendarX2, QrCode, Hourglass } from 'lucide-react';
import PageHero from '../components/PageHero';
import API from '../lib/api';
import { useText } from '../lib/content';
import { UpcomingCourse, dateBlock, fmtDate, fmtHours } from '../lib/training';

export function CourseAvailability({ course, compact = false }: { course: UpcomingCourse; compact?: boolean }) {
  let label = 'Iscrizioni aperte';
  let cls = 'bg-[#e8f6ef] text-[#0f6b43] border-[#bfe5d0]';
  if (course.is_full) { label = 'Posti esauriti'; cls = 'bg-[#fdecea] text-[#a8291c] border-[#f5c6c0]'; }
  else if (!course.can_enroll) { label = 'Iscrizioni chiuse'; cls = 'bg-slate-100 text-slate-600 border-slate-200'; }
  else if (course.seats_left !== null && course.seats_left <= 3) {
    label = course.seats_left === 1 ? 'Ultimo posto' : `Ultimi ${course.seats_left} posti`;
    cls = 'bg-[#fff4dc] text-[#8a5a00] border-[#f5dca0]';
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-sans font-bold ${compact ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-[12px]'} ${cls}`} data-testid="course-availability">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function KindBadge({ course }: { course: UpcomingCourse }) {
  const text = [course.kind, fmtHours(course.hours)].filter(Boolean).join(' · ');
  if (!text) return null;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f5a800] text-[#0b2545] font-sans text-[11.5px] font-extrabold uppercase tracking-wide">
      {text}
    </span>
  );
}

export default function CorsiPage() {
  const t = useText();
  const [courses, setCourses] = useState<UpcomingCourse[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = 'Corsi in partenza | E.M SAFETY';
    API.get('/courses').then((r) => setCourses(r.data)).catch(() => { setCourses([]); setError(true); });
    return () => { document.title = 'E.M SAFETY | Consulenze e Formazioni'; };
  }, []);

  return (
    <>
      <PageHero
        label={t('page.corsi.label')}
        title={t('page.corsi.title')}
        highlight={t('page.corsi.highlight')}
        subtitle={t('page.corsi.subtitle')}
      />

      <section className="bg-white py-14 sm:py-20" data-testid="upcoming-courses">
        <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <h2 className="font-display text-[24px] sm:text-[30px] font-extrabold text-[#0b2545] tracking-tight">
              Calendario corsi
            </h2>
            {courses && courses.length > 0 && (
              <span className="font-sans text-[13px] text-slate-500">{courses.length} {courses.length === 1 ? 'edizione in programma' : 'edizioni in programma'}</span>
            )}
          </div>

          {courses === null && (
            <div className="space-y-4" aria-busy="true">
              {[0, 1, 2].map((i) => <div key={i} className="h-[150px] rounded-3xl bg-slate-100 animate-pulse" />)}
            </div>
          )}

          {courses && courses.length === 0 && (
            <div className="text-center rounded-3xl border-2 border-dashed border-slate-200 px-6 py-14" data-testid="courses-empty">
              <CalendarX2 className="w-10 h-10 text-[#1e6fd9] mx-auto mb-4" />
              <h3 className="font-display text-[20px] font-bold text-[#0b2545]">
                {error ? 'Impossibile caricare il calendario' : 'Nessun corso in partenza al momento'}
              </h3>
              <p className="font-sans text-[14.5px] text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                {t('page.corsi.empty')}
              </p>
              <Link to="/contatti" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-full border-b-2 border-[#1e6fd9] transition-colors">
                Contattaci <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </Link>
            </div>
          )}

          {courses && courses.length > 0 && (
            <div className="space-y-4 sm:space-y-5">
              {courses.map((c, i) => {
                const d = dateBlock(c.start_date);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05 }}
                  >
                    <Link
                      to={`/corsi/${c.id}`}
                      data-testid={`upcoming-course-${c.id}`}
                      className="group flex flex-col sm:flex-row bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-[#1e6fd9]/40 hover:shadow-[0_18px_44px_rgba(11,37,69,0.10)] transition-all"
                    >
                      <div className="sm:w-[132px] shrink-0 bg-[#0b2545] text-white flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 px-5 py-3 sm:py-6">
                        <span className="font-display text-[30px] sm:text-[42px] font-extrabold leading-none">{d.day}</span>
                        <span className="font-sans text-[13px] sm:text-[14px] font-bold tracking-[0.2em] text-[#f5a800] sm:mt-1.5">{d.month}</span>
                        <span className="font-sans text-[12px] text-white/60 sm:mt-0.5">{d.year}</span>
                        {c.end_date && <span className="ml-auto sm:ml-0 sm:mt-2 font-sans text-[11px] text-white/70">fino al {fmtDate(c.end_date).slice(0, 5)}</span>}
                      </div>

                      <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <KindBadge course={c} />
                          <CourseAvailability course={c} compact />
                        </div>
                        <div>
                          <h3 className="font-display text-[20px] sm:text-[22px] font-bold text-[#0b2545] leading-snug group-hover:text-[#155bb0] transition-colors">{c.title}</h3>
                          {c.subtitle && <p className="font-sans text-[14px] text-slate-600 leading-relaxed mt-1.5 line-clamp-2">{c.subtitle}</p>}
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-sans text-[13px] text-slate-600">
                          {c.schedule && <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#1e6fd9]" />{c.schedule}</span>}
                          {c.modality && <span className="inline-flex items-center gap-1.5"><MonitorSmartphone className="w-3.5 h-3.5 text-[#1e6fd9]" />{c.modality}</span>}
                          {c.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1e6fd9]" />{c.location}</span>}
                          {!c.kind && c.hours ? <span className="inline-flex items-center gap-1.5"><Hourglass className="w-3.5 h-3.5 text-[#1e6fd9]" />{fmtHours(c.hours)}</span> : null}
                          {c.seats_left !== null && c.can_enroll && <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#1e6fd9]" />{c.seats_left} posti disponibili</span>}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 px-5 pb-5 sm:p-6 sm:pl-0">
                        {c.price && <span className="font-display text-[16px] font-bold text-[#0b2545] whitespace-nowrap">{c.price}</span>}
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e6fd9] group-hover:bg-[#155bb0] text-white font-sans text-[13.5px] font-bold whitespace-nowrap transition-colors">
                          {c.can_enroll ? 'Dettagli e iscrizione' : 'Dettagli'}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          <Link
            to="/verifica-attestato"
            data-testid="corsi-verify-link"
            className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 rounded-3xl bg-[#f0f7fd] border border-[#cfe3f8] p-5 sm:p-6 hover:border-[#1e6fd9]/50 transition-colors group"
          >
            <span className="w-12 h-12 rounded-2xl bg-white border border-[#cfe3f8] text-[#1e6fd9] flex items-center justify-center shrink-0"><QrCode className="w-6 h-6" /></span>
            <span className="flex-1">
              <span className="block font-display text-[17px] font-bold text-[#0b2545]">Hai già un attestato E.M. Safety?</span>
              <span className="block font-sans text-[13.5px] text-slate-600 mt-0.5">Verifica l’autenticità inquadrando il QR code o inserendo il codice riportato sull’attestato.</span>
            </span>
            <span className="inline-flex items-center gap-2 font-sans text-[13.5px] font-bold text-[#155bb0] group-hover:gap-3 transition-all">Verifica attestato <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>
      </section>
    </>
  );
}
