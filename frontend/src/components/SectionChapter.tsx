import { motion } from 'motion/react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SectionChapterProps {
  number: string;
  title: string;
  dark?: boolean;
}

export default function SectionChapter({ number, title, dark = false }: SectionChapterProps) {
  return (
    <div
      className={`border-b ${dark ? 'bg-neutral-950 text-white border-white/10' : 'bg-white text-neutral-900 border-neutral-200'}`}
      data-testid={`chapter-${number}`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 flex items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-4 sm:gap-6 min-w-0"
        >
          <span className="w-1 h-9 rounded-full bg-[#1e6fd9] shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <span
              data-testid={`chapter-title-${number}`}
              className={`block font-display text-base md:text-lg font-semibold tracking-tight ${dark ? 'text-white' : 'text-[#0b2545]'}`}
            >
              {title}
            </span>
            <span className={`block mt-1 font-sans text-xs ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {({
                'Sistemi di Gestione': 'Qualità, ambiente e sicurezza. Un’unica visione.',
                'I Nostri Servizi': 'Competenze diverse, un unico partner.',
                'Il Nostro Metodo': 'Dall’ascolto a un percorso su misura.',
                'Formazione': 'Conoscenze che diventano buone pratiche.',
                'Perché Sceglierci': 'Al fianco delle persone, dentro le aziende.',
                'Affiliazioni': 'Una rete di competenze condivise.',
                'Il Gruppo': 'Specializzazioni che lavorano insieme.',
                'Hanno Creduto in Noi': 'Relazioni costruite sul campo.',
                'Domande Frequenti': 'Risposte chiare, prima di cominciare.',
                'Contatti': 'Il primo passo è parlarne.',
                'Il Fondatore': 'La visione da cui tutto è iniziato.',
              } as Record<string, string>)[title]}
            </span>
          </div>
        </motion.div>
        <span
          className={`hidden md:block font-sans text-[10px] uppercase tracking-[0.32em] ${
            dark ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          E.M Safety — Manifesto
        </span>
      </div>
    </div>
  );
}
