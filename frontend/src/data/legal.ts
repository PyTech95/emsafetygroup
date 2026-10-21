// Testi legali mostrati nel footer, nel banner cookie e nel modulo di iscrizione ai corsi.
// I paragrafi sono separati da una riga vuota (\n\n).
// NB: testi indicativi — da far verificare al consulente privacy di E.M Safety.

export const LEGAL: Record<string, string> = {
  'Privacy Policy':
    'E.M Safety S.r.l. tutela la riservatezza dei dati personali conferiti ai sensi del Regolamento UE 2016/679 (GDPR). I dati raccolti tramite form o contatto diretto sono trattati unicamente per rispondere alle richieste commerciali e gestire l’erogazione delle attività formative e consulenziali.\n\n' +
    'Iscrizione ai corsi: i dati inseriti nel modulo di iscrizione (nome, cognome, luogo e data di nascita, recapiti, azienda ed eventuale codice fiscale) sono utilizzati per organizzare il corso, gestire il registro presenze ed emettere l’attestato di formazione previsto dalla normativa (D.Lgs. 81/08 e Accordi Stato-Regioni).\n\n' +
    'Verifica attestati: ogni attestato riporta un codice univoco e un QR code. Chi possiede il codice può verificarne l’autenticità sul sito, visualizzando nome, cognome, luogo e data di nascita, tipologia e data del corso, durata e validità. I dati non sono consultabili senza il codice.',
  'Cookie Policy':
    'Questo sito utilizza cookie e tecnologie simili (come il localStorage del browser). Puoi scegliere quali categorie attivare dal banner mostrato alla prima visita e modificare la scelta in qualsiasi momento cliccando sull’icona del lucchetto in basso a sinistra.\n\n' +
    'Cookie tecnici necessari — sempre attivi. Servono al funzionamento del sito: memorizzano le tue preferenze sui cookie e mantengono la sessione dell’Area Riservata. Non richiedono il consenso.\n\n' +
    'Cookie statistici — attivi solo con il tuo consenso. Ci aiutano a capire in forma aggregata come viene utilizzato il sito, per migliorarlo.\n\n' +
    'Cookie di marketing e pubblicità — attivi solo con il tuo consenso. Cookie e identificatori di annunci (anche di servizi Google) possono essere usati per mostrare pubblicità personalizzata e non personalizzata. Per i servizi Google consulta la Privacy Policy di Google (policies.google.com/privacy).\n\n' +
    'Chiudendo il banner con la X continui la navigazione senza accettare: restano attivi solo i cookie tecnici. La scelta viene conservata per 6 mesi, al termine dei quali ti verrà richiesta di nuovo.',
  'Termini e Condizioni':
    'Le iscrizioni ai corsi e gli incarichi professionali sono regolati dalle condizioni di contratto siglate in sede di preventivo approvato. Gli attestati vengono emessi a seguito del superamento dei test e del rispetto della frequenza minima prevista.',
};
