import { motion, useReducedMotion } from 'motion/react';
import { SlidersHorizontal, GraduationCap, Users, RotateCcw, ArrowDown, Info, FileCheck2 } from 'lucide-react';
import { FACTORS, getSafetyDocuments, getSafetyEstimate, INITIAL_PROFILE, RISKS, SafetyProfile, WORKFORCE } from '../data/safetyTools';
import { scrollToId } from '../lib/scroll';

const SimulatorResults = ({ profile }: { profile: SafetyProfile }) => {
  const reduced = useReducedMotion();
  const { risk, workforce, volume } = getSafetyEstimate(profile);
  return <div className="safety-results" data-testid="simulator-result-card">
    <div className="safety-result-top"><span><FileCheck2 size={19} /> Il tuo quadro preliminare</span><span className="safety-micro">Stima orientativa</span></div>
    <div aria-live="polite" aria-atomic="true" data-testid="simulator-live-results">
      <div className="safety-main-result"><GraduationCap size={23} /><div><span>Formazione iniziale / lavoratore</span><motion.strong key={risk.hours} initial={{ opacity: .4, y: reduced ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} data-testid="simulator-training-hours">{risk.hours}<small> ore</small></motion.strong></div><span className="safety-result-breakdown" data-testid="simulator-hours-breakdown">4 h generali<br />+ {risk.hours - 4} h specifiche</span></div>
      <div className="safety-secondary-results"><div><Users size={17} /><span>Volume formativo stimato</span><strong data-testid="simulator-workforce-hours">{volume}</strong><small>ore-persona / {workforce.label} lavoratori</small></div><div><FileCheck2 size={17} /><span>Aree documentali</span><strong data-testid="simulator-document-count">{getSafetyDocuments(profile).length}</strong><small>da esaminare insieme</small></div></div>
    </div>
    <p className="safety-result-assumption" data-testid="simulator-assumptions">Ipotesi: tutti i lavoratori devono completare la formazione iniziale, senza crediti pregressi. Addestramento e corsi per ruoli specifici sono esclusi.</p>
    <div className="safety-inail" data-testid="simulator-inail-info"><div><span className="safety-micro">Opportunità INAIL / OT23</span><strong>La prevenzione può ridurre il tasso.</strong></div><p>Riduzioni fino al 28%, se ricorrono i requisiti. La percentuale dipende dai lavoratori-anno della PAT, non dal solo organico selezionato. Nessun risparmio automatico.</p></div>
    <p className="safety-sanctions" data-testid="simulator-sanctions-note"><Info size={16} /> Le sanzioni dipendono dalle violazioni accertate: questa simulazione non le quantifica e non garantisce l’assenza di sanzioni.</p>
    <button type="button" className="safety-text-link" onClick={() => scrollToId('documenti-prevenzione')} data-testid="simulator-view-documents">Esplora i documenti del tuo profilo <ArrowDown size={16} /></button>
  </div>;
};

export const SafetySimulator = ({ profile, onChange }: { profile: SafetyProfile; onChange: (profile: SafetyProfile) => void }) => {
  const toggle = (id: typeof FACTORS[number]['id']) => onChange({ ...profile, factors: profile.factors.includes(id) ? profile.factors.filter(f => f !== id) : [...profile.factors, id] });
  return <section id="simulatore-sicurezza" className="safety-section safety-simulator" data-testid="simulator-section">
    <div className="safety-section-heading"><div><span className="safety-eyebrow"><SlidersHorizontal size={14} /> Dalla tua azienda, un punto di partenza</span><h2>Simulatore obblighi, formazione & opportunità INAIL</h2><p>Imposta il profilo della tua realtà. Costruiamo una prima panoramica degli aspetti da approfondire.</p></div><button type="button" className="safety-reset" onClick={() => onChange({ ...INITIAL_PROFILE, factors: [] })} data-testid="simulator-reset"><RotateCcw size={15} /> Ripristina</button></div>
    <div className="safety-simulator-grid">
      <div className="safety-inputs">
        <fieldset><legend>Dimensione dell’organico</legend><div className="safety-workforce-options">{WORKFORCE.map((group, i) => <button type="button" key={group.label} onClick={() => onChange({ ...profile, workforce: i })} aria-pressed={profile.workforce === i} className={profile.workforce === i ? 'is-active' : ''} data-testid={`simulator-workforce-${i}`}><strong>{group.label}</strong><span>{group.name}</span></button>)}</div></fieldset>
        <fieldset><legend>Classe di rischio da verificare</legend><div className="safety-risk-options">{RISKS.map(risk => <button type="button" key={risk.id} aria-pressed={profile.risk === risk.id} onClick={() => onChange({ ...profile, risk: risk.id })} className={profile.risk === risk.id ? 'is-active' : ''} data-testid={`simulator-risk-${risk.id}`}><strong>{risk.label}</strong><span>{risk.description}</span><small>{risk.hours} h complessive</small></button>)}</div><p className="safety-input-hint">La classe effettiva dipende da settore ATECO, mansioni ed esposizioni: non viene determinata automaticamente.</p></fieldset>
        <fieldset><legend>Attività e supporto di interesse</legend><div className="safety-factor-options">{FACTORS.map(factor => <label key={factor.id} className={profile.factors.includes(factor.id) ? 'is-active' : ''} htmlFor={`factor-${factor.id}`}><input id={`factor-${factor.id}`} type="checkbox" checked={profile.factors.includes(factor.id)} onChange={() => toggle(factor.id)} data-testid={`simulator-factor-${factor.id}`} /><span><strong>{factor.label}</strong><small>{factor.description}</small></span></label>)}</div></fieldset>
      </div>
      <SimulatorResults profile={profile} />
    </div>
    <p className="safety-footnote" data-testid="simulator-disclaimer">Strumento orientativo basato sul D.Lgs 81/08 e sull’Accordo Stato-Regioni del 17 aprile 2025. Non sostituisce il DVR, la consulenza professionale o la verifica dei requisiti INAIL.</p>
  </section>;
};
