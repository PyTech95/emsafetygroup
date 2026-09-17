import { useState, useEffect } from 'react';
import {
  Calculator,
  QrCode,
  Sparkles,
  Send,
  ChevronUp,
  X,
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface QuickActionDockProps {
  onOpenSimulator: () => void;
  onOpenCertificateVerify: () => void;
  onOpenGapAnalysis: () => void;
  onOpenQuote: () => void;
}

export default function QuickActionDock({
  onOpenSimulator,
  onOpenCertificateVerify,
  onOpenGapAnalysis,
  onOpenQuote,
}: QuickActionDockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 250px
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            soundFX.playLaser();
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 bg-white text-[#0b2545] px-4 py-2.5 rounded-full shadow-lg border border-slate-200 font-sans text-[12px] font-bold hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#1e6fd9]" />
          <span>STRUMENTI RAPIDI</span>
          <ChevronUp className="w-3.5 h-3.5 text-[#0b2545]" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Strumenti Rapidi E.M Safety"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-max"
    >
      <div className="bg-white/95 backdrop-blur-xl text-slate-800 px-3 sm:px-4 py-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-1.5 sm:gap-2">
        {/* Tool 1: Calcola Obblighi */}
        <button
          onClick={() => {
            soundFX.playLaser();
            onOpenSimulator();
          }}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 font-sans text-[12px] font-bold transition-all text-left cursor-pointer group"
          title="Simula obblighi normativi e sanzioni prevenute"
        >
          <div className="w-7 h-7 rounded-lg bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#0b2545] group-hover:scale-105 transition-transform">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <span className="hidden md:inline">Simulatore 2026</span>
          <span className="md:hidden">Simulatore</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* Tool 2: Verifica Attestato */}
        <button
          onClick={() => {
            soundFX.playLaser();
            onOpenCertificateVerify();
          }}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 font-sans text-[12px] font-bold transition-all text-left cursor-pointer group"
          title="Verifica autenticità attestato o codice QR"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#155bb0] group-hover:scale-105 transition-transform">
            <QrCode className="w-3.5 h-3.5" />
          </div>
          <span className="hidden md:inline">Verifica Attestato</span>
          <span className="md:hidden">Attestati</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* Tool 3: Gap Analysis */}
        <button
          onClick={() => {
            soundFX.playLaser();
            onOpenGapAnalysis();
          }}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 font-sans text-[12px] font-bold transition-all text-left cursor-pointer group"
          title="Checkup rapido conformità aziendale"
        >
          <div className="w-7 h-7 rounded-lg bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#0b2545] group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="hidden md:inline">Checkup HSE</span>
          <span className="md:hidden">Checkup</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* Tool 4: Preventivo 24h */}
        <button
          onClick={() => {
            soundFX.playLaser();
            onOpenQuote();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[12.5px] font-bold transition-all shadow-sm cursor-pointer border-b-2 border-[#1e6fd9]"
        >
          <Send className="w-3.5 h-3.5 text-[#1e6fd9]" />
          <span>Preventivo</span>
        </button>

        {/* Minimize Button */}
        <button
          onClick={() => {
            soundFX.playBeep(400);
            setIsMinimized(true);
          }}
          className="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors ml-1 cursor-pointer"
          title="Riduci barra strumenti"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}
