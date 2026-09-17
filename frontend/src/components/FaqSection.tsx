import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_DATA } from '../data/coursesData';
import { soundFX } from '../utils/audio';

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    soundFX.playLaser();
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="w-full bg-white py-24 lg:py-28 border-t border-slate-200 relative z-10" data-testid="faq-section">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e8f1fc] text-[#0b2545] rounded-full text-[12px] font-sans font-bold uppercase tracking-widest mb-3 border border-[#cfe3f8] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#1e6fd9]" />
            <span>FAQ &amp; CHIARIMENTI NORMATIVI</span>
          </div>
          <h2 className="font-serif text-[32px] sm:text-[42px] text-[#0b2545] font-bold mb-3 tracking-tight">
            Domande frequenti su consulenza e scadenze
          </h2>
          <p className="font-sans text-[16px] text-slate-600 leading-relaxed">
            Le risposte operative alle principali richieste che riceviamo quotidianamente da responsabili HR, RSPP e amministratori delegati.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {FAQ_DATA.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  data-testid={`faq-toggle-${faq.id}`}
                  className="w-full p-6 flex items-center justify-between text-left gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-serif text-[17px] sm:text-[18px] leading-snug text-[#0b2545] font-bold">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#0b2545] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#0b2545] text-[#1e6fd9] border-[#0b2545]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      data-testid={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-600 font-sans text-[14.5px] leading-relaxed border-t border-slate-100 pt-4">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
