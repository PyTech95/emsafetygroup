export type RiskLevel = 'basso' | 'medio' | 'alto';
export type FactorId = 'attrezzature' | 'quota' | 'chimico' | 'rspp';
export interface SafetyProfile { workforce: number; risk: RiskLevel; factors: FactorId[] }
export const INITIAL_PROFILE: SafetyProfile = { workforce: 1, risk: 'basso', factors: [] };

export const WORKFORCE = [
  { label: '1–5', name: 'Micro', min: 1, max: 5 },
  { label: '6–15', name: 'Piccola', min: 6, max: 15 },
  { label: '16–50', name: 'Media', min: 16, max: 50 },
  { label: '51–200', name: 'Grande', min: 51, max: 200 },
  { label: '> 200', name: 'Strutturata', min: 201, max: null },
];
export const RISKS: { id: RiskLevel; label: string; hours: number; description: string }[] = [
  { id: 'basso', label: 'Rischio basso', hours: 8, description: '4 h generali + 4 h specifiche' },
  { id: 'medio', label: 'Rischio medio', hours: 12, description: '4 h generali + 8 h specifiche' },
  { id: 'alto', label: 'Rischio alto', hours: 16, description: '4 h generali + 12 h specifiche' },
];
export const FACTORS: { id: FactorId; label: string; description: string }[] = [
  { id: 'attrezzature', label: 'Carrelli elevatori / PLE', description: 'Verifica abilitazioni e addestramento per l’attrezzatura utilizzata' },
  { id: 'quota', label: 'Lavori in quota / ponteggi', description: 'Procedure, protezioni anticaduta e formazione dedicata' },
  { id: 'chimico', label: 'Sostanze chimiche / polveri', description: 'Valutazione dell’esposizione e schede di sicurezza' },
  { id: 'rspp', label: 'Valutare un RSPP esterno', description: 'Richiedi supporto per il servizio di prevenzione e protezione' },
];

export interface SafetyDocument { id: string; title: string; reference: string; description: string; action: string }
const BASE_DOCUMENTS: SafetyDocument[] = [
  { id: 'dvr', title: 'Documento di Valutazione dei Rischi', reference: 'Artt. 17, 28–29 · D.Lgs 81/08', description: 'Valutazione dei rischi effettivi, mansioni esposte e misure di prevenzione. Da aggiornare quando cambiano lavorazioni, organizzazione o rischi e negli altri casi previsti dalla legge.', action: 'Raccogli il DVR vigente e le valutazioni specifiche disponibili.' },
  { id: 'formazione', title: 'Piano formativo e attestati', reference: 'Art. 37 · D.Lgs 81/08', description: 'Mappa di ruoli, percorsi svolti, crediti riconosciuti e aggiornamenti. Il livello di rischio scelto nel simulatore va confermato rispetto al settore e alle mansioni effettive.', action: 'Prepara l’elenco dei lavoratori, le mansioni e gli attestati.' },
  { id: 'emergenze', title: 'Organizzazione delle emergenze', reference: 'D.M. 02/09/2021 · D.M. 388/2003', description: 'Nomine e formazione degli addetti, procedure e dotazioni. L’obbligo di piano di emergenza scritto dipende da lavoratori presenti, affollamento e assoggettabilità ai controlli antincendio.', action: 'Verifica nomine, formazione e procedure con un tecnico.' },
  { id: 'dpi', title: 'Scelta, consegna e gestione dei DPI', reference: 'Artt. 74–79 · D.Lgs 81/08', description: 'La scelta dei dispositivi deriva dal DVR. Verifica marcatura CE, dichiarazione UE di conformità, istruzioni, compatibilità tra dispositivi e addestramento ove previsto.', action: 'Raccogli istruzioni, evidenze di consegna e registri di controllo.' },
];
const FACTOR_DOCUMENTS: Record<FactorId, SafetyDocument> = {
  attrezzature: { id: 'attrezzature', title: 'Abilitazioni e controlli attrezzature', reference: 'Artt. 71–73 · D.Lgs 81/08', description: 'Verifica la formazione specifica richiesta per ciascuna attrezzatura, gli aggiornamenti, le manutenzioni e le verifiche periodiche applicabili. Carrelli e PLE non hanno un percorso unico.', action: 'Prepara libretti, registro manutenzioni e abilitazioni degli operatori.' },
  quota: { id: 'quota', title: 'Procedure per i lavori in quota', reference: 'Titolo IV · D.Lgs 81/08', description: 'Valuta protezioni collettive, sistemi anticaduta e procedure di recupero. PiMUS per montaggio, uso e smontaggio dei ponteggi quando previsto: non è obbligatorio per ogni lavoro in quota.', action: 'Condividi lavorazioni, attrezzature e procedure adottate.' },
  chimico: { id: 'chimico', title: 'Valutazione del rischio chimico', reference: 'Titolo IX · D.Lgs 81/08', description: 'Inventario delle sostanze, schede di sicurezza aggiornate, modalità e durata dell’esposizione. Eventuali valutazioni di cancerogeni o atmosfere esplosive richiedono un approfondimento dedicato.', action: 'Raccogli le schede di sicurezza e l’elenco dei prodotti in uso.' },
  rspp: { id: 'rspp', title: 'Incarico e requisiti del RSPP', reference: 'Artt. 17, 31–32 · D.Lgs 81/08', description: 'Verifica requisiti professionali, organizzazione del servizio e possibilità di incarico esterno. La selezione nel simulatore non costituisce conferimento di incarico né trasferisce gli obblighi del datore di lavoro.', action: 'Confrontati con E.M Safety sull’organizzazione più adatta.' },
};
export function getSafetyDocuments(profile: SafetyProfile) {
  return [...BASE_DOCUMENTS, ...FACTORS.filter(f => profile.factors.includes(f.id)).map(f => FACTOR_DOCUMENTS[f.id])];
}
export function getSafetyEstimate(profile: SafetyProfile) {
  const workforce = WORKFORCE[profile.workforce];
  const risk = RISKS.find(r => r.id === profile.risk)!;
  const format = (n: number) => n.toLocaleString('it-IT');
  const volume = workforce.max ? `${format(workforce.min * risk.hours)}–${format(workforce.max * risk.hours)}` : `≥ ${format(workforce.min * risk.hours)}`;
  return { workforce, risk, volume };
}
export function safetySummary(profile: SafetyProfile, topic: string) {
  const { workforce, risk } = getSafetyEstimate(profile);
  return `Richiedo un check-up E.M Safety.\nFocus: ${topic}.\nOrganico indicativo: ${workforce.label} lavoratori.\nClasse di rischio selezionata (da confermare): ${profile.risk}.\nFormazione iniziale indicativa: ${risk.hours} ore per lavoratore.\nAspetti da approfondire: ${FACTORS.filter(f => profile.factors.includes(f.id)).map(f => f.label).join('; ') || 'valutazione generale'}.\nDocumenti da esaminare: ${getSafetyDocuments(profile).map(d => d.title).join('; ')}.\n\nVorrei confrontarmi con un consulente sui prossimi passi.`;
}
