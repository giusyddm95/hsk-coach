# Prompt pronti da copiare

Ogni prompt va incollato nella sessione di Claude Code (o Codex) aperta sulla cartella `hsk-coach`. Il piano completo è già scritto in `PIANO.md`: l'assistente non deve inventarne uno, deve controllarlo ed eseguirlo un passo alla volta.

## P1. Controllo del piano (in modalità piano, niente codice)

Prima di incollarlo, attiva la modalità piano: in Claude Code premi Shift+Tab finché in basso compare "plan mode".

```
Leggi SPEC.md, PIANO.md e CLAUDE.md. Non scrivere ancora codice.
Il piano di costruzione è già scritto in PIANO.md. Controllalo come farebbe
uno sviluppatore esperto di web app per iPhone:
1. dimmi se l'ordine delle tappe ha problemi o dipendenze sbagliate,
2. segnala i passi troppo grandi per essere provati in una volta,
3. elenca i problemi noti di Safari su iPhone che toccano questo progetto
   (sintesi vocale, spazio di archiviazione, aggiornamento della cache,
   registrazione audio, riconoscimento vocale) e come li gestiresti,
4. dimmi quali fonti di dati in SPEC.md, sezione 4, ti sembrano rischiose.
Proponi le modifiche a PIANO.md, ma non applicarle finché non approvo.
Alla fine fammi le domande che ti servono.
```

Leggi la risposta. Se qualcosa non ti è chiaro, chiedi spiegazioni prima di approvare.

## P2. Esegui un passo

Esci dalla modalità piano (Shift+Tab) e usa questo prompt per ogni passo:

```
Esegui il passo 0.1 di PIANO.md. Prima spiegami in 3-5 righe cosa farai.
Quando hai finito:
1. avvia un server locale e dimmi quale indirizzo aprire,
2. dimmi in 3-5 punti cosa devo controllare,
3. fai un commit.
Fermati lì e aspetta il mio ok.
```

Per i passi successivi cambia solo il numero.

## P3. Pubblica su GitHub Pages (passo 0.2)

```
Esegui il passo 0.2: voglio pubblicare l'app su GitHub Pages con il mio
account GitHub. Guidami passo per passo: inizializza git se serve, crea un
repository pubblico chiamato hsk-coach (usa GitHub CLI; se non è installato
dimmi come installarlo su Windows), fai il push e attiva GitHub Pages dal
branch main. Alla fine dammi l'indirizzo pubblico dell'app e spiegami come
pubblicherò gli aggiornamenti le prossime volte.
```

## P4. Segnalare un problema

Copia lo schema e scrivi dopo i due punti:

```
Ho un problema.
Dove: (PC o iPhone)
Cosa ho fatto:
Cosa mi aspettavo:
Cosa è successo invece:
Messaggio di errore, se c'è:
Trova la causa, spiegamela in due righe, poi correggi e dimmi come
verificare che sia risolto.
```

Se hai uno screenshot, trascinalo nella finestra di Claude Code insieme al testo.

## P5. Traduzioni italiane (passo 3.10)

```
Crea le traduzioni italiane delle parole del livello 1 in data/it/, nel
formato descritto in SPEC.md. Traduzioni brevi, come in un dizionario
tascabile, con i significati principali separati da punto e virgola.
Lavora a blocchi di 100 parole. Quando non sei sicuro di una traduzione
aggiungi " ?" alla fine. Tutte le voci hanno "verificato": false.
Alla fine dimmi quante parole hanno il punto interrogativo.
```

Poi ripeti per i livelli 2 e 3. Le parole con il punto interrogativo controllale su un dizionario cinese-italiano o chiedile a un insegnante.

## P6. Testi di lettura (passo 7.1)

```
Crea data/livello-1/letture.json con 10 testi brevi e 10 dialoghi per il
livello 1, nel formato che hai usato per gli altri file di data/. Temi di
vita quotidiana, 40-80 caratteri per testo, 3 domande di comprensione
ciascuno. Usa solo parole dei livelli fino al livello 1. Fai controllare
a uno script che ogni carattere compaia nel vocabolario consentito e
dimmi quali testi non passano il controllo.
I testi devono suonare naturali per un madrelingua: niente frasi tradotte
parola per parola dall'italiano o dall'inglese. "verificato": false.
```

## P7. Prossima tappa

```
La tappa 3 di PIANO.md è completa e funziona sull'iPhone. Aggiorna la
sezione "Stato" di PIANO.md, poi rileggi la tappa 4 e dimmi se, dopo quello
che abbiamo costruito finora, va modificata. Niente codice finché non approvo.
```

Cambia i numeri delle tappe quando serve.

## P8. Revisione da esperto (a fine tappa)

```
Fai una revisione dell'intero progetto come la farebbe uno sviluppatore
esperto di web app per iPhone. Cerca in particolare: rischi di perdere i
progressi, problemi offline, cache che non si aggiorna, lentezza con i dati
dei livelli alti, errori di accessibilità, codice duplicato. Prima elencami
i problemi in ordine di gravità con una riga di spiegazione ciascuno, poi
chiedimi quali correggere.
```

## P9. Contenuti di grammatica (passo 4.3)

```
Prepara i contenuti dei punti di grammatica del livello 1, partendo dai
primi 10 punti di data/livello-1/grammatica.json. Per ogni punto, nel
formato di SPEC.md, sezione 5:
- titolo in italiano e schema della frase,
- spiegazione di massimo 5 righe per chi studia partendo dall'italiano, con il
  confronto con l'italiano quando aiuta (o quando inganna),
- l'errore tipico che fanno gli italiani con questo punto,
- 4 esempi con pinyin e traduzione, solo con parole del livello 1,
- 6 esercizi: 2 "completa", 2 "riordina", 1 "trova l'errore",
  1 "trasforma".
Fai controllare a uno script che esempi ed esercizi usino solo caratteri
del livello. Quando non sei sicuro di una regola, scrivilo nel campo
"attenzione". Tutto con "verificato": false. Fermati dopo 10 punti e
mostrami 2 schede complete da controllare prima di continuare.
```

Per verificare una spiegazione, confrontala con la Chinese Grammar Wiki di AllSet Learning (resources.allsetlearning.com), che ha l'elenco dei punti HSK con esempi.
