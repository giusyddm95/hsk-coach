# Regole di lavoro per questo progetto

Progetto: HSK Coach, web app per iPhone per studiare il cinese (HSK 1-9). La specifica completa è in `SPEC.md` e l'ordine di costruzione in `PIANO.md`: leggili all'inizio di ogni sessione e, a fine tappa, aggiorna la sezione "Stato" di `PIANO.md`.

## Chi sono
Sono alle prime armi con la programmazione. Uso Windows. Voglio capire cosa succede, non solo ricevere codice.

## Come lavorare con me
- Parla in italiano. Spiega ogni passaggio con parole semplici, in poche righe, prima di farlo.
- Lavora a piccoli passi: una funzione alla volta, poi fermati e dimmi come provarla.
- Prima di cancellare o riscrivere file esistenti, chiedimelo.
- Quando mi chiedi di fare qualcosa io (aprire un link, toccare un pulsante sull'iPhone), scrivi i passaggi numerati e precisi.
- Se una richiesta è ambigua, scegli l'opzione più semplice, dimmi quale hai scelto e vai avanti.
- Se non sei sicuro di qualcosa (comportamento di Safari su iPhone, un dato sul cinese), dillo chiaramente.

## Regole tecniche
- L'app: solo HTML, CSS e JavaScript puro con moduli ES. Niente framework, niente build, niente TypeScript.
- Gli script in `tools/` che preparano i dati girano con Node.js e possono usare pacchetti npm; i file scaricati dalle fonti vanno in `tools/fonti/`, esclusa da git.
- Le librerie esterne si copiano nella cartella `vendor/`, non si caricano da CDN a ogni avvio.
- Tutto deve funzionare offline dopo la prima apertura.
- Ogni volta che cambi un file dell'app, aumenta il numero di versione della cache in `sw.js`, altrimenti l'iPhone continua a mostrare la versione vecchia.
- Codice leggibile, commenti brevi in italiano dove la logica non è ovvia.
- Prova sempre la larghezza di 390 px.
- Per provare in locale avvia un server statico nella cartella del progetto (ad esempio `npx serve .` oppure `python -m http.server 8000`) e dimmi l'indirizzo da aprire.

## Git
- Dopo ogni funzione che funziona, fai un commit con un messaggio in italiano che descrive la modifica.
- Non fare `git push` senza dirmelo prima.

## Contenuti in cinese
- Non inventare parole, frasi o traduzioni dentro il codice. I dati vengono dai file in `data/`.
- I contenuti generati con l'AI (traduzioni, spiegazioni di grammatica, letture) hanno sempre `"verificato": false` finché non li controllo io.
- Quando generi contenuti, lavora a blocchi piccoli e fai controllare a uno script che usino solo caratteri del livello.
