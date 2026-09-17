import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ScanLine, ShieldCheck, ArrowUpRight, Pause, Play, Crosshair } from 'lucide-react';
import { useAsset } from '../lib/assets';

const PPE = [
  { id: 'helmet', label: 'Testa', code: 'DPI / TESTA', title: 'Elmetto di protezione', standard: 'EN 397 · Verificare l’edizione applicabile', description: 'La prima protezione contro urti e caduta di oggetti. Calotta, bardatura e accessori devono essere compatibili con la lavorazione e con gli altri DPI.', checks: ['Calotta senza crepe', 'Bardatura regolata', 'Vita utile del fabbricante'], note: 'Non presumere isolamento elettrico: occorre una specifica marcatura.', x: 50, y: 6 },
  { id: 'goggles', label: 'Occhi', code: 'DPI / OCCHI', title: 'Visiera e protezione degli occhi', standard: 'EN ISO 16321-1 · Secondo il dispositivo', description: 'Occhiali o visiera vanno scelti in funzione di particelle, spruzzi e radiazioni presenti. Una protezione generica non è adatta a ogni rischio.', checks: ['Lenti integre', 'Campo visivo libero', 'Marcatura adeguata'], note: 'Controlla la dichiarazione UE di conformità e le istruzioni del modello.', x: 50, y: 11 },
  { id: 'vest', label: 'Corpo', code: 'DPI / CORPO', title: 'Alta visibilità e sistemi anticaduta', standard: 'EN ISO 20471 / EN 361 · In base all’uso', description: 'L’abbigliamento ad alta visibilità e l’imbracatura svolgono funzioni diverse. Per i lavori in quota serve un sistema completo, compatibile e scelto dopo la valutazione dei rischi.', checks: ['Cuciture integre', 'Taglia e regolazione', 'Controlli documentati'], note: 'La figura è illustrativa: il gilet non sostituisce un’imbracatura anticaduta.', x: 50, y: 33 },
  { id: 'gloves', label: 'Mani', code: 'DPI / MANI', title: 'Guanti per la mansione', standard: 'EN 388 / EN ISO 374 · In base al rischio', description: 'Protezione meccanica e chimica richiedono prestazioni differenti. La scelta dipende da materiali manipolati, tempi di contatto e necessità di destrezza.', checks: ['Nessun taglio o foro', 'Presa e vestibilità', 'Compatibilità chimica'], note: 'I livelli di protezione sono specifici del prodotto, non della categoria.', x: 34, y: 55 },
  { id: 'boots', label: 'Piedi', code: 'DPI / PIEDI', title: 'Calzature di sicurezza', standard: 'EN ISO 20345 · Secondo la marcatura', description: 'Puntale, suola e resistenza alla perforazione vanno valutati rispetto all’ambiente di lavoro. Controlla categoria, requisiti aggiuntivi e stato di usura.', checks: ['Suola non usurata', 'Tomaia integra', 'Chiusura stabile'], note: 'La sola presenza del puntale non garantisce idoneità a tutti gli ambienti.', x: 50, y: 91 },
];

function WorkerDrawing() {
  const asset = useAsset();
  return (
    <img
      src={asset('/assets/images/ppe-scan-worker.png')}
      alt="Operatore con dotazione DPI completa: elmetto, occhiali, gilet alta visibilità, guanti e calzature di sicurezza"
      className="safety-worker"
      draggable={false}
      loading="lazy"
      data-testid="ppe-worker-photo"
    />
  );
}

export const SafetyInspector = ({ onRequest }: { onRequest: (topic: string) => void }) => {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const item = PPE[selected];
  return <section id="ispezione-dpi" className="safety-section" data-testid="ppe-inspector-section">
    <div className="safety-section-heading">
      <div><span className="safety-eyebrow"><ScanLine size={14} /> La sicurezza, da vicino</span><h2>Ispezione interattiva DPI & presidi di campo</h2><p>Ogni dettaglio conta. Esplora i punti di protezione e scopri cosa verificare prima di iniziare.</p></div>
      <span className="safety-badge" data-testid="ppe-illustrative-status"><span /> Esplorazione illustrativa</span>
    </div>
    <div className="safety-inspector-grid">
      <div className={`safety-scan-stage ${paused ? 'is-paused' : ''}`} data-testid="ppe-figure">
        <div className="safety-scan-meta"><span>VISTA FRONTALE / DPI</span><button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Riprendi animazione scanner' : 'Pausa animazione scanner'} aria-pressed={paused} data-testid="ppe-animation-toggle">{paused ? <Play size={14} /> : <Pause size={14} />}</button></div>
        <div className="safety-worker-frame"><WorkerDrawing /><div className="safety-scan-line" aria-hidden="true" />
          {PPE.map((point, index) => <button type="button" key={point.id} style={{ left: `${point.x}%`, top: `${point.y}%` }} className={`safety-hotspot ${selected === index ? 'is-active' : ''}`} onClick={() => setSelected(index)} aria-label={`Esplora protezione: ${point.label}`} aria-pressed={selected === index} data-testid={`ppe-hotspot-${point.id}`}><span /></button>)}
        </div>
        <div className="safety-scan-caption"><Crosshair size={14} /> Seleziona un punto per esplorare il dispositivo</div>
      </div>
      <div className="safety-inspector-info">
        <div className="safety-ppe-tabs" aria-label="Zone di protezione">{PPE.map((point, index) => <button type="button" key={point.id} onClick={() => setSelected(index)} aria-pressed={selected === index} className={selected === index ? 'is-active' : ''} data-testid={`ppe-tab-${point.id}`}>{point.label}</button>)}</div>
        <div className="safety-detail-container" aria-live="polite" aria-atomic="true" data-testid="ppe-detail-panel">
          <AnimatePresence mode="wait" initial={false}><motion.div key={item.id} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .16 }}>
            <span className="safety-micro" data-testid="ppe-detail-code">{item.code}</span><h3 data-testid="ppe-detail-title">{item.title}</h3>
            <div className="safety-standard" data-testid="ppe-detail-standard"><ShieldCheck size={17} /> {item.standard}</div>
            <p className="safety-detail-description" data-testid="ppe-detail-description">{item.description}</p>
            <span className="safety-micro">Prima dell’utilizzo, controlla</span>
            <div className="safety-checks">{item.checks.map((check, i) => <div key={check} data-testid={`ppe-check-${i}`}><span className="safety-check-dot" />{check}</div>)}</div>
            <p className="safety-detail-note" data-testid="ppe-detail-note">{item.note}</p>
          </motion.div></AnimatePresence>
        </div>
        <button type="button" className="safety-text-link" onClick={() => onRequest(`Verifica DPI: ${item.title}`)} data-testid="ppe-request-checkup">Verifica i DPI con un consulente <ArrowUpRight size={17} /></button>
      </div>
    </div>
    <p className="safety-footnote" data-testid="ppe-disclaimer">Guida informativa, non un’ispezione reale né una certificazione. Idoneità, prestazioni e norme applicabili vanno verificate sul dispositivo e nel contesto lavorativo.</p>
  </section>;
};
