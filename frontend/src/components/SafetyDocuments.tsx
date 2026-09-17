import { motion, useReducedMotion } from 'motion/react';
import { Files, ArrowUpRight, ClipboardList } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { getSafetyDocuments, SafetyProfile } from '../data/safetyTools';
import { IMAGES } from '../data/siteContent';
import { useAsset } from '../lib/assets';

export const SafetyDocuments = ({ profile, onRequest }: { profile: SafetyProfile; onRequest: (topic: string) => void }) => {
  const asset = useAsset();
  const documents = getSafetyDocuments(profile);
  const reduced = useReducedMotion();
  return <section id="documenti-prevenzione" className="safety-section" data-testid="compliance-workflow-section">
    <span id="metodo" className="safety-anchor" />
    <div className="safety-section-heading"><div><span className="safety-eyebrow"><Files size={14} /> Il nostro metodo, in pratica</span><h2>Dai documenti alla prevenzione quotidiana.</h2><p>Una traccia di lavoro, non una cartella da riempire. Il percorso si adatta alle tue scelte nel simulatore.</p></div><span className="safety-badge" data-testid="documents-profile-count">{documents.length} aree da approfondire</span></div>
    <div className="safety-documents-grid">
      <div className="safety-document-story">
        <div className="safety-document-photo"><motion.img src={asset(IMAGES.team)} alt="Confronto sul campo per pianificare gli interventi di sicurezza" loading="lazy" initial={{ scale: reduced ? 1 : 1.09 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 1.7 }} data-testid="documents-motion-image" /><span><ClipboardList size={17} /> Dall’analisi al piano d’azione</span></div>
        <div className="safety-method-track" data-testid="documents-method"><span>Ascoltiamo</span><i /><span>Verifichiamo</span><i /><span>Pianifichiamo</span></div>
        <p>Partiamo da ciò che hai già. Individuiamo le priorità e definiamo insieme interventi, responsabilità e aggiornamenti.</p>
        <div className="safety-document-note" data-testid="documents-disclaimer">Questa lista non attesta conformità e non genera documenti asseverati. Gli obblighi effettivi richiedono una valutazione della tua azienda.</div>
      </div>
      <div className="safety-document-list">
        <div className="safety-list-label"><span>Documento / ambito</span><span>Da verificare</span></div>
        <Accordion type="single" collapsible defaultValue="dvr" data-testid="documents-accordion">
          {documents.map(doc => <AccordionItem key={doc.id} value={doc.id} className="safety-doc-item" data-testid={`document-item-${doc.id}`}><AccordionTrigger className="safety-doc-trigger" data-testid={`document-expand-${doc.id}`}><span><strong>{doc.title}</strong><small>{doc.reference}</small></span></AccordionTrigger><AccordionContent className="safety-doc-content" data-testid={`document-content-${doc.id}`}><p>{doc.description}</p><p className="safety-doc-action">{doc.action}</p><button type="button" className="safety-text-link" onClick={() => onRequest(doc.title)} data-testid={`document-request-${doc.id}`}>Approfondisci con noi <ArrowUpRight size={15} /></button></AccordionContent></AccordionItem>)}
        </Accordion>
      </div>
    </div>
  </section>;
};
