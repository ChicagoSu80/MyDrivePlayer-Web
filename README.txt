MYDRIVEPLAYER WEB — RETRO MUSIC — VERSIONE CON STREAMING

COSA CAMBIA
La playlist continua a essere letta dalla stessa API Google Apps Script.
La riproduzione audio passa ora attraverso una Netlify Edge Function che recupera il file da Google Drive e lo restituisce al browser come contenuto audio inline, inoltrando anche le richieste Range usate per avanzare e arretrare nel brano.

IMPORTANTE: PUBBLICAZIONE
Questa versione contiene una Netlify Edge Function. Non basta trascinare la cartella su Netlify Drop: per pubblicare anche la funzione occorre distribuire il progetto tramite un repository Git collegato a Netlify oppure tramite Netlify CLI.

METODO CONSIGLIATO CON GITHUB
1. Crea su GitHub un nuovo repository, ad esempio MyDrivePlayer-Web.
2. Carica nel repository TUTTI i file e le cartelle contenuti in questa cartella, mantenendo la struttura:
   - index.html
   - app.js
   - style.css
   - netlify.toml
   - netlify/edge-functions/audio.js
3. Su Netlify apri il sito my-songs-media-player.
4. Vai in Site configuration / Build & deploy (la dicitura può variare) e collega il repository Git appena creato.
5. Imposta la cartella di pubblicazione (Publish directory) su . e lascia vuoto il comando di build.
6. Avvia il deploy e attendi che termini. Controlla nei log che la Edge Function "audio" sia stata rilevata e pubblicata.

CONFIGURAZIONE GOOGLE DRIVE
L'URL Apps Script è già inserito in app.js. Non modificare la cartella Drive né la distribuzione Apps Script.
I file audio devono restare condivisi con "Chiunque abbia il link – Visualizzatore".

NOTA TECNICA
La funzione inoltra l'intestazione Range quando richiesta dal browser e mantiene il codice HTTP restituito da Google Drive. La compatibilità dipende comunque dal tipo di risposta che Drive fornisce per ciascun file.

PRIVACY
L'API e i link Drive sono pubblici: chiunque conosca l'indirizzo del sito può visualizzare la playlist e accedere ai file condivisi.
