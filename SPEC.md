# HSK Coach: specifica dell'app (versione 2 della specifica)

Documento dei requisiti. L'assistente di programmazione (Claude Code o Codex) lo legge all'inizio di ogni sessione insieme a `PIANO.md`, che dice in che ordine costruire le cose. Se una richiesta in chat contraddice questo file, vale la richiesta più recente, ma va segnalato.

## 1. Obiettivo

Un'app personale per iPhone che mi faccia migliorare davvero in tutte le parti del cinese mandarino, dall'HSK 1 alla fascia HSK 7-9: lessico, caratteri, grammatica, ascolto, pronuncia e toni, lettura, scrittura, conversazione. Interfaccia in italiano. Uso quotidiano di 20-30 minuti, spesso offline.

Il criterio per giudicare ogni funzione: mi fa ricordare, capire o produrre cinese meglio di prima? Le funzioni decorative (punti, medaglie, animazioni) vengono dopo e solo se costano poco.

## 2. Principi didattici

Sono le scelte da cui discende tutto il resto. Non sono negoziabili senza parlarne con me.

1. Richiamo attivo. Quasi ogni esercizio mi chiede di produrre una risposta prima di mostrarmela. Leggere e riconoscere passivamente serve poco (effetto del test: Roediger e Karpicke, Psychological Science, 2006).
2. Ripetizione dilazionata con un unico motore per tutto. Parole, caratteri, punti di grammatica e frasi finiscono nella stessa coda di ripasso, gestita dall'algoritmo FSRS (lo stesso usato da Anki dalla versione 23.10). La base scientifica della ripetizione distanziata: Cepeda e colleghi, Psychological Bulletin, 2006.
3. Ogni parola nuova arriva dentro una frase. Una parola isolata si dimentica e non insegna come si usa.
4. Prima capisco, poi produco. Per ogni elemento nuovo: esposizione con audio, poi riconoscimento, poi produzione (scrivere, dire, costruire una frase).
5. L'app sceglie per me. Apro l'app, tocco "Sessione di oggi" e l'app compone una sessione equilibrata tra le abilità. Posso comunque allenare una singola abilità dal menu.
6. Gli errori tornano. Ogni risposta sbagliata alimenta il ripasso e la statistica dell'abilità corrispondente.
7. Onestà sui contenuti. Tutto ciò che è generato dall'AI e non ancora verificato è marcato e lo vedo come tale nell'app.

## 3. Piattaforma e vincoli tecnici

- Web app installabile (PWA): si apre da Safari e si aggiunge alla schermata Home dell'iPhone.
- Sviluppo su PC Windows. Niente Mac, niente Xcode, niente App Store.
- L'app: HTML, CSS e JavaScript puro con moduli ES. Nessun framework, nessun passaggio di build. Le librerie esterne si copiano in `vendor/`.
- Gli script che preparano i dati (cartella `tools/`) girano sul PC con Node.js e possono usare pacchetti npm. L'app pubblicata contiene solo il risultato, cioè file JSON statici in `data/`.
- Offline dopo la prima apertura (service worker). I dati dei livelli si scaricano quando li apro la prima volta e poi restano in cache.
- Progressi salvati sul telefono in IndexedDB. Nessun server, nessun account.
- Pubblicazione gratuita su GitHub Pages.
- Mobile first: larghezza 390 px, pulsanti di almeno 44 px, safe area, tema chiaro e scuro automatico.
- Font cinesi: `"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif` ("Microsoft YaHei" serve solo perché le prove sul PC Windows somiglino all'iPhone).

## 4. Fonti dei dati

Livello di riferimento: il nuovo sillabo d'esame HSK pubblicato a novembre 2025 (新版HSK考试大纲), che sostituisce la distribuzione per livelli dello standard 2021. I numeri cumulativi di parole sono: HSK 1: 300, HSK 2: 500, HSK 3: 1.000, HSK 4: 2.000, HSK 5: 3.600, HSK 6: 5.400, HSK 7-9: circa 11.000.

| Cosa | Fonte | Licenza | Uso |
|---|---|---|---|
| Parole, caratteri e punti di grammatica per livello (sillabo 2025) | GitHub `krmanik/HSK-3.0`, cartella `New HSK (2025)/` (`HSK Words`, `HSK Hanzi`, `HSK Handwritten`, `HSK Grammar/json`) | CC BY-SA 4.0, come dichiarato nel file `License.md` del repository; è una trascrizione non ufficiale del sillabo (il repository cita il PDF ufficiale) | assegna il livello a ogni elemento |
| Pinyin, significati in inglese, classificatori, frequenza | GitHub `drkameleon/complete-hsk-vocabulary`, file `complete.min.json` | MIT per il repository; i significati vengono da CC-CEDICT (CC BY-SA 4.0), come dice il suo README | dettagli di ogni parola |
| Parole mancanti nel file sopra | CC-CEDICT | CC BY-SA 4.0 | riserva |
| Frasi reali con traduzione | Tatoeba, frasi in cinese mandarino (`cmn`) e traduzioni in italiano e inglese | CC BY 2.0 FR | frasi d'esempio, ascolto, riordino |
| Ordine dei tratti | Hanzi Writer (MIT) e `hanzi-writer-data` (Arphic Public License) | vedi a sinistra | animazioni e quiz di scrittura; i dati dei tratti si copiano in `data/` (vedi 6.3) |
| Algoritmo di ripasso | `ts-fsrs` | MIT | motore FSRS, da copiare in `vendor/` se funziona senza build, altrimenti da implementare in `js/srs.js` seguendo le formule FSRS |

Note per gli script di `tools/`:
- Nelle liste 2025 alcune parole hanno un numero per distinguere gli omografi (`本1`, `点2`) o varianti tra parentesi (`差（一）点儿`). Vanno normalizzate prima di cercarle in `complete.min.json`. Una prova fatta il 9/10/2026 senza normalizzazione trovava 936 parole mancanti su 11.105, quasi tutte per questo motivo.
- Le frasi Tatoeba vanno filtrate per livello: una frase è "di livello N" se tutti i suoi caratteri compaiono tra i caratteri dei livelli da 1 a N. È un controllo approssimato (non segmenta le parole), quindi va bene come primo filtro. Le registrazioni audio di Tatoeba hanno licenze diverse per autore: non usarle, l'audio lo fa la sintesi vocale.
- Si usano solo le liste del sillabo 2025: niente opzione per le liste dello standard 2021.
- I file in `data/` che derivano da fonti CC BY-SA 4.0 (liste 2025, significati CC-CEDICT) vanno distribuiti con la stessa licenza.
- Pagina "Informazioni" nell'app con tutte le fonti e le licenze.

Contenuti che preparo io con l'AI, tramite gli script e i prompt di `PIANO.md`, sempre con il campo `"verificato": false` finché non li controllo:
- traduzioni italiane delle parole (`data/it/`),
- spiegazioni in italiano dei punti di grammatica, con esempi ed esercizi (`data/grammatica/`),
- testi di lettura graduati e dialoghi (`data/letture/`).

## 5. Modello dei dati (indicativo)

Ogni cosa da studiare è un "elemento" con un tipo: `parola`, `carattere`, `grammatica`, `frase`. Ogni elemento genera una o più "carte", ognuna con il proprio stato FSRS. Esempio: la parola 爱好 genera le carte "carattere → significato", "significato → carattere", "audio → significato".

```json
{"id":"w:爱好","tipo":"parola","livello":1,"zh":"爱好","py":"ài hào","pyn":"ai4 hao4",
 "en":["to like; to be fond of","interest; hobby"],"it":"piacere; hobby",
 "frasi":["t:123456"],"verificato":false}
```

```json
{"id":"g:1-021","tipo":"grammatica","livello":1,"titolo":"了 dopo il verbo: azione compiuta",
 "schema":"Soggetto + Verbo + 了 + Oggetto","spiegazione":"...","attenzione":"...",
 "esempi":[{"zh":"他买了一本书。","py":"...","it":"Ha comprato un libro."}],
 "esercizi":[{"tipo":"completa","zh":"我昨天看＿一个电影。","risposta":"了"},
             {"tipo":"riordina","parti":["我","了","吃","饺子"],"risposta":"我吃了饺子"}],
 "verificato":false}
```

## 6. I moduli

### 6.0 Livelli e unità
- I livelli sono quelli reali dell'HSK, secondo il sillabo 2025 (sezione 4).
- Ogni livello è diviso in unità. Un'unità contiene da 2 a 4 punti di grammatica e le parole che servono a usarli (indicativamente 20-40 parole nei livelli 1-3, di più nei livelli alti), più le frasi, i dialoghi e i testi collegati. Le unità le costruisce uno script in `tools/`, seguendo un ordine didattico dei punti di grammatica scritto in un file che posso modificare, e la frequenza delle parole. Non si segue l'ordine del sillabo, perché il sillabo elenca i punti per categorie (prefissi, tipi di parola, tipi di frase…) e non per lezioni. Posso spostare elementi da un'unità all'altra modificando un file.
- Toccando un'unità vedo una tabella con tutto ciò che contiene, diviso per argomento (grammatica, lessico, caratteri, ascolto, lettura), con lo stato di ogni elemento (nuovo, in studio, imparato) e un pulsante per studiare solo quell'argomento.
- La sessione di oggi segue l'unità in corso; quando un'unità è imparata all'80% passa alla successiva.

### 6.1 Sessione di oggi (schermata principale)
Un pulsante. L'app compone una sessione di circa 20-25 minuti in blocchi:
1. Ripasso: le carte scadute di tutti i tipi, mescolate (massimo 10-12 minuti, il resto si sposta a domani).
2. Novità dall'unità in corso: un punto di grammatica nuovo (quando è il momento del successivo) e da 5 a 10 parole nuove, presentate dentro frasi.
3. Ascolto: 5 frasi con parole che conosco.
4. Lettura: un testo breve o un dialogo del mio livello.
5. Produzione: una frase da scrivere usando il punto di grammatica del giorno, e una frase da ripetere ad alta voce registrandomi.

I blocchi si saltano se non ci sono contenuti. Alla fine: riepilogo di cosa è andato bene e cosa ripasserò domani.

### 6.2 Lessico
- Carte con tre direzioni: carattere → significato, significato → carattere, audio → significato.
- Quattro risposte FSRS: "Di nuovo", "Difficile", "Bene", "Facile".
- Ogni carta mostra una frase d'esempio con audio.
- Dizionario del livello: ricerca per carattere, pinyin anche senza toni, significato italiano o inglese; stato di ogni parola.

### 6.3 Caratteri e scrittura
- Animazione dell'ordine dei tratti e quiz in cui traccio il carattere con il dito (Hanzi Writer). I dati dei tratti dei caratteri delle liste `HSK Handwritten` si copiano in `data/` con uno script, insieme al testo della licenza, così funzionano offline anche per i caratteri mai aperti.
- Radicale di ogni carattere (dal campo `r` di `complete.min.json`). Componenti: da definire, perché oggi nessuna fonte della sezione 4 li contiene.
- Dettato: ascolto una parola o una frase e la scrivo con la tastiera cinese pinyin dell'iPhone. L'app confronta il risultato.
- I caratteri da saper scrivere a mano seguono la lista `HSK Handwritten`, che è più corta di quella da riconoscere.

### 6.4 Grammatica
- Elenco di tutti i punti di grammatica, consultabile in qualsiasi momento e raggruppato per livello e per unità, dal sillabo 2025 (70 punti per l'HSK 1, 78 per il 2, 96 per il 3, 95 per il 4, 70 per il 5, 50 per il 6, 134 per il 7-9, contati il 9/10/2026).
- Scheda di ogni punto: titolo in italiano, schema della frase, spiegazione breve, l'errore tipico da evitare, 3-5 esempi con audio.
- Esercizi che entrano nel ripasso FSRS: completa la frase, metti in ordine le parole (lo stesso tipo di esercizio dell'esame), trova l'errore, trasforma la frase (affermativa → negativa, domanda).
- In ogni esercizio vedo la frase in cinese e, accanto o subito sotto, la traduzione italiana (con un interruttore per nasconderla quando voglio mettermi alla prova).
- Alla fine di ogni serie di esercizi, un pulsante "Rifai le frasi sbagliate" ripropone subito solo quelle che ho sbagliato; le stesse frasi tornano poi nel ripasso dei giorni seguenti.
- Un punto si "sblocca" quando ho visto il punto precedente; si considera imparato dopo tre risposte giuste in giorni diversi.

### 6.5 Ascolto, pronuncia e toni
- Audio con la sintesi vocale del telefono (`speechSynthesis`, voce `zh-CN`), velocità regolabile, ripetizione con un tocco. Se manca la voce cinese, spiegare come scaricarla da Impostazioni > Accessibilità > Contenuto letto > Voci.
- Allenamento dei toni: ascolto una sillaba o una parola di due sillabe e scelgo i toni.
- Coppie minime: due parole simili (mǎi / mài), quale ho sentito?
- Ascolto di frasi: sento la frase senza testo e scelgo il significato, poi vedo il testo.
- Dialoghi da ascoltare, divisi per livello e per unità: prima solo audio, poi con testo cinese, pinyin e traduzione italiana, infine domande di comprensione. Se l'iPhone ha più voci cinesi, ogni personaggio ha la sua; altrimenti cambiano tono e velocità.
- Shadowing: ascolto, mi registro (MediaRecorder), riascolto le due versioni una dopo l'altra.
- Riconoscimento vocale (Web Speech API): sperimentale. Va provato sul mio iPhone nell'app installata; se non funziona in modo affidabile si nasconde.

### 6.6 Lettura
- Testi brevi e dialoghi graduati per livello. Tocco una parola e vedo pinyin e significato; con un secondo tocco la aggiungo al ripasso.
- Interruttore pinyin: sempre, solo per le parole nuove, mai.
- Domande di comprensione alla fine di ogni testo.
- Velocità di lettura: tempo impiegato e caratteri al minuto, per vedere il miglioramento nel tempo.

### 6.7 Conversazione e correzione con l'AI
Le abilità attive (parlare, scrivere testi) hanno bisogno di qualcuno che corregga. Due modalità:
1. Ponte verso Claude o ChatGPT (gratis, da fare per prima). Un pulsante "Esercitati con l'AI" prepara un prompt con il mio livello, le parole che conosco, il punto di grammatica del giorno e il tipo di esercizio (conversazione su un tema, correzione di un mio testo, gioco di ruolo). Il prompt si copia negli appunti e apre l'app scelta. Con la modalità vocale di ChatGPT o Claude diventa una conversazione parlata.
2. Tutor integrato (opzionale, ultima fase). L'app chiama direttamente le API di Claude con una mia chiave salvata solo sul telefono, per correggere le frasi scritte nell'esercizio di produzione senza uscire dall'app. Ha un costo per uso: prima di costruirlo, l'assistente mi spiega costi e rischi e decido io.

### 6.8 Test e progressi
- "Segna come già note" (al posto del test di posizionamento), in due modi:
  - prova rapida per livello: l'app mi mostra 30 parole a caso del livello; se ne so almeno 27, mi propone di segnare tutto il livello come già noto, e lo fa solo se confermo;
  - una alla volta: tocco "La so" o "Non la so" su ogni carta.

  Le parole segnate come note restano in ripasso, con intervalli lunghi.
- Prova di livello stile esame: ascolto, lettura, grammatica, riordino, con punteggio.
- Statistiche per abilità: lessico, caratteri, grammatica, ascolto, lettura, produzione. Per ognuna: percentuale di risposte corrette negli ultimi 30 giorni e quantità di materiale imparato rispetto al livello.
- Calendario delle sessioni fatte e serie di giorni consecutivi.

### 6.9 Impostazioni e dati
- Livello attuale e livello obiettivo.
- Durata della sessione di oggi (10, 20, 30 minuti) e numero di parole nuove al giorno.
- Pinyin con i toni colorati: 1° rosso, 2° arancione, 3° verde, 4° blu, neutro grigio.
- Backup: esporta tutto in un file JSON e reimportalo. Promemoria nell'app se l'ultimo backup ha più di 7 giorni.
- Contenuti non verificati: mostra/nascondi; elenco di quelli che ho segnalato come sbagliati (pulsante "segnala" su ogni carta), da esportare per correggerli sul PC.

## 7. Cosa non fare
- Nessun login, server, pagamento, pubblicità o tracciamento.
- Nessuna notifica push. Per il promemoria uso l'app Promemoria dell'iPhone.
- Non inventare contenuti in cinese dentro il codice: i contenuti stanno in `data/` e vengono dagli script o dai file verificati.
- Non caricare tutti i livelli all'avvio: il livello 7-9 da solo è grande.

## 8. Criteri di accettazione generali
- Installata dalla Home, si apre a schermo intero con icona e nome "HSK Coach".
- In modalità aereo, dopo un primo utilizzo, la sessione di oggi funziona.
- Chiudendo e riaprendo l'app i progressi restano.
- Esporto il backup, cancello i dati, reimporto: tutto torna uguale.
- Una sessione completa si fa senza errori nella console.
- Su un iPhone di qualche anno fa l'app si apre in meno di 3 secondi e passare da una carta all'altra non ha ritardi visibili.

## 9. Struttura dei file (indicativa)
```
index.html  manifest.webmanifest  sw.js
css/style.css
js/app.js            avvio e navigazione
js/db.js             IndexedDB
js/srs.js            FSRS e coda di ripasso
js/session.js        composizione della sessione di oggi
js/audio.js          sintesi vocale e registrazione
js/pinyin.js         toni colorati, ricerca senza accenti
js/screens/          un file per schermata
data/livello-N/      parole.json, caratteri.json, grammatica.json, frasi.json, letture.json
data/it/             traduzioni italiane
vendor/              librerie copiate
tools/               script Node.js che costruiscono data/ dalle fonti
icons/
```
