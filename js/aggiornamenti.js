// Service worker e aggiornamenti: registrazione, numero di versione,
// controllo delle versioni nuove e avviso "Nuova versione disponibile".

const avviso = document.getElementById('avviso-aggiornamento');
const pulsanteAggiorna = document.getElementById('aggiorna');

let registrazione = null;

// Diventa vero solo quando tocco "Aggiorna": la pagina si ricarica solo in quel caso
let aggiornamentoRichiesto = false;

export async function avviaAggiornamenti() {
  if (!('serviceWorker' in navigator)) return;

  try {
    // updateViaCache: 'none' = per cercare aggiornamenti sw.js si scarica sempre dalla rete
    registrazione = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
  } catch (errore) {
    console.error('Service worker non registrato:', errore);
    return;
  }

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
    if (document.visibilityState === 'visible') controllaAggiornamenti();
  });
}

// Chiede al service worker il numero di versione. Restituisce null se non risponde.
export async function leggiVersione() {
  if (!('serviceWorker' in navigator)) return null;
  const pronta = await navigator.serviceWorker.ready;
  return new Promise((risolvi) => {
    // Un canale privato per la risposta, così non si confonde con altri messaggi
    const canale = new MessageChannel();
    canale.port1.onmessage = (evento) => risolvi(evento.data.versione);
    pronta.active.postMessage({ tipo: 'versione' }, [canale.port2]);
    setTimeout(() => risolvi(null), 3000);
  });
}

// Restituisce una frase da mostrare con l'esito del controllo
export async function controllaAggiornamenti() {
  if (!registrazione) return 'Il controllo degli aggiornamenti non è disponibile qui.';
  try {
    await registrazione.update();
  } catch {
    return 'Non riesco a controllare: forse sei offline. Riprova con la rete.';
  }
  if (registrazione.waiting) mostraAvviso(registrazione.waiting);
  return registrazione.installing || registrazione.waiting
    ? 'Ho trovato una versione nuova.'
    : 'Hai già l\'ultima versione.';
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
