# HSK Coach: piano di costruzione

Questo è l'ordine in cui costruire l'app descritta in `SPEC.md`. L'assistente di programmazione esegue un passo alla volta, si ferma, mi dice come provarlo e aspetta il mio ok. Ogni tappa finisce con la pubblicazione su GitHub Pages, la prova sull'iPhone e una revisione (prompt P8).

L'ordine segue un'idea semplice: prima le fondamenta che servono a tutto (installazione, dati, motore di ripasso), poi un'abilità alla volta, cominciando da quelle che sostengono le altre. Ogni tappa lascia un'app che funziona e che posso già usare per studiare.

Il lessico di tutti i livelli (parole, pinyin, significati, frasi Tatoeba) esce in automatico dagli script della tappa 1. I contenuti preparati con l'AI (traduzioni, grammatica, letture) si preparano invece per livelli: prima HSK 1-3, poi 4-6, poi 7-9. Non conviene generarli tutti subito, perché i primi livelli mi diranno se il formato dei contenuti va bene.

Si usano solo le liste del sillabo 2025.

---

## Tappa 0. Fondamenta

0.1 Scheletro installabile: `index.html`, manifest con percorsi relativi (l'app vive in `/hsk-coach/`), service worker con versione della cache e prefisso `hsk-coach-` nei nomi delle cache, icone PNG provvisorie (180, 192, 512 px, senza trasparenza), home vuota con il nome dell'app e il numero di versione in vista.

Provo: si apre nel browser del PC alla larghezza di 390 px; in F12 > Application il service worker risulta attivo; con "Offline" spuntato la pagina si ricarica lo stesso.

0.2 Pubblicazione su GitHub Pages (prompt P3) e installazione sull'iPhone.

Provo: icona sulla Home, apertura a schermo intero; dopo una prima apertura dalla Home con la rete accesa, l'app si apre anche in modalità aereo.

0.3 Aggiornamenti: controllo di una versione nuova all'avvio e quando l'app torna in primo piano, avviso "Nuova versione: tocca per aggiornare", pulsante "Controlla aggiornamenti".

Provo: cambio un testo e pubblico; sull'iPhone compare l'avviso; dopo il tocco vedo il testo nuovo e il numero di versione nuovo.

0.4 Navigazione tra le schermate (Oggi, Studia, Dizionario, Progressi, Impostazioni) con una barra in basso, tema chiaro e scuro, pagina Informazioni con fonti e licenze.

Provo: tocco tutte le voci, ruoto il telefono, cambio tema dalle impostazioni dell'iPhone.

0.5 Pagina Diagnostica (nascosta, raggiungibile da Informazioni): mostra versione di iOS, voci cinesi disponibili con una prova di lettura, risposta alla richiesta di archiviazione persistente, spazio usato, supporto alla registrazione audio e al riconoscimento vocale.

Provo: la apro sull'iPhone nell'app installata e mando uno screenshot all'assistente. Serve a sapere subito cosa funziona davvero sul mio telefono.

## Tappa 1. Dati del lessico (tutti i livelli)

1.1 Script `tools/scarica-fonti.mjs`: scarica le fonti elencate in SPEC.md, sezione 4, in `tools/fonti/` (cartella esclusa da git), sempre alla stessa versione fissa di ogni repository, così rifare i dati dà sempre lo stesso risultato.

Provo: l'assistente mi mostra quanti file e quante righe ha scaricato.

1.2 Script `tools/costruisci-dati.mjs`, parte parole: normalizza omografi e varianti (`本1`, `差（一）点儿`), assegna a ogni parola un ID stabile (tipo + parola come scritta nel sillabo, numero dell'omografo compreso, per esempio `w:本1`; mai la posizione nella lista), unisce pinyin e significati da `complete.min.json`, scrive `data/livello-N/parole.json` e `data/indice.json` (elenco dei file con la loro versione).

Provo: un rapporto con il numero di parole per livello (attese: 300, 204, 507, 1.019, 1.638, 1.815, 5.622), l'elenco delle parole non trovate e la dimensione dei file del livello 7-9.

1.3 Riserva CC-CEDICT per le parole mancanti e `data/livello-N/caratteri.json`.

Provo: il rapporto dice che nessuna parola è rimasta senza pinyin e mi mostra l'elenco delle parole con più letture possibili.

1.4 Frasi Tatoeba: filtro per livello con una divisione semplice in parole (la parola più lunga che si trova nel lessico), per scartare le frasi con parole di livello più alto; fino a 3 frasi per parola, preferendo quelle brevi e quelle con traduzione italiana. Se manca l'italiano si mostra l'inglese.

Provo: il rapporto dice, per ogni livello, quante parole hanno almeno una frase e quante una frase con traduzione italiana. Se le parole con una frase sono meno dell'80%, ne parliamo prima di andare avanti.

## Tappa 2. Motore di ripasso

2.1 `js/db.js` con IndexedDB: carte, storico delle risposte, impostazioni. Numero di versione dello schema, salvataggio dopo ogni risposta, riapertura automatica della connessione se iOS la chiude.

Provo: una pagina di prova nascosta crea dati finti; chiudo e riapro il browser; i dati ci sono ancora.

2.2 Backup: esportazione in un file JSON (foglio di condivisione dell'iPhone, con il download classico come riserva) e importazione con controllo del formato.

Provo: dalla pagina di prova esporto, cancello i dati, reimporto: tutto torna uguale.

2.3 `js/srs.js` con FSRS, usando `ts-fsrs` copiato in `vendor/` (verificato il 9/10/2026: la versione 5.4.2 funziona senza build). Test automatici con `node --test`: una carta nuova con "Di nuovo" torna dopo circa 1 minuto, con "Bene" dopo circa 10 minuti, con "Facile" dopo alcuni giorni; una carta già in ripasso con "Bene" ha un intervallo di giorni.

Provo: l'assistente esegue i test e mi mostra i risultati.

## Tappa 3. Prima versione da usare ogni giorno

3.1 Prima carta: carattere → significato, si gira con un tocco, quattro risposte collegate a FSRS, salvataggio a ogni risposta.

Provo: studio 10 carte dell'HSK 1, chiudo e riapro: lo stato delle carte è rimasto.

3.2 Impostazioni: livello, parole nuove al giorno, massimo di ripassi al giorno, pinyin con toni colorati sì/no, velocità della voce.

Provo: cambio un valore, chiudo e riapro: il valore è rimasto ed è applicato.

3.3 Prima versione di "Sessione di oggi": ripasso e parole nuove (nell'ordine della lista ufficiale del livello), limiti presi dalle impostazioni, riepilogo finale, ripresa se chiudo l'app a metà.

Provo: una sessione di 20 carte senza errori nella console; la chiudo a metà e riprendo dal punto in cui ero.

3.4 Audio (`js/audio.js`): voce `zh-CN`, velocità regolabile, messaggio con i passaggi per scaricare la voce se manca.

Provo sull'iPhone (dopo la pubblicazione): sento la parola, la velocità cambia, il pulsante funziona anche al primo tocco.

3.5 Pinyin con i toni colorati, frase d'esempio con audio sotto ogni carta, pulsante "segnala errore".

Provo: i colori corrispondono ai toni; la frase si sente; una segnalazione resta salvata dopo la chiusura.

3.6 Le altre due direzioni: significato → carattere e audio → significato, attivabili nelle impostazioni.

Provo: le attivo e compaiono nella sessione; le disattivo e spariscono.

3.7 Dizionario del livello con ricerca per carattere, pinyin (anche senza toni), significato; stato di ogni parola (nuova, in studio, imparata).

Provo: cerco "nǐ hǎo", "ni hao", "你" e una parola in inglese.

3.8 "Segna come già note", in due modi. Sostituisce il test di posizionamento.
- Prova rapida per livello: l'app mi mostra 30 parole a caso del livello e per ognuna tocco "La so" o "Non la so". Se ne so almeno 27, l'app mi propone di segnare tutto il livello come già noto, e lo fa solo se confermo. Se ne so meno di 27, mi propone di segnarle una alla volta.
- Una alla volta: una carta alla volta, tocco "La so" o "Non la so".

Le parole segnate come note entrano nel ripasso con intervalli lunghi, le altre restano nuove.

Provo:
1. Faccio la prova rapida dell'HSK 1 rispondendo "La so" ad almeno 27 parole: l'app mi propone di segnare tutto il livello; confermo e le parole del livello non compaiono più tra le nuove.
2. Rifaccio la prova su un altro livello rispondendo "Non la so" a più di 3 parole: l'app non propone di segnare tutto il livello.
3. Segno 20 parole una alla volta: non compaiono più tra le parole nuove.

3.9 Backup nelle Impostazioni (esporta e importa) e promemoria nell'app se l'ultimo backup ha più di 7 giorni.

Provo sull'iPhone: esporto e salvo in File, cancello i dati, reimporto: i progressi tornano uguali.

3.10 Traduzioni italiane HSK 1-3 (prompt P5), un livello per passo. Per le parole con il numero di omografo (`本1`, `本2`) la traduzione indica il significato giusto per quel numero.

Provo: le carte mostrano l'italiano, sotto l'inglese più piccolo, e il segno "non verificato".

Provo dopo questa tappa: studio davvero per tre giorni di fila e annoto cosa non mi convince. Da qui in poi l'app si usa ogni giorno, anche mentre si costruisce il resto.

## Tappa 4. Grammatica e unità

4.1 Grammatica (solo struttura): `data/livello-N/grammatica.json` con i punti del sillabo 2025, per tutti i livelli, ancora senza spiegazioni.

Provo: 70 punti per l'HSK 1, 78 per il 2, 96 per il 3, 95 per il 4, 70 per il 5, 50 per il 6, 134 per il 7-9.

4.2 Ordine didattico dell'HSK 1. Il sillabo è un catalogo per categorie (prefissi, tipi di parola, tipi di frase…), non un elenco di lezioni. L'assistente classifica ogni voce (da insegnare, implicita, da unire a un'altra) e propone un ordine di studio, confrontato con la Chinese Grammar Wiki. L'ordine sta in un file che posso modificare.

Provo: leggo l'elenco ordinato e lo correggo prima di andare avanti.

4.3 Contenuti: spiegazioni, esempi ed esercizi per i punti dell'HSK 1, nell'ordine del passo 4.2, a blocchi di 10 punti (prompt P9). Uno script controlla che esempi ed esercizi usino solo parole del livello (con la stessa divisione in parole del passo 1.4).

Provo: dopo ogni blocco l'assistente mi mostra 2 schede complete da controllare.

4.4 Schede di grammatica ed elenco dei punti per livello.

Provo: apro 3 punti e leggo scheda, esempi e audio.

4.5 Unità dell'HSK 1: lo script divide il livello in unità (SPEC.md, sezione 6.0) e scrive `data/livello-N/unita.json`; pagina dell'unità con la tabella degli argomenti e lo stato di ogni elemento; da qui la sessione di oggi segue l'unità in corso.

Provo: vedo l'elenco delle unità con i punti di grammatica e il numero di parole; tocco un'unità e vedo la tabella.

4.6 Esercizi "completa" e "riordina" nel ripasso FSRS, con la traduzione italiana sotto la frase e l'interruttore per nasconderla.

Provo: faccio 10 esercizi; nascondo e rimostro la traduzione.

4.7 Esercizi "trova l'errore" e "trasforma", con risposta modello e autovalutazione (le risposte giuste possono essere più di una, un confronto automatico sbaglierebbe); pulsante "Rifai le frasi sbagliate".

Provo: sbaglio di proposito 2 frasi; "Rifai le frasi sbagliate" ripropone proprio quelle.

4.8 Il blocco "Novità" della sessione di oggi introduce un punto nuovo quando quello precedente è stato visto.

Provo: dopo aver visto un punto, il successivo compare nella sessione.

4.9 Contenuti per HSK 2 e 3, un livello per passo, con lo stesso metodo dei passi 4.2 e 4.3.

## Tappa 5. Ascolto, pronuncia e toni

5.1 Script per i dati dell'ascolto: coppie minime (stessa sillaba, tono diverso) e caratteri con una sola lettura, da usare negli esercizi sui toni (i caratteri con più letture la voce li può leggere male).

Provo: l'assistente mi mostra un rapporto con qualche esempio per livello.

5.2 Allenamento dei toni e coppie minime.

Provo sull'iPhone: 10 domande, la voce si sente bene e il risultato è corretto.

5.3 Ascolto di frasi (prima senza testo, poi con testo) e blocco "Ascolto" nella sessione di oggi.

Provo: 5 frasi di ascolto dentro la sessione di oggi.

5.4 Shadowing con registrazione e riascolto. Il microfono si apre solo quando tocco "Registra" e si chiude subito dopo; le registrazioni non vengono salvate.

Provo sull'iPhone: il permesso del microfono funziona; dopo la registrazione la voce si sente con il volume normale.

5.5 Riconoscimento vocale (esperimento): solo se la Diagnostica del passo 0.5 dice che funziona sul mio iPhone, esercizio "leggi ad alta voce" con confronto del testo riconosciuto (ignorando punteggiatura e omofoni, senza voti); se no, si nasconde e si annota il motivo. Attenzione: usa la dettatura di Siri, quindi l'audio va ai server Apple e non funziona offline.

Provo sull'iPhone: leggo 5 frasi e guardo se il riconoscimento è affidabile.

## Tappa 6. Caratteri e scrittura

6.1 Script che copia in `data/` i dati dei tratti (`hanzi-writer-data`) dei soli caratteri delle liste `HSK Handwritten`, con il testo della licenza; Hanzi Writer in `vendor/`; animazione dell'ordine dei tratti.

Provo: in modalità aereo l'animazione funziona per un carattere mai aperto prima.

6.2 Quiz di scrittura: traccio il carattere con il dito.

Provo sull'iPhone: la pagina non scorre mentre disegno; il quiz riconosce i tratti.

6.3 Carte di scrittura nel ripasso per i caratteri della lista `HSK Handwritten` del mio livello.

Provo: le carte di scrittura compaiono nella sessione di oggi.

6.4 Dettato con la tastiera pinyin dell'iPhone (l'app mi spiega come aggiungere la tastiera cinese se non c'è). La risposta si controlla quando tocco "Verifica", non mentre scrivo.

Provo sull'iPhone: scrivo una parola con la tastiera cinese e la verifica funziona.

## Tappa 7. Lettura e dialoghi

7.1 Contenuti: 10 testi brevi e 10 dialoghi per livello 1-3 (prompt P6), con domande di comprensione, salvati già divisi in parole. Uno script controlla parole e lunghezza.

Provo: il rapporto dello script elenca i testi che non passano il controllo; ne leggo 3.

7.2 Lettore con tocco sulla parola, interruttore pinyin, aggiunta al ripasso.

Provo: tocco una parola, vedo pinyin e significato, la aggiungo al ripasso e la ritrovo nella sessione.

7.3 Domande di comprensione e misura della velocità di lettura.

Provo: rispondo alle domande di un testo e vedo i caratteri al minuto.

7.4 Dialoghi da ascoltare per livello e unità, con le voci dei personaggi (se c'è una sola voce cinese, i personaggi si distinguono con tono e velocità diversi).

Provo sull'iPhone: ascolto un dialogo prima senza testo, poi con testo e traduzione.

7.5 Blocco "Lettura" nella sessione di oggi.

Provo: la sessione di oggi contiene un testo o un dialogo.

## Tappa 8. Produzione e AI

8.1 Esercizio "scrivi una frase con il punto di grammatica di oggi": scrivo, poi vedo una frase modello e mi autovaluto.

Provo: scrivo una frase con la tastiera cinese e mi autovaluto.

8.2 Pulsante "Esercitati con l'AI": quattro modelli di prompt (conversazione su un tema, correzione di un testo, gioco di ruolo, spiegami questo errore) riempiti con livello, parole note e grammatica del giorno; copia negli appunti e apertura di Claude o ChatGPT.

Provo sull'iPhone: il prompt è negli appunti e verifico come si aprono Claude e ChatGPT dall'app installata (potrebbero aprirsi in Safari invece che nella loro app).

8.3 Blocco "Produzione" nella sessione di oggi.

Provo: la sessione di oggi finisce con l'esercizio di produzione.

## Tappa 9. Test e progressi

Il test di posizionamento è stato sostituito dal passo 3.8; il promemoria del backup è diventato il passo 3.9.

9.1 Prova di livello stile esame con punteggio per sezione, una sezione per passo (ascolto, lettura, grammatica, riordino).

Provo: faccio una sezione e vedo il punteggio.

9.2 Statistiche per abilità e calendario delle sessioni.

Provo: le statistiche corrispondono a quello che ho fatto negli ultimi giorni.

## Tappa 10. Contenuti dei livelli successivi

Il lessico dei livelli 4-9 è già pronto dalla tappa 1. Restano i contenuti preparati con l'AI.

10.1 Contenuti HSK 4-6: traduzioni, grammatica, letture, con lo stesso metodo delle tappe precedenti. Un livello e un tipo di contenuto per passo.

10.2 Contenuti HSK 7-9, un livello e un tipo di contenuto per passo. Verificare che i tempi di apertura restino buoni.

## Tappa 11 (opzionale). Tutor integrato

Prima di qualsiasi codice l'assistente mi spiega quanto costerebbe un mese di uso tipico con le API di Claude, dove resterebbe la chiave e cosa succede se qualcuno la trova. Decido io se farla.

---

## Regole per ogni passo

- Prima di scrivere codice, una spiegazione di 3-5 righe di cosa farà.
- Dopo: indirizzo locale da aprire, 3-5 cose da controllare, commit.
- Ogni passo ha la sua riga "Provo:".
- Non passare al passo successivo senza il mio ok.
- Se un passo si rivela più grande del previsto, dividerlo e dirmelo.
- Se un passo riguarda l'iPhone (audio, microfono, archiviazione, aggiornamenti), si pubblica e si prova sull'iPhone subito, senza aspettare la fine della tappa. L'assistente mi chiede sempre prima di fare `git push`.
- Ogni cambio della struttura del database ha un nuovo numero di versione e una migrazione. Prima di pubblicarla, l'assistente la prova sul PC importando un mio backup reale.
- Le fonti dei dati si scaricano sempre a una versione fissa.
- A fine tappa: pubblicazione, prova sull'iPhone, revisione P8, aggiornamento di questo file segnando la tappa come fatta.

## Stato

(L'assistente aggiorna questa sezione a ogni tappa completata.)

- 9/10/2026: piano rivisto prima di iniziare (unità spostate nella tappa 4, backup e "segna come già note" anticipati nella tappa 3, aggiunti i passi 0.3 Aggiornamenti e 0.5 Diagnostica, tolte le liste 2021).
