import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFX } from '../utils/audio';

interface GapAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestAssistance: (summary: string) => void;
}

export default function GapAnalysisModal({
  isOpen,
  onClose,
  onRequestAssistance,
}: GapAnalysisModalProps) {
  const [dvrStatus, setDvrStatus] = useState<'updated' | 'expired' | 'missing'>('updated');
  const [trainingStatus, setTrainingStatus] = useState<'all' | 'partial' | 'unknown'>('partial');
  const [prepostiStatus, setPrepostiStatus] = useState<'appointed' | 'toUpdate' | 'none'>('toUpdate');
  const [emergencyTeam, setEmergencyTeam] = useState<'trained' | 'toRenew' | 'none'>('trained');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const calculateRiskIndex = () => {
    let score = 100;
    if (dvrStatus === 'expired') score -= 30;
    if (dvrStatus === 'missing') score -= 50;

    if (trainingStatus === 'partial') score -= 20;
    if (trainingStatus === 'unknown') score -= 35;

    if (prepostiStatus === 'toUpdate') score -= 15;
    if (prepostiStatus === 'none') score -= 25;

    if (emergencyTeam === 'toRenew') score -= 15;
    if (emergencyTeam === 'none') score -= 30;

    return Math.max(10, score);
  };

  const score = calculateRiskIndex();

  const handleComplete = () => {
    soundFX.playLaser();
    setSubmitted(true);
    soundFX.playChime();
  };

  const handleTransferToQuote = () => {
    soundFX.playLaser();
    const summary = `Esito autovalutazione Gap Analysis: Conformità stimata al ${score}%. DVR: ${dvrStatus}, Formazione: ${trainingStatus}, Preposti: ${prepostiStatus}, Emergenze: ${emergencyTeam}.`;
    onRequestAssistance(summary);
    onClose();
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
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-800"
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
              CHECK-UP VELOCE HSE • D.LGS 81/08
            </span>
          </div>
          <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#0b2545]">
            Gap Analysis di Sicurezza Aziendale
          </h2>
          <p className="font-sans text-[14.5px] text-slate-600 mt-1">
            Rispondi a 4 semplici quesiti per una valutazione istantanea dei punti critici del tuo sistema HSE.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {!submitted ? (
            <div className="space-y-6">
              {/* Question 1: DVR */}
              <div>
                <label className="block font-sans text-[12px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
                  1. Stato del Documento di Valutazione dei Rischi (DVR):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(750);
                      setDvrStatus('updated');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      dvrStatus === 'updated'
                        ? 'border-[#0b2545] bg-[#0b2545] font-bold text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Aggiornato di recente (&lt; 1 anno)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(750);
                      setDvrStatus('expired');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      dvrStatus === 'expired'
                        ? 'border-[#1e6fd9] bg-amber-50 font-bold text-amber-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Non aggiornato / Modifiche recenti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(750);
                      setDvrStatus('missing');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      dvrStatus === 'missing'
                        ? 'border-[#0b2545] bg-[#cfe3f8]/80 font-bold text-[#0b2545] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Da redigere / Non reperibile
                  </button>
                </div>
              </div>

              {/* Question 2: Training */}
              <div>
                <label className="block font-sans text-[12px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
                  2. Formazione Generale e Specifica Lavoratori:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(800);
                      setTrainingStatus('all');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      trainingStatus === 'all'
                        ? 'border-[#0b2545] bg-[#0b2545] font-bold text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    100% dipendenti formati e in regola
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(800);
                      setTrainingStatus('partial');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      trainingStatus === 'partial'
                        ? 'border-[#1e6fd9] bg-amber-50 font-bold text-amber-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Neoassunti o scadenze da regolarizzare
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(800);
                      setTrainingStatus('unknown');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      trainingStatus === 'unknown'
                        ? 'border-[#0b2545] bg-[#cfe3f8]/80 font-bold text-[#0b2545] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Situazione non monitorata
                  </button>
                </div>
              </div>

              {/* Question 3: Preposti */}
              <div>
                <label className="block font-sans text-[12px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
                  3. Figura del Preposto (Legge 215/2021 &amp; Accordo 2026):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(850);
                      setPrepostiStatus('appointed');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      prepostiStatus === 'appointed'
                        ? 'border-[#0b2545] bg-[#0b2545] font-bold text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Nomine formali e formazione biennale attive
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(850);
                      setPrepostiStatus('toUpdate');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      prepostiStatus === 'toUpdate'
                        ? 'border-[#1e6fd9] bg-amber-50 font-bold text-amber-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Preposti di fatto senza nomina scritta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(850);
                      setPrepostiStatus('none');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      prepostiStatus === 'none'
                        ? 'border-[#0b2545] bg-[#cfe3f8]/80 font-bold text-[#0b2545] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Nessun preposto formalizzato
                  </button>
                </div>
              </div>

              {/* Question 4: Emergency Team */}
              <div>
                <label className="block font-sans text-[12px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
                  4. Squadra Emergenze (Antincendio &amp; Primo Soccorso):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(900);
                      setEmergencyTeam('trained');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      emergencyTeam === 'trained'
                        ? 'border-[#0b2545] bg-[#0b2545] font-bold text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Addetti sufficienti con aggiornamenti in corso
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(900);
                      setEmergencyTeam('toRenew');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      emergencyTeam === 'toRenew'
                        ? 'border-[#1e6fd9] bg-amber-50 font-bold text-amber-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Aggiornamenti triennali/quinquennali scaduti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playBeep(900);
                      setEmergencyTeam('none');
                    }}
                    className={`p-3.5 rounded-xl border text-left font-sans text-[12px] transition-all cursor-pointer ${
                      emergencyTeam === 'none'
                        ? 'border-[#0b2545] bg-[#cfe3f8]/80 font-bold text-[#0b2545] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Squadra incompleta o assente
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                className="w-full py-4 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-[#1e6fd9]"
              >
                <span>Elabora Indice di Conformità</span>
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Visual */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="font-sans text-[12px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">
                  INDICE STIMATO DI CONFORMITÀ AZIENDALE
                </span>
                <div className="text-[54px] font-serif font-bold text-[#0b2545] my-2">
                  {score}%
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden max-w-md mx-auto">
                  <div
                    className={`h-full transition-all duration-700 ${
                      score > 80 ? 'bg-[#0b2545]' : score > 50 ? 'bg-[#1e6fd9]' : 'bg-[#155bb0]'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>

                <p className="font-sans text-[14px] text-slate-600 mt-4 max-w-md mx-auto leading-relaxed">
                  {score > 80
                    ? 'Il tuo assetto è in un buon intervallo di conformità. Consigliamo comunque un checkup periodico sulle modifiche del nuovo Accordo 2026.'
                    : score > 50
                    ? 'Attenzione: emergono scostamenti normativi che espongono l’azienda a possibili prescrizioni e sanzioni in caso di controllo ASL/ITL.'
                    : 'Criticità elevata: il mancato adempimento di DVR o formazione espone gli amministratori a rischi di responsabilità penale immediata.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-1/3 py-3 px-4 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl font-sans text-[13px] font-bold cursor-pointer transition-colors"
                >
                  Ricalcola
                </button>
                <button
                  type="button"
                  onClick={handleTransferToQuote}
                  className="w-full sm:w-2/3 py-3.5 px-4 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13.5px] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-[#1e6fd9]"
                >
                  <span>Richiedi Audit Correttivo Gratuito</span>
                  <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
