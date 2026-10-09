// Avvio dell'app: registra il service worker e mostra il numero di versione.

const campoVersione = document.getElementById('versione');

if ('serviceWorker' in navigator) {
  // Il numero di versione sta solo in sw.js: lo chiediamo al service worker,
  // così non c'è un secondo numero da aggiornare a mano.
  navigator.serviceWorker.onmessage = (evento) => {
    if (evento.data?.tipo === 'versione') {
      campoVersione.textContent = `Versione ${evento.data.versione}`;
    }
  };

  navigator.serviceWorker
    .register('./sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then((registrazione) => registrazione.active.postMessage({ tipo: 'versione' }))
    .catch((errore) => {
      console.error('Service worker non registrato:', errore);
      campoVersione.textContent = 'Versione: non disponibile (service worker non attivo)';
    });
} else {
  // Succede per esempio aprendo l'app da http:// non sicuro
  campoVersione.textContent = 'Versione: non disponibile (service worker non supportato qui)';
}
