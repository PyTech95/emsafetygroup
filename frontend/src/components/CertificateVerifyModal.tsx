import { useState, type FormEvent } from 'react';
import {
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  Download,
  Calendar,
  User,
  Building,
  Award,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundFX } from '../utils/audio';

interface CertificateRecord {
  code: string;
  workerName: string;
  taxCode: string;
  companyName: string;
  courseTitle: string;
  legalRef: string;
  hours: number;
  issueDate: string;
  expireDate: string;
  status: 'valido' | 'in_scadenza' | 'scaduto';
  trainerName: string;
  protocolNumber: string;
}

const DEMO_CERTIFICATES: Record<string, CertificateRecord> = {
  'EMS-2026-8108-A94': {
    code: 'EMS-2026-8108-A94',
    workerName: 'Marco Bellini',
    taxCode: 'BLLMRC84M15L736X',
    companyName: 'Officine Meccaniche Trevigiane S.p.A.',
    courseTitle: 'Formazione Specifica Lavoratori - Rischio Alto (12 Ore)',
    legalRef: 'Art. 37 D.Lgs 81/08 e Accordo Stato-Regioni 21/12/2011',
    hours: 12,
    issueDate: '18/02/2026',
    expireDate: '18/02/2031',
    status: 'valido',
    trainerName: 'Ing. Roberto De Luca (Docente Formatore Qualificato D.I. 06/03/2013)',
    protocolNumber: 'REG-VEN-2026/049182',
  },
  'EMS-2025-PRP-772': {
    code: 'EMS-2025-PRP-772',
    workerName: 'Elena Vianello',
    taxCode: 'VNLLNE90A41H501Z',
    companyName: 'Logistica Integrata Lombarda S.r.l.',
    courseTitle: 'Corso per Preposti della Sicurezza e Gestione Cantieri (8 Ore)',
    legalRef: 'Art. 37 c. 7 D.Lgs 81/08 e Accordo 2026',
    hours: 8,
    issueDate: '10/11/2025',
    expireDate: '10/11/2027',
    status: 'valido',
    trainerName: 'Dott.ssa Silvia Brambilla (HSE Lead Auditor)',
    protocolNumber: 'REG-LOM-2025/110294',
  },
  'EMS-2026-RSPP-101': {
    code: 'EMS-2026-RSPP-101',
    workerName: 'Ing. Alessandro Marchesi',
    taxCode: 'MRCLSN78D12F205T',
    companyName: 'Costruzioni & Infrastrutture Milano S.p.A.',
    courseTitle: 'Aggiornamento Quinquennale RSPP / ASPP (40 Ore)',
    legalRef: 'Art. 32 D.Lgs 81/08 e Accordo Stato-Regioni 07/07/2016',
    hours: 40,
    issueDate: '14/01/2026',
    expireDate: '14/01/2031',
    status: 'valido',
    trainerName: 'Commissione Scientifica E.M Safety & OPN Paritetico',
    protocolNumber: 'REG-NAZ-2026/001924',
  },
};

interface CertificateVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateVerifyModal({ isOpen, onClose }: CertificateVerifyModalProps) {
  const [inputCode, setInputCode] = useState('EMS-2026-8108-A94');
  const [searchedRecord, setSearchedRecord] = useState<CertificateRecord | null>(DEMO_CERTIFICATES['EMS-2026-8108-A94']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    soundFX.playLaser();
    const clean = inputCode.trim().toUpperCase();
    if (DEMO_CERTIFICATES[clean]) {
      setSearchedRecord(DEMO_CERTIFICATES[clean]);
      setErrorMsg(null);
      soundFX.playChime();
    } else {
      setSearchedRecord(null);
      setErrorMsg(`Nessun attestato censito con il codice "${clean}". Verifica il codice QR o la stringa crittografica.`);
      soundFX.playBeep(300);
    }
  };

  const handleSelectDemo = (code: string) => {
    soundFX.playLaser();
    setInputCode(code);
    setSearchedRecord(DEMO_CERTIFICATES[code]);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-800"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#0b2545] shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  REGISTRO NAZIONALE ATTESTATI QR
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e6fd9]"></span>
              </div>
              <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0b2545]">
                Verifica Autenticità &amp; Validità Legale
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playBeep(450);
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-[#0b2545] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Inserisci codice attestato (es. EMS-2026-8108-A94)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[13px] font-semibold text-slate-800 focus:border-[#0b2545] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[13.5px] font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm border-b-2 border-[#1e6fd9]"
            >
              <span>Verifica</span>
            </button>
          </form>

          {/* Quick Demo Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[11.5px] text-slate-500 font-bold">ESEMPI RAPIDI:</span>
            {Object.keys(DEMO_CERTIFICATES).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleSelectDemo(code)}
                className={`px-3 py-1 rounded-lg text-[11.5px] font-mono transition-all border cursor-pointer ${
                  inputCode === code
                    ? 'bg-[#0b2545] text-white border-[#0b2545] font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-[#9ec7f0] rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#155bb0] flex-shrink-0 mt-0.5" />
              <p className="font-sans text-[13.5px] text-amber-900 font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Certificate Record Result */}
          {searchedRecord && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f1fc] border border-[#cfe3f8] text-[#0b2545] font-sans text-[11.5px] font-bold uppercase mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1e6fd9]" />
                    Attestato valido e regolarmente archiviato
                  </span>
                  <h4 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#0b2545]">
                    {searchedRecord.courseTitle}
                  </h4>
                  <span className="font-sans text-[12px] text-slate-500 font-medium">
                    Rif. Normativo: {searchedRecord.legalRef}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-sans text-[11px] text-slate-500 font-bold block">DURATA</span>
                  <span className="font-serif text-[18px] font-bold text-[#0b2545]">{searchedRecord.hours} Ore</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-sans">
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-[11px] font-bold block uppercase">LAVORATORE ABILITATO</span>
                    <strong className="text-[#0b2545] font-serif text-[15px]">{searchedRecord.workerName}</strong>
                    <span className="text-slate-500 block text-[11.5px] font-mono">C.F. {searchedRecord.taxCode}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-[#155bb0] mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-[11px] font-bold block uppercase">DATORE DI LAVORO / AZIENDA</span>
                    <strong className="text-slate-800 font-sans text-[14px]">{searchedRecord.companyName}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-[11px] font-bold block uppercase">DATE RILASCIO &amp; SCADENZA</span>
                    <span className="text-slate-700 block">Rilasciato il: {searchedRecord.issueDate}</span>
                    <span className="text-amber-800 block font-bold">Scadenza: {searchedRecord.expireDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-blue-700 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-[11px] font-bold block uppercase">DOCENTE &amp; PROTOCOLLO REGIONALE</span>
                    <span className="text-slate-700 text-[12.5px] block">{searchedRecord.trainerName}</span>
                    <span className="text-[#0b2545] font-mono text-[11px] block font-bold">{searchedRecord.protocolNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[12px] font-sans text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Firma digitale crittografica SHA-256 verificata</span>
                </div>
                <button
                  type="button"
                  onClick={() => soundFX.playChime()}
                  className="inline-flex items-center gap-1.5 text-[#0b2545] hover:underline cursor-pointer font-bold"
                >
                  <Download className="w-3.5 h-3.5 text-[#155bb0]" />
                  <span>Copia PDF di Conformità</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
