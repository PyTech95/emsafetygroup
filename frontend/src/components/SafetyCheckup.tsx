import { useState } from 'react';
import { ArrowUpRight, Check, MessageSquareText, ShieldCheck } from 'lucide-react';
import { getSafetyDocuments, SafetyProfile, WORKFORCE } from '../data/safetyTools';

const TOPICS = ['Check-up completo', 'Formazione', 'Documenti e scadenze', 'Opportunità INAIL'];
export const SafetyCheckup = ({ profile, onRequest }: { profile: SafetyProfile; onRequest: (topic: string) => void }) => {
  const [topic, setTopic] = useState(TOPICS[0]);
  return <section id="checkup-sicurezza" className="safety-checkup" data-testid="checkup-cta-section">
    <div className="safety-checkup-copy"><span className="safety-eyebrow"><MessageSquareText size={15} /> Il prossimo passo è una conversazione</span><h2>La tua sicurezza.<br /><span>Un piano concreto, insieme.</span></h2><p>Trasformiamo questa prima panoramica in un percorso per la tua azienda. Scegli da dove partire: porteremo il tuo profilo nel modulo di contatto.</p><div className="safety-checkup-topics" aria-label="Argomento del check-up">{TOPICS.map((label, i) => <button type="button" key={label} aria-pressed={topic === label} className={topic === label ? 'is-active' : ''} onClick={() => setTopic(label)} data-testid={`checkup-topic-${i}`}>{topic === label && <Check size={14} />}{label}</button>)}</div></div>
    <div className="safety-checkup-summary"><ShieldCheck size={32} strokeWidth={1.3} /><span className="safety-micro">Il tuo punto di partenza</span><dl data-testid="checkup-profile-summary"><div><dt>Organico</dt><dd>{WORKFORCE[profile.workforce].label} lavoratori</dd></div><div><dt>Rischio selezionato</dt><dd>{profile.risk}</dd></div><div><dt>Aree da approfondire</dt><dd>{getSafetyDocuments(profile).length}</dd></div></dl><button type="button" onClick={() => onRequest(topic)} className="safety-primary-button" data-testid="checkup-submit-btn">Richiedi il tuo check-up <ArrowUpRight size={19} /></button><p data-testid="checkup-send-note">Nessun invio automatico. Potrai rivedere il messaggio e aggiungere i tuoi recapiti.</p></div>
  </section>;
};
