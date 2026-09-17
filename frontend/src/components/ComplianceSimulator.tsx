import { useState, useMemo } from 'react';
import {
  Calculator,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  TrendingDown,
  Building,
  HardHat,
  Users,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '../utils/audio';

interface ComplianceSimulatorProps {
  onApplyToQuote: (details: string) => void;
}

export default function ComplianceSimulator({ onApplyToQuote }: ComplianceSimulatorProps) {
  const [companySize, setCompanySize] = useState<'micro' | 'small' | 'medium' | 'large' | 'enterprise'>('small');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [hasChemicals, setHasChemicals] = useState(false);
  const [hasWorkAtHeight, setHasWorkAtHeight] = useState(false);
  const [hasForklifts, setHasForklifts] = useState(true);
  const [needExternalRspp, setNeedExternalRspp] = useState(true);

  // Computations
  const results = useMemo(() => {
    let baseWorkerHours = riskLevel === 'low' ? 8 : riskLevel === 'medium' ? 12 : 16;
    let prepostoHours = 8;
    let emergencyHours = riskLevel === 'high' ? 28 : riskLevel === 'medium' ? 20 : 16;

    const documents: { name: string; legalRef: string; priority: 'urgente' | 'obbligatorio' }[] = [
      { name: 'Documento Valutazione Rischi (DVR)', legalRef: 'Art. 28 D.Lgs 81/08', priority: 'urgente' },
      { name: 'Piano di Emergenza ed Evacuazione', legalRef: 'D.M. 02/09/2021', priority: 'obbligatorio' },
      { name: 'Nomina Medico Competente & Sorveglianza Sanitaria', legalRef: 'Art. 25 D.Lgs 81/08', priority: 'obbligatorio' },
    ];

    if (riskLevel === 'high' || hasChemicals) {
      documents.push({ name: 'Valutazione Rischio Chimico / ATEX', legalRef: 'Titolo IX D.Lgs 81/08', priority: 'urgente' });
    }
    if (hasWorkAtHeight) {
      documents.push({ name: 'Piano Operativo Sicurezza (POS) e Rischio Caduta', legalRef: 'Titolo IV D.Lgs 81/08', priority: 'urgente' });
    }
    if (hasForklifts) {
      documents.push({ name: 'Regolamento Circolazione Interna & Verifiche Mezzi', legalRef: 'Accordo Stato-Regioni 22/02/2012', priority: 'obbligatorio' });
    }

    let estimatedMaxSanction =
      riskLevel === 'high'
        ? '€ 65.000 – € 110.000+ (Arresto fino a 6 mesi per DL)'
        : riskLevel === 'medium'
        ? '€ 28.000 – € 64.000 (Sospensione attività per gravi violazioni)'
        : '€ 12.000 – € 32.000 (Sanzioni amministrative ed emendative)';

    let inailSaving =
      companySize === 'micro'
        ? '€ 450 – € 1.200 / anno'
        : companySize === 'small'
        ? '€ 1.800 – € 3.800 / anno'
        : companySize === 'medium'
        ? '€ 5.200 – € 12.000 / anno'
        : companySize === 'large'
        ? '€ 15.000 – € 34.000 / anno'
        : '€ 40.000 – € 95.000+ / anno';

    let refresherMonths = 24;

    return {
      baseWorkerHours,
      prepostoHours,
      emergencyHours,
      documents,
      estimatedMaxSanction,
      inailSaving,
      refresherMonths,
    };
  }, [companySize, riskLevel, hasChemicals, hasWorkAtHeight, hasForklifts]);

  const handleApply = () => {
    soundFX.playChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0b2545', '#1d4ed8', '#f59e0b', '#fbbf24'],
      });
    } catch {}

    const summary = `Simulazione Obblighi: Organico ${companySize.toUpperCase()}, Rischio ${riskLevel.toUpperCase()}, Chimico: ${
      hasChemicals ? 'Sì' : 'No'
    }, Lavori in Quota: ${hasWorkAtHeight ? 'Sì' : 'No'}, Carrelli: ${
      hasForklifts ? 'Sì' : 'No'
    }, RSPP Esterno: ${needExternalRspp ? 'Richiesto' : 'No'}`;
    onApplyToQuote(summary);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e6fd9] animate-ping" />
            <span className="font-mono text-[11.5px] font-bold text-[#0b2545] tracking-widest uppercase">
              CALCOLATORE REGOLAMENTARE D.LGS 81/08 &amp; REVISIONE 2026
            </span>
          </div>
          <h2 className="font-serif text-[28px] sm:text-[36px] font-bold text-[#0b2545] tracking-tight">
            Simulatore Obblighi, Sanzioni &amp; Sgravi INAIL
          </h2>
          <p className="font-sans text-[15px] text-slate-600 max-w-2xl mt-1">
            Imposta i parametri della tua azienda: il motore di calcolo E.M Safety determina in tempo reale ore di formazione, documenti obbligatori, sanzioni evitabili e sconto tariffario OT23.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#e8f1fc] p-3.5 rounded-2xl border border-[#cfe3f8] self-start lg:self-auto">
          <Cpu className="w-5 h-5 text-[#0b2545]" />
          <div className="text-left font-sans text-[12px]">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">MOTORE DI CALCOLO</span>
            <span className="text-[#0b2545] font-bold">Accordo Stato-Regioni 2026</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls (Left 6 cols) & Output (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 relative z-10">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Company Size */}
          <div>
            <label className="block font-sans text-[13px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
              1. Dimensione Organico Lavoratori
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'micro', label: '1 - 5', desc: 'Micro' },
                { id: 'small', label: '6 - 15', desc: 'Piccola' },
                { id: 'medium', label: '16 - 50', desc: 'Media' },
                { id: 'large', label: '51 - 200', desc: 'Grande' },
                { id: 'enterprise', label: '> 200', desc: 'Corp' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundFX.playBeep(750);
                    setCompanySize(opt.id as any);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    companySize === opt.id
                      ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-100'
                  }`}
                >
                  <span className={`font-mono text-[14px] font-bold block ${companySize === opt.id ? 'text-white' : 'text-[#0b2545]'}`}>{opt.label}</span>
                  <span className="font-sans text-[10px] opacity-75 block uppercase tracking-wider">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Risk Sector */}
          <div>
            <label className="block font-sans text-[13px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
              2. Classe di Rischio ATECO
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  id: 'low',
                  label: 'Rischio Basso',
                  sub: 'Uffici, Commercio, Servizi',
                  badge: '8h Base',
                },
                {
                  id: 'medium',
                  label: 'Rischio Medio',
                  sub: 'Logistica, Trasporti, Hub',
                  badge: '12h Base',
                },
                {
                  id: 'high',
                  label: 'Rischio Alto',
                  sub: 'Edilizia, Meccanica, Chimico',
                  badge: '16h Base',
                },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    soundFX.playBeep(850);
                    setRiskLevel(r.id as any);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    riskLevel === r.id
                      ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-100'
                  }`}
                >
                  <span className={`font-serif text-[14.5px] font-bold block mb-1 ${riskLevel === r.id ? 'text-white' : 'text-[#0b2545]'}`}>{r.label}</span>
                  <span className="font-sans text-[11px] opacity-80 block leading-snug line-clamp-1">{r.sub}</span>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      riskLevel === r.id ? 'bg-[#1e6fd9] text-[#0b2545]' : 'bg-[#e8f1fc] text-[#0b2545] border border-[#cfe3f8]'
                    }`}
                  >
                    {r.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Specific Risk Factors Checkboxes */}
          <div>
            <label className="block font-sans text-[13px] font-bold text-[#0b2545] mb-2 uppercase tracking-wider">
              3. Fattori di Rischio Specifici &amp; Incarico RSPP
            </label>
            <div className="space-y-2">
              {[
                {
                  state: hasForklifts,
                  setter: setHasForklifts,
                  label: 'Uso Carrelli Elevatori / Muletti / PLE',
                  desc: 'Obbligo patentino attrezzature 12h + aggiornamento quinquennale',
                },
                {
                  state: hasWorkAtHeight,
                  setter: setHasWorkAtHeight,
                  label: 'Lavori in Quota (> 2m) / Scale / Ponteggi',
                  desc: 'Obbligo DPI 3° Categoria, PiMUS e linee vita anticaduta',
                },
                {
                  state: hasChemicals,
                  setter: setHasChemicals,
                  label: 'Sostanze Chimiche / Polveri / ATEX',
                  desc: 'Valutazione MoVaRisCh, DPCE, schede di sicurezza SDS aggiornate',
                },
                {
                  state: needExternalRspp,
                  setter: setNeedExternalRspp,
                  label: 'Incarico RSPP Esterno E.M Safety',
                  desc: 'Assunzione di responsabilità tecnica e supporto continuo alle scadenze',
                },
              ].map((item, idx) => (
                <label
                  key={idx}
                  onClick={() => soundFX.playBeep(900)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    item.state
                      ? 'bg-[#e8f1fc]/70 border-blue-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#0b2545] focus:ring-[#0b2545] accent-[#0b2545]"
                  />
                  <div>
                    <span className="font-sans text-[14px] font-bold text-[#0b2545] block leading-snug">
                      {item.label}
                    </span>
                    <span className="font-sans text-[12px] text-slate-500 block leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output Card */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1e6fd9]" />
                <h3 className="font-serif text-[19px] sm:text-[21px] font-bold text-[#0b2545]">
                  Diagnostica Preventiva Calcolata
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-[#cfe3f8] text-[#0b2545] border border-[#cfe3f8]">
                SCUDO ATTIVO
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                <Users className="w-4 h-4 text-[#0b2545] mx-auto mb-1" />
                <span className="font-sans text-[10px] text-slate-500 font-bold block uppercase">
                  FORMAZIONE LAVORATORI
                </span>
                <span className="font-mono text-[18px] font-bold text-[#0b2545]">
                  {results.baseWorkerHours} Ore
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                <Clock className="w-4 h-4 text-[#155bb0] mx-auto mb-1" />
                <span className="font-sans text-[10px] text-slate-500 font-bold block uppercase">
                  AGGIORN. PREPOSTI
                </span>
                <span className="font-mono text-[18px] font-bold text-amber-700">
                  Ogni {results.refresherMonths} Mesi
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="font-sans text-[10px] text-slate-500 font-bold block uppercase">
                  SQUADRE EMERGENZA
                </span>
                <span className="font-mono text-[18px] font-bold text-blue-700">
                  {results.emergencyHours} Ore Tot
                </span>
              </div>
            </div>

            {/* Financial Impact 1: Sgravio INAIL OT23 */}
            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-amber-900">
                  <TrendingDown className="w-4 h-4 text-[#155bb0]" />
                  <span className="font-sans text-[12px] font-bold uppercase">
                    Risparmio Annuo Stimato Premio INAIL (Modello OT23)
                  </span>
                </div>
                <span className="font-mono text-[10.5px] font-bold text-amber-900 bg-[#e8f1fc] px-2 py-0.5 rounded border border-[#9ec7f0]">
                  FINO A -28%
                </span>
              </div>
              <span className="font-mono text-[24px] font-extrabold text-[#0b2545] block">
                {results.inailSaving}
              </span>
              <span className="font-sans text-[12px] text-slate-600 block mt-0.5">
                Ottenibile implementando piani formativi asseverati e modelli conformi ISO 45001.
              </span>
            </div>

            {/* Financial Impact 2: Sanctions Prevention */}
            <div className="bg-amber-50 p-4 rounded-xl border border-[#9ec7f0] mb-4">
              <div className="flex items-center gap-2 text-amber-900 mb-1">
                <AlertTriangle className="w-4 h-4 text-[#155bb0]" />
                <span className="font-sans text-[12px] font-bold uppercase">
                  Sanzioni Economiche &amp; Penali Evitate
                </span>
              </div>
              <span className="font-mono text-[14px] font-bold text-[#0b2545] block">
                {results.estimatedMaxSanction}
              </span>
              <span className="font-sans text-[11.5px] text-slate-700 block mt-0.5">
                Rischio azzerato affidando il presidio legale e documentale a E.M Safety.
              </span>
            </div>

            {/* Documents Checklist Preview */}
            <div>
              <span className="font-sans text-[12px] font-bold text-[#0b2545] uppercase tracking-wider block mb-2">
                Documenti Asseverati Generati:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {results.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-[12.5px] shadow-2xs"
                  >
                    <div className="flex items-center gap-2 text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">{doc.legalRef}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleApply}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14.5px] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-b-2 border-[#1e6fd9]"
            >
              <span>Esporta Dati nel Modulo Preventivo</span>
              <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
            </button>
            <span className="text-[11.5px] font-sans text-center block text-slate-500 mt-2">
              Nessun impegno • I nostri ingegneri elaboreranno la proposta entro 24 ore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
