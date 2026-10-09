// Avvio dell'app: registra il service worker, mostra la versione
// e avvisa quando è pronta una versione nuova.

const campoVersione = document.getElementById('versione');
const pulsanteControlla = document.getElementById('controlla-aggiornamenti');
const statoAggiornamento = document.getElementById('stato-aggiornamento');
const avviso = document.getElementById('avviso-aggiornamento');
const pulsanteAggiorna = document.getElementById('aggiorna');

// Diventa vero solo quando tocco "Aggiorna": la pagina si ricarica solo in quel caso
let aggiornamentoRichiesto = false;

if ('serviceWorker' in navigator) {
  avviaServiceWorker();
} else {
  // Succede per esempio aprendo l'app da http:// non sicuro
  campoVersione.textContent = 'Versione: non disponibile (service worker non supportato qui)';
  pulsanteControlla.hidden = true;
}

async function avviaServiceWorker() {
  // Il numero di versione sta solo in sw.js: lo chiediamo al service worker,
  // così non c'è un secondo numero da aggiornare a mano.
  navigator.serviceWorker.onmessage = (evento) => {
    if (evento.data?.tipo === 'versione') {
      campoVersione.textContent = `Versione ${evento.data.versione}`;
    }
  };

  let registrazione;
  try {
    // updateViaCache: 'none' = per cercare aggiornamenti sw.js si scarica sempre dalla rete
    registrazione = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
  } catch (errore) {
    console.error('Service worker non registrato:', errore);
    campoVersione.textContent = 'Versione: non disponibile (service worker non attivo)';
    pulsanteControlla.hidden = true;
    return;
  }

  const pronta = await navigator.serviceWorker.ready;
  pronta.active.postMessage({ tipo: 'versione' });

  // Una versione nuova potrebbe essere già scaricata e in attesa
  if (registrazione.waiting && navigator.serviceWorker.controller) {
    mostraAvviso(registrazione.waiting);
  }
  registrazione.addEventListener('updatefound', () => seguiInstallazione(registrazione.installing));

  // Il nuovo service worker ha preso il controllo dopo il tocco su "Aggiorna": ricarico una volta
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!aggiornamentoRichiesto) return;
    aggiornamentoRichiesto = false;
    location.reload();
  });

  // iOS spesso "risveglia" l'app dalla memoria senza ricaricarla:
  // controllo gli aggiornamenti ogni volta che torna in primo piano
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') controlla(registrazione, false);
  });

  pulsanteControlla.addEventListener('click', () => controlla(registrazione, true));
}

function seguiInstallazione(nuovo) {
  if (!nuovo) return;
  nuovo.addEventListener('statechange', () => {
    // "installed" con un service worker già al comando = aggiornamento pronto
    // (alla prima installazione in assoluto non c'è niente da aggiornare)
    if (nuovo.state === 'installed' && navigator.serviceWorker.controller) {
      mostraAvviso(nuovo);
    }
  });
}

// conMessaggi: true quando il controllo l'ho chiesto io con il pulsante
async function controlla(registrazione, conMessaggi) {
  if (conMessaggi) statoAggiornamento.textContent = 'Controllo in corso…';
  try {
    await registrazione.update();
  } catch {
    if (conMessaggi) {
      statoAggiornamento.textContent = 'Non riesco a controllare: forse sei offline. Riprova con la rete.';
    }
    return;
  }
  if (registrazione.waiting) mostraAvviso(registrazione.waiting);
  if (!conMessaggi) return;
  statoAggiornamento.textContent =
    registrazione.installing || registrazione.waiting
      ? 'Ho trovato una versione nuova.'
      : 'Hai già l\'ultima versione.';
}

function mostraAvviso(nuovo) {
  avviso.hidden = false;
  document.body.classList.add('con-avviso');
  pulsanteAggiorna.disabled = false;
  pulsanteAggiorna.onclick = () => {
    aggiornamentoRichiesto = true;
    pulsanteAggiorna.disabled = true;
    nuovo.postMessage({ tipo: 'attiva' });
  };
}
