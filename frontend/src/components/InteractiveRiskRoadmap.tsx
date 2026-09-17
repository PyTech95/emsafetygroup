import { useState } from 'react';
import {
  Factory,
  HardHat,
  Building,
  FlaskConical,
  Truck,
  AlertTriangle,
  FileText,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '../utils/audio';

interface SectorInfo {
  id: string;
  name: string;
  icon: typeof Factory;
  riskLevel: 'Basso' | 'Medio' | 'Alto';
  riskScore: number;
  atecoDescription: string;
  formationHours: string;
  requiredDocuments: string[];
  keyObligations: string[];
  description: string;
}

const sectors: SectorInfo[] = [
  {
    id: 'manifattura',
    name: 'Manifattura & Meccanica',
    icon: Factory,
    riskLevel: 'Alto',
    riskScore: 85,
    atecoDescription: 'Codici ATECO C (Metallurgia, Macchinari, Lavorazioni industriali)',
    formationHours: '16 ore (4h Generale + 12h Specifica)',
    requiredDocuments: [
      'DVR Completo con Valutazione Macchine (Direttiva Macchine)',
      'Valutazione Rischio Rumore & Vibrazioni Meccaniche',
      'Piano di Gestione Sostanze Chimiche e Schede SDS',
      'Nomina RSPP / Medico Competente con Visite Periodiche',
    ],
    keyObligations: [
      'Addetti Antincendio Livello 2 o 3 (Alto Rischio)',
      'Patentino Carrelli Elevatori & Gru a Ponte',
      'Sorveglianza Sanitaria Annuale Obbligatoria',
      'Verifiche Impianti Elettrici e di Messa a Terra (DPR 462/01)',
    ],
    description:
      'Impianti produttivi caratterizzati da linee meccanizzate, movimentazione carichi e rumore continuo. Richiede audit strumentali e procedure operative LOTO.',
  },
  {
    id: 'edilizia',
    name: 'Cantieri, Edilizia & Impianti',
    icon: HardHat,
    riskLevel: 'Alto',
    riskScore: 95,
    atecoDescription: 'Codici ATECO F (Costruzioni, Ristrutturazioni, Impiantistica)',
    formationHours: '16 ore (Lavoratori) + 40h (Preposti) + Coordinatori CSP/CSE',
    requiredDocuments: [
      'POS (Piano Operativo di Sicurezza) specifico di cantiere',
      'PSC (Piano di Sicurezza e Coordinamento) e Fascicolo dell’Opera',
      'Pi.M.U.S. (Piano Montaggio, Uso e Smontaggio Ponteggi)',
      'Dichiarazioni di Conformità e Verifiche Attrezzature',
    ],
    keyObligations: [
      'Lavori in Quota e Formazione DPI di 3° Categoria',
      'Abilitazione Piattaforme Aeree (PLE) e Macchine Movimento Terra',
      'Coordinamento Sicurezza in fase di Progettazione ed Esecuzione',
      'Tesserini di riconoscimento cantiere e verifica idoneità tecnico-professionale',
    ],
    description:
      'Ambienti dinamici con rischi di caduta dall’alto, interferenze tra imprese e cantierizzazione stradale. E.M Safety redige POS asseverati e garantisce sopralluoghi continui.',
  },
  {
    id: 'terziario',
    name: 'Uffici, Studi & Servizi',
    icon: Building,
    riskLevel: 'Basso',
    riskScore: 35,
    atecoDescription: 'Codici ATECO J, K, M, N (Servizi, Software, Consulenza, Amministrazione)',
    formationHours: '8 ore (4h Generale + 4h Specifica)',
    requiredDocuments: [
      'DVR Semplificato per Uffici e Postazioni VDT',
      'Valutazione Rischio Stress Lavoro-Correlato',
      'Piano di Emergenza ed Evacuazione con Planimetrie',
      'Valutazione Ergonomia delle Postazioni e Microclima',
    ],
    keyObligations: [
      'Addetti Antincendio Livello 1 (Basso Rischio)',
      'Primo Soccorso Aziendale (Gruppo B o C)',
      'Formazione Generale e Specifica Lavoratori a video',
      'Rappresentante dei Lavoratori per la Sicurezza (RLS)',
    ],
    description:
      'Settori a basso rischio focalizzati su ergonomia, benessere lavorativo, sicurezza elettrica e procedure di evacuazione rapide in caso di emergenza.',
  },
  {
    id: 'chimico',
    name: 'Chimico, Pharma & Laboratori',
    icon: FlaskConical,
    riskLevel: 'Alto',
    riskScore: 90,
    atecoDescription: 'Codici ATECO 20, 21 (Industria Chimica, Farmaceutica, Cosmetica, Laboratori)',
    formationHours: '16 ore (4h Generale + 12h Specifica) + Formazione Rischio Chimico',
    requiredDocuments: [
      'Valutazione Rischio Chimico, Cancerogeno e Mutageno (Titolo IX)',
      'Valutazione Atmosfere Esplosive (ATEX - Titolo XI)',
      'Piano di Gestione Rifiuti Pericolosi ed Emergenze Ambientali',
      'Protocollo di Monitoraggio Biologico dei Lavoratori Esposti',
    ],
    keyObligations: [
      'Stoccaggio Seveso / Normativa REACH e CLP',
      'Addestramento all’Uso di Autoprotettori e Maschere Facciali',
      'Verifica Efficienza Cappe di Aspirazione e Filtri Assoluti',
      'Nomina Consulente ADR per il Trasporto Merci Pericolose',
    ],
    description:
      'Massima attenzione alla manipolazione di agenti chimici pericolosi, etichettatura corretta e prevenzione degli incidenti rilevanti.',
  },
  {
    id: 'logistica',
    name: 'Logistica, Magazzini & Trasporti',
    icon: Truck,
    riskLevel: 'Medio',
    riskScore: 68,
    atecoDescription: 'Codici ATECO H (Trasporto Merci, Magazzinaggio, Spedizioni, Hub Intermodali)',
    formationHours: '12 ore (4h Generale + 8h Specifica)',
    requiredDocuments: [
      'Valutazione Rischio Movimentazione Manuale Carichi (Metodo NIOSH/Snook)',
      'Planimetria Viabilità Interna ed Esterna con Segnaletica',
      'Verifica Periodica Scaffalature Metalliche (UNI EN 15635)',
      'DUVRI per Autisti Terzi e Personale di Cooperativa in Appalto',
    ],
    keyObligations: [
      'Abilitazione Carrelli Elevatori (Muletto Frontale e Retrattile)',
      'Gestione Interferenze tra Pedoni e Mezzi di Movimentazione',
      'DPI Alta Visibilità e Calzature Antinfortunistiche S3',
      'Verifica Idoneità delle Imprese di Trasporto Partner',
    ],
    description:
      'Flussi intensi di merci e macchine operatrici. Obiettivo prioritario: separazione fisica dei percorsi pedonali e stabilità dei sistemi di stoccaggio.',
  },
];

interface InteractiveRiskRoadmapProps {
  onSelectSectorQuote: (sectorName: string) => void;
}

export default function InteractiveRiskRoadmap({ onSelectSectorQuote }: InteractiveRiskRoadmapProps) {
  const [selectedSector, setSelectedSector] = useState<SectorInfo>(sectors[0]);

  const handleSelectSector = (sector: SectorInfo) => {
    soundFX.playLaser();
    setSelectedSector(sector);
  };

  const riskBadgeStyles =
    selectedSector.riskLevel === 'Alto'
      ? 'bg-[#e8f1fc] text-amber-900 border-[#9ec7f0]'
      : selectedSector.riskLevel === 'Medio'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-[#e8f1fc] text-blue-800 border-[#cfe3f8]';

  const riskBarColor =
    selectedSector.riskLevel === 'Alto'
      ? 'from-[#0b2545] via-blue-800 to-[#1e6fd9]'
      : selectedSector.riskLevel === 'Medio'
      ? 'from-[#1e6fd9] to-yellow-500'
      : 'from-blue-600 to-sky-400';

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-lg">
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-200">
        <div>
          <span className="font-mono text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
            ANALISI DI RISCHIO ATECO DINAMICA
          </span>
          <h3 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#0b2545]">
            Mappatura degli Obblighi per Settore Produttivo
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-sans font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#1e6fd9] animate-ping" />
          <span>Nuovo Accordo Stato-Regioni 2026</span>
        </div>
      </div>

      {/* Sector Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {sectors.map((sector) => {
          const isSelected = selectedSector.id === sector.id;
          const SectorIcon = sector.icon;

          return (
            <button
              key={sector.id}
              onClick={() => handleSelectSector(sector)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-lg -translate-y-1'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${
                    isSelected ? 'bg-[#1e6fd9] text-[#0b2545] font-bold' : 'bg-white text-[#0b2545] border border-slate-200 group-hover:scale-110'
                  }`}
                >
                  <SectorIcon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isSelected
                      ? 'bg-white/15 text-[#9ec7f0] border-white/20'
                      : sector.riskLevel === 'Alto'
                      ? 'bg-[#e8f1fc] text-amber-900 border-[#9ec7f0]'
                      : sector.riskLevel === 'Medio'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-[#e8f1fc] text-blue-800 border-[#cfe3f8]'
                  }`}
                >
                  {sector.riskLevel}
                </span>
              </div>

              <div>
                <span className={`font-sans text-[13.5px] font-bold leading-tight block ${isSelected ? 'text-white' : 'text-[#0b2545]'}`}>
                  {sector.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Detail Card for the Active Sector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSector.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-50 rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Col 1: Overview & Metrics (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${riskBadgeStyles}`}>
                    FASCIA RISCHIO: {selectedSector.riskLevel.toUpperCase()}
                  </span>
                  <span className="text-[12px] font-sans text-slate-500 font-semibold">
                    Indice severità: <strong className="text-[#0b2545]">{selectedSector.riskScore}/100</strong>
                  </span>
                </div>

                <h4 className="font-serif text-[26px] font-bold text-[#0b2545] mb-1">
                  {selectedSector.name}
                </h4>

                <p className="font-sans text-[13px] font-semibold text-blue-800 mb-4">
                  {selectedSector.atecoDescription}
                </p>

                {/* Visual Meter */}
                <div className="mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex justify-between text-[11.5px] font-sans font-bold text-slate-700 mb-1.5">
                    <span>INTENSITÀ RISCHIO OPERATIVO</span>
                    <span className="text-[#0b2545] font-mono">{selectedSector.riskScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${riskBarColor} rounded-full transition-all duration-700`}
                      style={{ width: `${selectedSector.riskScore}%` }}
                    />
                  </div>
                </div>

                <p className="font-sans text-[14px] text-slate-600 leading-relaxed mb-4">
                  {selectedSector.description}
                </p>

                {/* Formation Hours callout */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Formazione Lavoratori Obbligatoria (Accordo 2026)
                    </span>
                    <span className="font-sans text-[14px] font-bold text-[#0b2545]">
                      {selectedSector.formationHours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onSelectSectorQuote(selectedSector.name)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border-b-2 border-[#1e6fd9]"
                >
                  <span>Richiedi Piano di Adeguamento per {selectedSector.name}</span>
                  <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
                </button>
              </div>
            </div>

            {/* Col 2: Mandatory Documents & Operations (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Box 1: Documenti Obbligatori */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-[#0b2545]" />
                  <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#0b2545]">
                    Documentazione &amp; Valutazioni Strumentali Richieste
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedSector.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-2.5 text-[13px] font-sans text-slate-700 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Obblighi Operativi e Nomine */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-[#155bb0]" />
                  <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-amber-800">
                    Nomine, Abilitazioni Attrezzature &amp; Sorveglianza
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedSector.keyObligations.map((obl, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-2.5 text-[13px] font-sans text-slate-700 shadow-2xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#1e6fd9] flex-shrink-0 mt-1.5" />
                      <span className="font-medium leading-tight">{obl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guaranteed Zero Penalties Seal */}
              <div className="p-4 bg-[#e8f1fc]/80 rounded-xl border border-[#cfe3f8] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[#0b2545]">
                  <ShieldCheck className="w-5 h-5 text-[#155bb0] flex-shrink-0" />
                  <span className="font-sans text-[13px] font-bold">
                    PRESIDIO LEGALE GARANTITO: Copertura totale per verifiche SPISAL / ATS, ITL e Vigili del Fuoco.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
