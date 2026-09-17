import {
  ShieldCheck,
  Layers,
  GraduationCap,
  AlertTriangle,
  HeartPulse,
  Flame,
  Search,
  ClipboardCheck,
  Route,
  Wrench,
  RefreshCw,
  Award,
  Users,
  Target,
  FileCheck,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

export const IMAGES = {
  hero: '/assets/images/hero-milano.jpg',
  team: 'https://images.unsplash.com/photo-1594581835488-0b95b8b0bacd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  training: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  office: 'https://images.unsplash.com/photo-1618764889234-2d6ce7c70bd6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
};

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const VALUES: ValueProp[] = [
  {
    icon: Award,
    title: 'Competenza',
    text: 'Consulenti tecnici e formatori qualificati ai sensi del D.I. 06/03/2013, con esperienza diretta sul campo.',
  },
  {
    icon: ShieldCheck,
    title: 'Affidabilità',
    text: 'Presidio normativo costante e interventi puntuali: zero sanzioni e piena tranquillità in caso di ispezione.',
  },
  {
    icon: FileCheck,
    title: 'Conformità',
    text: 'Soluzioni sempre allineate al D.Lgs 81/08 e agli Accordi Stato-Regioni, con documentazione tracciabile.',
  },
  {
    icon: Target,
    title: 'Su Misura',
    text: 'Ogni azienda è unica: progettiamo piani di sicurezza e formazione calibrati sul vostro codice ATECO.',
  },
];

export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  points: string[];
  image: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'consulenza',
    icon: ShieldCheck,
    title: 'Consulenza Sicurezza sul Lavoro',
    tagline: 'D.Lgs 81/08, senza pensieri.',
    description:
      'Assunzione dell\u2019incarico di RSPP esterno, redazione e aggiornamento del DVR, sopralluoghi tecnici e gestione completa degli adempimenti.',
    points: ['DVR e valutazione dei rischi', 'RSPP / ASPP esterno', 'Sopralluoghi e audit interni', 'Gestione scadenze e adempimenti'],
    image: '/assets/images/services/consulenza.jpg',
  },
  {
    id: 'sgi',
    icon: Layers,
    title: 'Sistemi di Gestione Integrati',
    tagline: 'Qualità, ambiente e sicurezza in un unico sistema.',
    description:
      'Implementazione e mantenimento di sistemi certificabili ISO, integrati con i Modelli di Organizzazione e Gestione 231.',
    points: ['ISO 45001 \u2014 Sicurezza', 'ISO 9001 \u2014 Qualità', 'ISO 14001 \u2014 Ambiente', 'Audit e Modelli 231'],
    image: '/assets/images/services/sgi.jpg',
  },
  {
    id: 'formazione',
    icon: GraduationCap,
    title: 'Formazione e Corsi Accreditati',
    tagline: 'Attestati validi in tutta Italia.',
    description:
      'Catalogo completo di corsi conformi all\u2019Accordo Stato-Regioni, erogati in aula, in videoconferenza (FAD) e direttamente in azienda.',
    points: ['Lavoratori, Preposti, Dirigenti', 'RSPP / ASPP e RLS', 'Antincendio e Primo Soccorso', 'In aula, FAD e in-company'],
    image: '/assets/images/safety_training_classroom_1789049617274.jpg',
  },
  {
    id: 'rischi',
    icon: AlertTriangle,
    title: 'Valutazione dei Rischi Specifici',
    tagline: 'Misuriamo ciò che conta.',
    description:
      'Analisi tecnica e strumentale dei rischi presenti in azienda, con relazioni tecniche e piani di miglioramento a norma.',
    points: ['Rumore e vibrazioni', 'Rischio chimico e cancerogeno', 'Movimentazione manuale carichi', 'Stress lavoro-correlato'],
    image: '/assets/images/services/rischi.jpg',
  },
  {
    id: 'sanitaria',
    icon: HeartPulse,
    title: 'Sorveglianza Sanitaria',
    tagline: 'La salute dei lavoratori, sotto controllo.',
    description:
      'Nomina del Medico Competente, definizione del protocollo sanitario e gestione delle visite mediche e delle idoneità.',
    points: ['Nomina Medico Competente', 'Protocollo sanitario', 'Visite mediche e idoneità', 'Gestione cartelle sanitarie'],
    image: '/assets/images/services/sanitaria.jpg',
  },
  {
    id: 'antincendio',
    icon: Flame,
    title: 'Antincendio ed Emergenze',
    tagline: 'Pronti prima che serva.',
    description:
      'Redazione dei piani di emergenza ed evacuazione, valutazione del rischio incendio e gestione delle pratiche CPI presso i VV.F.',
    points: ['Piani di emergenza ed esodo', 'Valutazione rischio incendio', 'Pratiche CPI e VV.F.', 'Prove pratiche di evacuazione'],
    image: '/assets/images/services/antincendio.jpg',
  },
];

export interface MethodStep {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const METHOD: MethodStep[] = [
  {
    icon: Search,
    title: 'Ascolto e Sopralluogo',
    text: 'Analizziamo la vostra realtà \u2014 attività, layout, mansioni e documentazione esistente \u2014 per fotografare lo stato di conformità.',
  },
  {
    icon: ClipboardCheck,
    title: 'Valutazione dei Rischi',
    text: 'Identifichiamo e misuriamo i rischi presenti, redigendo o aggiornando il DVR con priorità di intervento chiare.',
  },
  {
    icon: Route,
    title: 'Piano d\u2019Azione su Misura',
    text: 'Definiamo un programma di adeguamenti, formazione e scadenze con un preventivo trasparente e senza costi occulti.',
  },
  {
    icon: Wrench,
    title: 'Formazione e Implementazione',
    text: 'Eroghiamo i corsi e affianchiamo l\u2019azienda nell\u2019attuazione delle misure, a regola d\u2019arte e nel rispetto delle norme.',
  },
  {
    icon: RefreshCw,
    title: 'Monitoraggio e Aggiornamento',
    text: 'Presidio continuo delle scadenze, audit periodici e aggiornamento documentale per mantenere la conformità nel tempo.',
  },
];

export interface WhyItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const WHY: WhyItem[] = [
  { icon: Award, title: 'Esperienza pluriennale', text: 'Anni di attività al fianco di aziende di ogni settore e dimensione.' },
  { icon: Users, title: 'Consulenti certificati', text: 'Team tecnico qualificato e in costante aggiornamento normativo.' },
  { icon: Target, title: 'Approccio su misura', text: 'Soluzioni calibrate sulle reali esigenze e sul codice ATECO.' },
  { icon: FileCheck, title: 'Conformità garantita', text: 'Documentazione tracciabile e pronta per ogni ispezione.' },
  { icon: GraduationCap, title: 'Formazione accreditata', text: 'Attestati con codice univoco validi su tutto il territorio nazionale.' },
  { icon: MapPin, title: 'Due sedi operative', text: 'Uffici a Treviso e Milano, con interventi in-company in tutta Italia.' },
];

export interface ClientItem {
  name: string;
  logo?: string;
  dark?: boolean;
}

export const CLIENTS: ClientItem[] = [
  { name: 'Ecoflam', logo: '/assets/images/clients/ecoflam.png' },
  { name: 'Brivio & Viganò', logo: '/assets/images/clients/brivio-vigano.png' },
  { name: 'SITA', logo: '/assets/images/clients/sita.png' },
  { name: 'GXO', logo: '/assets/images/clients/gxo.png' },
  { name: 'Elco', logo: '/assets/images/clients/elco.png' },
  { name: 'SIMI Group', logo: '/assets/images/clients/simi-group.png', dark: true },
  { name: 'Auto Ghinzani', logo: '/assets/images/clients/autoghinzani.png' },
  { name: 'SFRE', logo: '/assets/images/clients/sfre.png' },
];

export const COMPANY = {
  name: 'E.M Safety S.r.l.',
  legalOffice: '31100 Treviso (TV) \u2014 Strada di Boiago, 11/b',
  operativeOffice: '20100 Milano (MI) \u2014 Piazza Gae Aulenti, Torre B',
  phone: '+39 0422 1456565',
  phoneHref: 'tel:+3904221456565',
  mobile: '+39 379 1341270',
  mobileHref: 'tel:+393791341270',
  email: 'info@emsafetygroup.it',
  pec: 'emsafetygroup@pec.emsafetygroup.it',
  vat: '05613690261',
  rea: 'TV - 459102',
  hours: 'Lun \u2013 Ven: 09:00 \u2013 18:00 \u00b7 Sab e Dom: chiuso',
};
