// Schermata "Diagnostica" (nascosta, si apre da Informazioni).
// Mostra cosa funziona davvero su questo telefono: serve a decidere come costruire
// audio, microfono e archiviazione nelle tappe successive. Non salva niente.

import { leggiVersione } from '../aggiornamenti.js';

export const titolo = 'Diagnostica';

// Risultati raccolti, per il pulsante "Copia i risultati"
let risultati = {};
let contenitoreAttuale = null;
let vociCinesi = [];
let ultimaRegistrazione = null;

export function mostra(contenitore) {
  risultati = {};
  contenitoreAttuale = contenitore;

  contenitore.innerHTML = `
    <a class="indietro" href="#informazioni">‹ Informazioni</a>
    <h1 tabindex="-1">Diagnostica</h1>
    <p class="nota">Cosa funziona su questo telefono. Aprila dall'app installata sulla Home, non da una scheda di Safari.</p>

    <section>
      <h2>Sistema</h2>
      <dl class="dati">
        <dt>Versione dichiarata dal browser</dt><dd data-chiave="sistema">…</dd>
        <dt>Aperta come</dt><dd data-chiave="modalita">…</dd>
        <dt>Schermo</dt><dd data-chiave="schermo">…</dd>
        <dt>Versione dell'app</dt><dd data-chiave="versioneApp">…</dd>
      </dl>
    </section>

    <section>
      <h2>Archiviazione</h2>
      <dl class="dati">
        <dt>Database (IndexedDB)</dt><dd data-chiave="database">…</dd>
        <dt>Archiviazione persistente</dt><dd data-chiave="persistente">…</dd>
        <dt>Spazio usato e disponibile</dt><dd data-chiave="spazio">…</dd>
      </dl>
      <button type="button" class="pulsante" id="diag-persistente">Chiedi di non cancellare i dati</button>
    </section>

    <section>
      <h2>Voce (sintesi vocale)</h2>
      <dl class="dati">
        <dt>Sintesi vocale</dt><dd data-chiave="sintesi">…</dd>
        <dt>Voci cinesi</dt><dd data-chiave="voci">…</dd>
        <dt>Prova di lettura</dt><dd data-chiave="lettura">non ancora provata</dd>
      </dl>
      <button type="button" class="pulsante" id="diag-ascolta">Ascolta</button>
      <p class="nota">La voce dovrebbe contare da 1 a 5 in cinese. Prova con l'interruttore silenzioso sia spento sia acceso.</p>
    </section>

    <section>
      <h2>Microfono</h2>
      <dl class="dati">
        <dt>Registrazione</dt><dd data-chiave="registrazione">…</dd>
        <dt>Formati audio</dt><dd data-chiave="formati">…</dd>
        <dt>Prova</dt><dd data-chiave="provaMicrofono">non ancora provata</dd>
      </dl>
      <button type="button" class="pulsante" id="diag-registra">Registra 3 secondi</button>
      <audio id="diag-audio" controls hidden></audio>
      <p class="nota">La registrazione non viene salvata. Dopo averla riascoltata, tocca di nuovo "Ascolta" qui sopra: il volume della voce deve essere normale.</p>
    </section>

    <section>
      <h2>Riconoscimento vocale</h2>
      <dl class="dati">
        <dt>Disponibile</dt><dd data-chiave="riconoscimento">…</dd>
        <dt>Prova</dt><dd data-chiave="provaRiconoscimento">non ancora provata</dd>
      </dl>
      <button type="button" class="pulsante" id="diag-riconosci">Prova riconoscimento</button>
      <p class="nota">Dopo il tocco conta da 1 a 5 in cinese. Attenzione: usa la dettatura di Siri, quindi l'audio viene inviato ad Apple e serve la rete.</p>
    </section>

    <section>
      <h2>Invia i risultati</h2>
      <button type="button" class="pulsante" id="diag-copia">Copia i risultati</button>
      <p class="stato" id="diag-copia-esito" aria-live="polite"></p>
      <textarea id="diag-testo" class="testo-risultati" rows="8" readonly hidden aria-label="Risultati da copiare"></textarea>
      <p class="nota piccolo" data-chiave="browser"></p>
    </section>
  `;

  controllaSistema();
  controllaArchiviazione();
  controllaVoce();
  controllaMicrofono();
  controllaRiconoscimento();

  contenitore.querySelector('#diag-persistente').addEventListener('click', chiediPersistenza);
  contenitore.querySelector('#diag-ascolta').addEventListener('click', ascolta);
  contenitore.querySelector('#diag-registra').addEventListener('click', registra);
  contenitore.querySelector('#diag-riconosci').addEventListener('click', riconosci);
  contenitore.querySelector('#diag-copia').addEventListener('click', copiaRisultati);
}

// Scrive un risultato nella pagina e lo ricorda per "Copia i risultati"
function scrivi(chiave, valore) {
  risultati[chiave] = valore;
  const campo = contenitoreAttuale?.querySelector(`[data-chiave="${chiave}"]`);
  if (campo) campo.textContent = valore;
}

// Sotto il megabyte mostro i KB, altrimenti uno spazio piccolo sembrerebbe "0.0 MB"
function dimensione(byte) {
  const megabyte = byte / 1024 / 1024;
  return megabyte < 1 ? `${Math.round(byte / 1024)} KB` : `${megabyte.toFixed(1)} MB`;
}

// ---------- Sistema ----------

function controllaSistema() {
  const ua = navigator.userAgent;
  // Da iOS 26 Safari potrebbe dichiarare una versione di iOS "congelata":
  // per questo mostro anche la versione di Safari, quando c'è (da verificare).
  const ios = ua.match(/OS (\d+)_(\d+)/);
  const safari = ua.match(/Version\/([\d.]+)/);
  scrivi(
    'sistema',
    `iOS ${ios ? `${ios[1]}.${ios[2]}` : 'non indicato'}` +
      (safari ? `, Safari ${safari[1]}` : ', Safari non indicato')
  );

  const installata =
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  scrivi('modalita', installata ? 'app installata sulla Home' : 'scheda del browser');
  scrivi('schermo', `${innerWidth} × ${innerHeight} punti, densità ${devicePixelRatio}`);
  scrivi('browser', `Browser: ${ua}`);

  leggiVersione().then((versione) => scrivi('versioneApp', versione ? `${versione}` : 'non disponibile'));
}

// ---------- Archiviazione ----------

async function controllaArchiviazione() {
  scrivi('database', await provaDatabase());

  if (!navigator.storage?.persisted) {
    scrivi('persistente', 'non supportata qui');
  } else {
    scrivi('persistente', descriviPersistenza(await navigator.storage.persisted()));
  }

  if (navigator.storage?.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    scrivi('spazio', `${dimensione(usage)} usati su ${dimensione(quota)} disponibili`);
  } else {
    scrivi('spazio', 'non indicato');
  }
}

function descriviPersistenza(concessa) {
  return concessa ? 'sì: iOS non cancella i dati da solo' : 'no: se manca spazio, iOS potrebbe cancellare i dati';
}

// Apre un database di prova, scrive un valore e poi lo cancella
function provaDatabase() {
  if (!('indexedDB' in window)) return Promise.resolve('non disponibile');
  return new Promise((risolvi) => {
    const nome = 'hsk-coach-diagnostica';
    const richiesta = indexedDB.open(nome, 1);
    richiesta.onupgradeneeded = () => richiesta.result.createObjectStore('prova');
    richiesta.onerror = () => risolvi(`errore in apertura: ${richiesta.error?.name}`);
    richiesta.onsuccess = () => {
      const db = richiesta.result;
      const transazione = db.transaction('prova', 'readwrite');
      transazione.objectStore('prova').put('ok', 'chiave');
      transazione.oncomplete = () => {
        db.close();
        indexedDB.deleteDatabase(nome);
        risolvi('funziona (scrittura di prova riuscita e cancellata)');
      };
      transazione.onerror = () => {
        db.close();
        risolvi(`errore in scrittura: ${transazione.error?.name}`);
      };
    };
    setTimeout(() => risolvi('nessuna risposta dopo 3 secondi'), 3000);
  });
}

async function chiediPersistenza() {
  if (!navigator.storage?.persist) {
    scrivi('persistente', 'non supportata qui');
    return;
  }
  scrivi('persistente', descriviPersistenza(await navigator.storage.persist()));
}

// ---------- Voce ----------

// Su iPhone le voci a volte arrivano qualche istante dopo l'apertura
function caricaVoci() {
  return new Promise((risolvi) => {
    const voci = speechSynthesis.getVoices();
    if (voci.length) {
      risolvi(voci);
      return;
    }
    speechSynthesis.addEventListener('voiceschanged', () => risolvi(speechSynthesis.getVoices()), {
      once: true,
    });
    setTimeout(() => risolvi(speechSynthesis.getVoices()), 2000);
  });
}

// Alcuni sistemi scrivono "zh_CN" invece di "zh-CN"
function lingua(voce) {
  return voce.lang.replace('_', '-');
}

async function controllaVoce() {
  if (!('speechSynthesis' in window)) {
    scrivi('sintesi', 'non disponibile');
    scrivi('voci', '—');
    return;
  }
  scrivi('sintesi', 'disponibile');
  const voci = await caricaVoci();
  vociCinesi = voci.filter((voce) => lingua(voce).startsWith('zh'));
  const continentali = vociCinesi.filter((voce) => lingua(voce) === 'zh-CN');
  if (continentali.length === 0) {
    scrivi(
      'voci',
      `nessuna voce zh-CN (in tutto ${voci.length} voci). Va scaricata da Impostazioni > Accessibilità > Contenuto letto > Voci > Cinese.`
    );
    return;
  }
  const elenco = vociCinesi.map((voce) => `${voce.name} (${lingua(voce)})`).join(', ');
  scrivi('voci', `${continentali.length} voci zh-CN. Tutte le voci cinesi: ${elenco}`);
}

function ascolta() {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  // Numeri invece di una frase: la voce cinese li legge in cinese,
  // e così non scrivo testo cinese dentro il codice
  const lettura = new SpeechSynthesisUtterance('1, 2, 3, 4, 5');
  lettura.lang = 'zh-CN';
  const voce = vociCinesi.find((v) => lingua(v) === 'zh-CN');
  if (voce) lettura.voice = voce;
  lettura.rate = 0.9;
  lettura.onstart = () => scrivi('lettura', 'lettura iniziata…');
  lettura.onend = () => scrivi('lettura', `lettura finita (voce: ${voce?.name ?? 'predefinita'}). L'hai sentita?`);
  lettura.onerror = (evento) => scrivi('lettura', `errore: ${evento.error}`);
  speechSynthesis.speak(lettura);
}

// ---------- Microfono ----------

const FORMATI_DA_PROVARE = ['audio/mp4', 'audio/aac', 'audio/webm;codecs=opus', 'audio/webm'];

function controllaMicrofono() {
  const disponibile = Boolean(navigator.mediaDevices?.getUserMedia) && 'MediaRecorder' in window;
  scrivi('registrazione', disponibile ? 'disponibile' : 'non disponibile');
  if (!disponibile) {
    scrivi('formati', '—');
    return;
  }
  const supportati = FORMATI_DA_PROVARE.filter((formato) => MediaRecorder.isTypeSupported(formato));
  scrivi('formati', supportati.length ? supportati.join(', ') : 'nessuno di quelli provati');
}

async function registra() {
  if (!navigator.mediaDevices?.getUserMedia || !('MediaRecorder' in window)) return;
  const pulsante = contenitoreAttuale.querySelector('#diag-registra');
  const lettore = contenitoreAttuale.querySelector('#diag-audio');

  let flusso;
  try {
    flusso = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (errore) {
    scrivi('provaMicrofono', `permesso negato o errore: ${errore.name}`);
    return;
  }

  const registratore = new MediaRecorder(flusso);
  const pezzi = [];
  registratore.ondataavailable = (evento) => {
    if (evento.data.size) pezzi.push(evento.data);
  };
  registratore.onstop = () => {
    // Chiudo subito il microfono: su iOS, finché resta aperto, l'audio può uscire più basso
    flusso.getTracks().forEach((traccia) => traccia.stop());
    const audio = new Blob(pezzi, { type: registratore.mimeType });
    if (ultimaRegistrazione) URL.revokeObjectURL(ultimaRegistrazione);
    ultimaRegistrazione = URL.createObjectURL(audio);
    lettore.src = ultimaRegistrazione;
    lettore.hidden = false;
    pulsante.disabled = false;
    scrivi(
      'provaMicrofono',
      `funziona: ${Math.round(audio.size / 1024)} KB, formato ${registratore.mimeType || 'non indicato'}. Riascoltala qui sotto.`
    );
  };

  pulsante.disabled = true;
  registratore.start();
  scrivi('provaMicrofono', 'sto registrando… parla adesso');
  setTimeout(() => registratore.stop(), 3000);
}

// ---------- Riconoscimento vocale ----------

function controllaRiconoscimento() {
  const presente = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  scrivi('riconoscimento', presente ? 'presente (va provato)' : 'non disponibile');
  if (!presente) contenitoreAttuale.querySelector('#diag-riconosci').disabled = true;
}

function riconosci() {
  const Riconoscitore = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Riconoscitore) return;
  const riconoscitore = new Riconoscitore();
  riconoscitore.lang = 'zh-CN';
  riconoscitore.interimResults = false;
  riconoscitore.maxAlternatives = 1;

  let capito = false;
  riconoscitore.onstart = () => scrivi('provaRiconoscimento', 'in ascolto… parla adesso');
  riconoscitore.onresult = (evento) => {
    capito = true;
    scrivi('provaRiconoscimento', `ho capito: "${evento.results[0][0].transcript}"`);
  };
  riconoscitore.onerror = (evento) => scrivi('provaRiconoscimento', `errore: ${evento.error}`);
  riconoscitore.onend = () => {
    if (!capito && !risultati.provaRiconoscimento?.startsWith('errore')) {
      scrivi('provaRiconoscimento', 'finito senza capire niente');
    }
  };

  try {
    riconoscitore.start();
  } catch (errore) {
    scrivi('provaRiconoscimento', `non si avvia: ${errore.name}`);
  }
}

// ---------- Copia ----------

async function copiaRisultati() {
  const esito = contenitoreAttuale.querySelector('#diag-copia-esito');
  const testo = ['Diagnostica HSK Coach', ...Object.entries(risultati).map(([chiave, valore]) => `${chiave}: ${valore}`)].join('\n');
  try {
    await navigator.clipboard.writeText(testo);
    esito.textContent = 'Copiato. Incollalo nella chat con Claude.';
  } catch {
    // Riserva: mostro il testo già selezionato, da copiare a mano
    const riquadro = contenitoreAttuale.querySelector('#diag-testo');
    riquadro.value = testo;
    riquadro.hidden = false;
    riquadro.focus();
    riquadro.select();
    esito.textContent = 'Non riesco a copiare da solo: tieni premuto sul testo qui sotto, scegli "Seleziona tutto" e poi "Copia".';
  }
}
