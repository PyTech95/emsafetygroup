import { useState } from 'react';
import { ScanLine, SlidersHorizontal, Files, ArrowUpRight } from 'lucide-react';
import { SafetyInspector } from './SafetyInspector';
import { SafetySimulator } from './SafetySimulator';
import { SafetyDocuments } from './SafetyDocuments';
import { SafetyCheckup } from './SafetyCheckup';
import { INITIAL_PROFILE, safetySummary } from '../data/safetyTools';
import { scrollToId } from '../lib/scroll';
import './safetyTools.css';

export const SafetyTools = ({ onRequest }: { onRequest: (message: string) => void }) => {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const request = (topic: string) => onRequest(safetySummary(profile, topic));
  return <div className="safety-tools" data-testid="safety-tools">
    <div className="safety-tools-inner">
      <nav className="safety-tools-nav" aria-label="Strumenti per la sicurezza" data-testid="safety-tools-navigation"><span>CONOSCERE. PREVENIRE. AGIRE.</span><div>{[
        { id: 'ispezione-dpi', label: 'Esplora i DPI', icon: ScanLine },
        { id: 'simulatore-sicurezza', label: 'Simula il tuo profilo', icon: SlidersHorizontal },
        { id: 'documenti-prevenzione', label: 'Documenti', icon: Files },
        { id: 'checkup-sicurezza', label: 'Check-up', icon: ArrowUpRight },
      ].map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => scrollToId(id)} data-testid={`safety-nav-${id}`}><Icon size={15} />{label}</button>)}</div></nav>
      <SafetyInspector onRequest={request} />
      <SafetySimulator profile={profile} onChange={setProfile} />
      <SafetyDocuments profile={profile} onRequest={request} />
      <SafetyCheckup profile={profile} onRequest={request} />
    </div>
  </div>;
};
