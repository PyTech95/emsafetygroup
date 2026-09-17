import { X, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFX } from '../utils/audio';

interface LegalModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export default function LegalModal({ isOpen, title, content, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      data-testid="legal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col text-slate-800"
      >
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5 text-[#0b2545]">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 id="legal-modal-title" data-testid="legal-modal-title" className="font-serif text-[18px] font-bold text-[#0b2545]">{title}</h3>
          </div>
          <button
            onClick={() => {
              soundFX.playBeep(450);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-[#0b2545] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Chiudi"
            data-testid="legal-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div data-testid="legal-modal-content" className="p-6 text-slate-600 font-sans text-[14.5px] leading-relaxed space-y-3 max-h-[70vh] overflow-y-auto">
          <p>{content}</p>
          <div className="pt-3 border-t border-slate-200 font-sans text-[12px] text-slate-500">
            Per ulteriori informazioni o richieste sui propri dati, è sempre possibile contattare il Responsabile della Protezione Dati (DPO) all'indirizzo e-mail:{' '}
            <strong className="text-[#0b2545] font-semibold">privacy@emsafetygroup.it</strong>.
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            data-testid="legal-modal-confirm"
            onClick={() => {
              soundFX.playLaser();
              onClose();
            }}
            className="px-5 py-2.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13.5px] font-bold rounded-xl transition-all cursor-pointer shadow-sm border-b-2 border-[#1e6fd9]"
          >
            Ho compreso
          </button>
        </div>
      </motion.div>
    </div>
  );
}
