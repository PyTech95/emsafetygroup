import { SERVICES, VALUES, METHOD, WHY, COMPANY } from './siteContent';
import { FAQ_DATA } from './coursesData';

export interface TextSlot {
  key: string;
  label: string;
  group: string;
  default: string;
  multiline?: boolean;
}

const S = (key: string, label: string, group: string, def: string, multiline = false): TextSlot => ({ key, label, group, default: def, multiline });

const G = {
  brand: 'Header & Footer',
  hero: 'Home · Hero',
  chapters: 'Home · Titoli capitoli',
  sgi: 'Home · Sistemi di Gestione',
  services: 'Home · Servizi',
  serviceCards: 'Schede Servizi',
  why: 'Home · Perché Sceglierci',
  affil: 'Home · Affiliazioni',
  gruppo: 'Home · Il Gruppo',
  clienti: 'Home · Clienti',
  faq: 'Home · FAQ',
  contact: 'Home · Contatti',
  founder: 'Home · Il Fondatore',
  method: 'Pagina Servizi · Metodo',
  pServizi: 'Pagina Servizi',
  pChi: 'Pagina Chi Siamo',
  pTest: 'Pagina Testimonianze',
  pFaq: 'Pagina FAQ',
  pStorie: 'Pagina Storie',
  pContatti: 'Pagina Contatti',
  company: 'Dati Azienda',
};

const CHAPTERS: [string, string, string][] = [
  ['01', 'Sistemi di Gestione', 'Qualità, ambiente e sicurezza. Un’unica visione.'],
  ['02', 'I Nostri Servizi', 'Competenze diverse, un unico partner.'],
  ['04', 'Formazione', 'Conoscenze che diventano buone pratiche.'],
  ['05', 'Perché Sceglierci', 'Al fianco delle persone, dentro le aziende.'],
  ['06', 'Affiliazioni', 'Una rete di competenze condivise.'],
  ['07', 'Il Gruppo', 'Specializzazioni che lavorano insieme.'],
  ['08', 'Hanno Creduto in Noi', 'Relazioni costruite sul campo.'],
  ['09', 'Domande Frequenti', 'Risposte chiare, prima di cominciare.'],
  ['10', 'Contatti', 'Il primo passo è parlarne.'],
  ['11', 'Il Fondatore', 'La visione da cui tutto è iniziato.'],
];

export const TEXT_SLOTS: TextSlot[] = [
  // Brand
  S('brand.slogan1', 'Slogan · riga 1', G.brand, 'Costruiamo Sistemi che'),
  S('brand.slogan2', 'Slogan · riga 2', G.brand, 'trasformano la compliance'),
  S('brand.slogan3', 'Slogan · riga 3', G.brand, 'in Valore aggiunto'),
  S('footer.description', 'Footer · descrizione', G.brand, 'Società di consulenza e formazione per la salute e sicurezza nei luoghi di lavoro e la conformità normativa d’impresa ai sensi del D.Lgs 81/08 e degli Accordi Stato-Regioni.', true),
  S('footer.credit', 'Footer · credito (prima di "Pytech")', G.brand, 'Designed & Developed by'),
  S('floating.call.label', 'Pulsante chiamata flottante · etichetta', G.brand, 'Chiama ora'),

  // Hero
  S('home.hero.label', 'Etichetta', G.hero, 'Benvenuto in E.M Safety'),
  S('home.hero.title1', 'Titolo · riga 1', G.hero, 'La sicurezza sul lavoro,'),
  S('home.hero.title2', 'Titolo · riga 2 (evidenziata)', G.hero, 'la nostra competenza.'),
  S('home.hero.description', 'Descrizione', G.hero, 'Da anni affianchiamo le imprese nella consulenza sulla sicurezza (D.Lgs 81/08), nei Sistemi di Gestione Integrati e nella formazione accreditata. Mettiamo al centro le vostre esigenze e la piena conformità normativa.', true),
  S('home.hero.cta1', 'Pulsante principale', G.hero, 'Richiedi un preventivo gratuito'),
  S('home.hero.cta2', 'Pulsante secondario', G.hero, 'Scopri i servizi'),
  S('home.hero.badge1', 'Badge 1', G.hero, 'Conforme D.Lgs 81/08'),
  S('home.hero.badge2', 'Badge 2', G.hero, 'Sedi a Treviso & Milano'),
  S('home.hero.stat', 'Card statistica · numero', G.hero, '100%'),
  S('home.hero.statText', 'Card statistica · testo', G.hero, 'documentazione a norma e pronta per l’ispezione'),
  ...VALUES.flatMap((v, i) => [
    S(`values.${i}.title`, `Valore ${i + 1} · titolo`, G.hero, v.title),
    S(`values.${i}.text`, `Valore ${i + 1} · testo`, G.hero, v.text, true),
  ]),

  // Chapters
  ...CHAPTERS.flatMap(([n, title, sub]) => [
    S(`chapter.${n}.title`, `Capitolo ${n} · titolo`, G.chapters, title),
    S(`chapter.${n}.subtitle`, `Capitolo ${n} · sottotitolo`, G.chapters, sub),
  ]),

  // SGI
  S('home.sgi.label', 'Etichetta', G.sgi, 'Il Gruppo'),
  S('home.sgi.title1', 'Titolo · parte 1', G.sgi, 'Costruiamo Sistemi di Gestione Integrati che le aziende usano,'),
  S('home.sgi.title2', 'Titolo · parte 2 (blu)', G.sgi, 'creando valore aggiunto, non solo conformità.'),
  S('home.sgi.closing', 'Riquadro finale', G.sgi, 'I nostri servizi assicurano conformità normativa e protezione della salute dei dipendenti. Dietro ogni soluzione su misura c’è una rete di professionisti specializzati, selezionati per competenza ed esperienza nei rispettivi ambiti.', true),

  // Services section
  S('home.services.label', 'Etichetta', G.services, 'I Nostri Servizi'),
  S('home.services.title1', 'Titolo · parte 1', G.services, 'Progettiamo la vostra sicurezza,'),
  S('home.services.title2', 'Titolo · parte 2 (blu)', G.services, 'a 360°.'),
  S('home.services.description', 'Descrizione', G.services, 'Un unico partner per consulenza, sistemi di gestione, valutazioni tecniche e formazione. Soluzioni complete per garantire conformità, efficienza e tutela dei lavoratori.', true),
  S('home.services.cta', 'Link scheda', G.services, 'Richiedi informazioni'),
  ...SERVICES.flatMap((s) => [
    S(`services.${s.id}.title`, `${s.title} · titolo`, G.serviceCards, s.title),
    S(`services.${s.id}.tagline`, `${s.title} · sottotitolo`, G.serviceCards, s.tagline),
    S(`services.${s.id}.description`, `${s.title} · descrizione`, G.serviceCards, s.description, true),
    ...s.points.map((p, i) => S(`services.${s.id}.points.${i}`, `${s.title} · punto ${i + 1}`, G.serviceCards, p)),
  ]),

  // Why
  S('home.why.label', 'Etichetta', G.why, 'Perché Scegliere E.M Safety'),
  S('home.why.title', 'Titolo', G.why, 'La vostra tranquillità, il nostro impegno.'),
  S('home.why.description', 'Descrizione', G.why, 'Scegliere E.M Safety significa affidarsi a un partner serio e competente per la sicurezza e la formazione della vostra azienda.', true),
  S('home.why.cta', 'Pulsante', G.why, 'Parliamo del vostro progetto'),
  ...WHY.flatMap((w, i) => [
    S(`why.${i}.title`, `Punto ${i + 1} · titolo`, G.why, w.title),
    S(`why.${i}.text`, `Punto ${i + 1} · testo`, G.why, w.text, true),
  ]),

  // Affiliations
  S('home.affil.label', 'Etichetta', G.affil, 'Affiliazioni & Accreditamenti'),
  S('home.affil.title1', 'Titolo · parte 1', G.affil, 'Riconosciuti dagli enti che'),
  S('home.affil.title2', 'Titolo · parte 2 (blu)', G.affil, 'contano davvero.'),
  S('home.affil.description', 'Descrizione', G.affil, 'La nostra qualità è certificata da affiliazioni e accreditamenti con i principali enti nazionali della formazione e della sicurezza sul lavoro.', true),

  // Gruppo
  S('home.gruppo.label', 'Etichetta', G.gruppo, 'Il Gruppo'),
  S('home.gruppo.title1', 'Titolo · riga 1', G.gruppo, 'Un ecosistema di competenze,'),
  S('home.gruppo.title2', 'Titolo · riga 2 (grigia)', G.gruppo, 'un unico interlocutore.'),
  S('home.gruppo.description', 'Descrizione', G.gruppo, 'E.M Safety fa parte di un gruppo di realtà specializzate che coprono ogni area dell’impresa: sicurezza, sistemi di gestione, ingegneria e consulenza strategica.', true),

  // Clienti
  S('home.clienti.label', 'Etichetta', G.clienti, 'I Nostri Clienti'),
  S('home.clienti.title', 'Titolo', G.clienti, 'Hanno creduto in noi.'),
  S('home.clienti.description', 'Descrizione', G.clienti, 'Aziende che ci hanno scelto per la sicurezza, la formazione e i sistemi di gestione — e che continuano a lavorare con noi.', true),

  // FAQ
  S('home.faq.label', 'Etichetta', G.faq, 'FAQ & CHIARIMENTI NORMATIVI'),
  S('home.faq.title', 'Titolo', G.faq, 'Domande frequenti su consulenza e scadenze'),
  S('home.faq.description', 'Descrizione', G.faq, 'Le risposte operative alle principali richieste che riceviamo quotidianamente da responsabili HR, RSPP e amministratori delegati.', true),
  ...FAQ_DATA.flatMap((f, i) => [
    S(`faq.${f.id}.question`, `Domanda ${i + 1}`, G.faq, f.question),
    S(`faq.${f.id}.answer`, `Risposta ${i + 1}`, G.faq, f.answer, true),
  ]),

  // Contact
  S('home.contact.label', 'Etichetta', G.contact, 'Contattaci'),
  S('home.contact.title', 'Titolo', G.contact, 'Parliamo della vostra sicurezza.'),
  S('home.contact.description', 'Descrizione', G.contact, 'Hai bisogno di una consulenza o di un preventivo gratuito? Compila il modulo o contattaci direttamente: ti risponderemo entro 24-48 ore lavorative.', true),
  S('home.contact.submit', 'Pulsante invio', G.contact, 'Invia richiesta'),
  S('home.contact.privacy', 'Nota privacy', G.contact, 'Inviando accetti il trattamento dei dati secondo il Regolamento UE 2016/679 (GDPR).'),
  S('home.contact.success', 'Messaggio di conferma', G.contact, 'Richiesta inviata correttamente: il team E.M Safety ti risponderà entro 24-48 ore lavorative.', true),

  // Founder
  S('home.founder.title1', 'Titolo · riga 1', G.founder, 'La sicurezza è una cultura,'),
  S('home.founder.title2', 'Titolo · riga 2 (grigia)', G.founder, 'prima che un obbligo.'),
  S('home.founder.p1', 'Paragrafo 1', G.founder, 'E.M Safety nasce dalla visione del suo fondatore: trasformare la conformità normativa da semplice adempimento a vero valore competitivo per le imprese italiane. Una convinzione costruita sul campo, tra sopralluoghi, aule di formazione e tavoli istituzionali — fino ai riconoscimenti in contesti internazionali come il network CIFAL delle Nazioni Unite.', true),
  S('home.founder.p2', 'Paragrafo 2', G.founder, 'Oggi quella visione vive in ogni progetto: sistemi di gestione che le aziende usano davvero, persone formate e consapevoli, documenti sempre pronti all’ispezione. Dalle sedi di Treviso e Milano, al fianco delle imprese, ogni giorno.', true),
  S('home.founder.caption', 'Didascalia foto', G.founder, 'Il Fondatore'),
  S('home.founder.captionSub', 'Didascalia foto · sottotitolo', G.founder, 'E.M Safety S.r.l. — Treviso & Milano'),
  S('home.founder.cta', 'Pulsante', G.founder, 'Scopri chi siamo'),

  // Method
  S('method.label', 'Etichetta', G.method, 'Il Nostro Metodo'),
  S('method.title', 'Titolo', G.method, 'Dall’analisi alla conformità, un percorso trasparente.'),
  S('method.description', 'Descrizione', G.method, 'Un approccio chiaro in cinque fasi, basato su ascolto, competenza tecnica e soluzioni su misura, senza sorprese e senza costi occulti.', true),
  ...METHOD.flatMap((m, i) => [
    S(`method.${i}.title`, `Fase ${i + 1} · titolo`, G.method, m.title),
    S(`method.${i}.text`, `Fase ${i + 1} · testo`, G.method, m.text, true),
  ]),

  // Pages
  S('page.servizi.label', 'Etichetta', G.pServizi, 'I Nostri Servizi'),
  S('page.servizi.title', 'Titolo', G.pServizi, 'I nostri servizi per la'),
  S('page.servizi.highlight', 'Titolo · evidenziato', G.pServizi, 'sicurezza sul lavoro.'),
  S('page.servizi.subtitle', 'Sottotitolo', G.pServizi, 'Garantiamo conformità normativa e soluzioni su misura per ogni azienda: consulenza, sistemi di gestione, valutazioni tecniche e formazione accreditata.', true),

  S('page.chi.label', 'Etichetta', G.pChi, 'Chi Siamo'),
  S('page.chi.title', 'Titolo', G.pChi, 'La nostra missione è garantire sicurezza e salute sul lavoro,'),
  S('page.chi.highlight', 'Titolo · evidenziato', G.pChi, 'su misura per ogni impresa.'),
  S('page.chi.subtitle', 'Sottotitolo', G.pChi, 'Presentiamo i valori fondamentali di E.M Safety Group: il nostro impegno verso la conformità normativa e il benessere aziendale orienta ogni azione e strategia.', true),
  S('page.chi.missionTitle', 'Sezione gruppo · titolo', G.pChi, 'Il Gruppo E.M Safety'),
  S('page.chi.missionP1', 'Sezione gruppo · paragrafo 1', G.pChi, 'I nostri servizi assicurano conformità normativa e protezione della salute dei dipendenti. Dietro ogni soluzione su misura c’è una rete di professionisti specializzati, selezionati per competenza ed esperienza nei rispettivi ambiti.', true),
  S('page.chi.missionP2', 'Sezione gruppo · paragrafo 2', G.pChi, 'Costruiamo Sistemi di Gestione Integrati che le aziende usano davvero, creando valore aggiunto e non solo conformità: progettazione dei sistemi (Qualità, Ambiente, Energia e Sicurezza), audit e verifiche ispettive, cultura organizzativa, monitoraggio normativo continuo e misurazione delle performance HSE.', true),
  S('page.chi.cta', 'Pulsante', G.pChi, 'Parla con noi'),

  S('page.test.label', 'Etichetta', G.pTest, 'Testimonianze'),
  S('page.test.title', 'Titolo', G.pTest, 'Testimonianze autentiche dai'),
  S('page.test.highlight', 'Titolo · evidenziato', G.pTest, 'clienti soddisfatti.'),
  S('page.test.subtitle', 'Sottotitolo', G.pTest, 'Progetti reali di consulenza e formazione: come abbiamo aiutato le aziende a raggiungere conformità, efficienza e piena tutela dei lavoratori.', true),
  S('page.test.quote', 'Citazione in evidenza', G.pTest, '"La nostra collaborazione con E.M Safety ha garantito soluzioni precise e conformi, migliorando significativamente la sicurezza aziendale."', true),
  S('page.test.quoteName', 'Citazione · nome', G.pTest, 'Marco Rossi'),
  S('page.test.quoteRole', 'Citazione · ruolo', G.pTest, 'Responsabile Sicurezza Aziendale'),
  S('page.test.certsTitle1', 'Certificazioni · titolo 1', G.pTest, 'Affidabilità comprovata,'),
  S('page.test.certsTitle2', 'Certificazioni · titolo 2 (blu)', G.pTest, 'sicurezza garantita.'),
  S('page.test.certsDescription', 'Certificazioni · descrizione', G.pTest, 'Le nostre certificazioni principali e i riconoscimenti ottenuti nel settore testimoniano la nostra professionalità e serietà.', true),
  S('page.test.cta', 'Pulsante', G.pTest, 'Diventa il prossimo caso di successo'),

  S('page.faq.label', 'Etichetta', G.pFaq, 'FAQ & Chiarimenti'),
  S('page.faq.title', 'Titolo', G.pFaq, 'Domande frequenti su'),
  S('page.faq.highlight', 'Titolo · evidenziato', G.pFaq, 'sicurezza e salute sul lavoro.'),
  S('page.faq.subtitle', 'Sottotitolo', G.pFaq, 'Risposte chiare e professionali alle principali domande relative ai nostri servizi di sicurezza sul lavoro.', true),
  S('page.faq.challengesTitle1', 'Sfide · titolo 1', G.pFaq, 'Affrontare le sfide reali della'),
  S('page.faq.challengesTitle2', 'Sfide · titolo 2 (blu)', G.pFaq, 'sicurezza sul lavoro.'),
  S('page.faq.challengesDescription', 'Sfide · descrizione', G.pFaq, 'Identifichiamo i problemi più frequenti in azienda e spieghiamo come i nostri servizi garantiscano soluzioni efficaci e conformi.', true),
  S('page.faq.cta', 'Pulsante', G.pFaq, 'Richiedi una consulenza personalizzata'),

  S('page.storie.label', 'Etichetta', G.pStorie, 'Storie di Successo'),
  S('page.storie.title', 'Titolo', G.pStorie, 'I risultati che costruiamo,'),
  S('page.storie.highlight', 'Titolo · evidenziato', G.pStorie, 'insieme ai nostri clienti.'),
  S('page.storie.subtitle', 'Sottotitolo', G.pStorie, 'Progetti reali di consulenza e formazione: come abbiamo aiutato aziende di ogni settore a raggiungere la piena conformità e a rendere la sicurezza un valore aggiunto.', true),

  S('page.contatti.label', 'Etichetta', G.pContatti, 'Contatti'),
  S('page.contatti.title', 'Titolo', G.pContatti, 'Contattaci per assistenza e'),
  S('page.contatti.highlight', 'Titolo · evidenziato', G.pContatti, 'informazioni sui nostri servizi.'),
  S('page.contatti.subtitle', 'Sottotitolo', G.pContatti, 'Hai bisogno di una consulenza o di un preventivo gratuito? Compila il modulo o contattaci direttamente: ti risponderemo entro 24-48 ore lavorative.', true),

  // Company
  S('company.name', 'Ragione sociale', G.company, COMPANY.name),
  S('company.legalOffice', 'Sede legale', G.company, COMPANY.legalOffice),
  S('company.operativeOffice', 'Sede operativa', G.company, COMPANY.operativeOffice),
  S('company.phone', 'Telefono fisso', G.company, COMPANY.phone),
  S('company.mobile', 'Cellulare', G.company, COMPANY.mobile),
  S('company.email', 'Email', G.company, COMPANY.email),
  S('company.pec', 'PEC', G.company, COMPANY.pec),
  S('company.vat', 'P.IVA', G.company, COMPANY.vat),
  S('company.rea', 'N° REA', G.company, COMPANY.rea),
  S('company.hours', 'Orari', G.company, COMPANY.hours),
];

export const TEXT_DEFAULTS: Record<string, string> = Object.fromEntries(TEXT_SLOTS.map((s) => [s.key, s.default]));
export const TEXT_GROUPS = Array.from(new Set(TEXT_SLOTS.map((s) => s.group)));
