export interface MediaSlot {
  key: string; // canonical path used across the site
  label: string;
  group: string;
}

// Every editable image on the website. `key` matches the src used in components.
export const MEDIA_SLOTS: MediaSlot[] = [
  // Brand
  { key: '/assets/images/em-logo.png', label: 'Logo E.M Safety (header/footer)', group: 'Brand' },
  // Home / Hero
  { key: '/assets/images/hero-milano.jpg', label: 'Immagine Hero (home + Chi Siamo)', group: 'Home' },
  { key: '/assets/images/ppe-scan-worker.png', label: 'Operatore scanner DPI', group: 'Home' },
  { key: '/assets/images/founder.jpg', label: 'Foto Fondatore', group: 'Home' },
  // Generic (from IMAGES constant)
  { key: 'https://images.unsplash.com/photo-1594581835488-0b95b8b0bacd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200', label: 'Foto Team (Metodo / Documenti)', group: 'Generiche' },
  { key: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200', label: 'Aula di formazione (Perché noi / Servizi)', group: 'Generiche' },
  { key: '/assets/images/safety_audit_engineer_1789049638858.jpg', label: 'Audit ingegnere (Contatti / Chi Siamo)', group: 'Generiche' },
  { key: '/assets/images/safety_training_classroom_1789049617274.jpg', label: 'Aula formazione (servizio Formazione)', group: 'Generiche' },
  // Services
  { key: '/assets/images/services/consulenza.jpg', label: 'Servizio · Consulenza', group: 'Servizi' },
  { key: '/assets/images/services/sgi.jpg', label: 'Servizio · Sistemi di Gestione', group: 'Servizi' },
  { key: '/assets/images/services/rischi.jpg', label: 'Servizio · Valutazione Rischi', group: 'Servizi' },
  { key: '/assets/images/services/sanitaria.jpg', label: 'Servizio · Sorveglianza Sanitaria', group: 'Servizi' },
  { key: '/assets/images/services/antincendio.jpg', label: 'Servizio · Antincendio', group: 'Servizi' },
  // Loghi Gruppo / Affiliazioni / Clienti: gestiti nella sezione "Loghi & Partner"
];
