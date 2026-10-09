// Service worker: salva i file dell'app sul telefono e li usa anche offline.
// IMPORTANTE: a ogni modifica di un file dell'app aumenta VERSIONE,
// altrimenti l'iPhone continua a mostrare la versione vecchia.

const VERSIONE = 1;

// Tutte le cache dell'app hanno il prefisso "hsk-coach-": i siti GitHub Pages
// dello stesso account condividono il dominio, così non tocchiamo le cache degli altri.
// Le cache dei file dell'app iniziano con "hsk-coach-app-"; quelle dei dati
// dei livelli (passi successivi) avranno un nome diverso e non verranno cancellate qui.
const PREFISSO_APP = 'hsk-coach-app-';
const CACHE_APP = `${PREFISSO_APP}v${VERSIONE}`;

// File da salvare subito. Percorsi relativi: l'app vive in /hsk-coach/, non nella radice.
const FILE_APP = [
  './',
  './manifest.webmanifest',
  './css/style.css',
  './js/app.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_APP).then((cache) =>
      // cache: 'reload' scavalca la cache del browser: GitHub Pages fa tenere i file
      // 10 minuti e senza questo potremmo salvare file vecchi.
      cache.addAll(FILE_APP.map((url) => new Request(url, { cache: 'reload' })))
    )
  );
  // Provvisorio: la versione nuova si attiva subito.
  // Nel passo 0.3 sarà sostituito dall'avviso "Nuova versione: tocca per aggiornare".
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomi) =>
        Promise.all(
          nomi
            .filter((nome) => nome.startsWith(PREFISSO_APP) && nome !== CACHE_APP)
            .map((nome) => caches.delete(nome))
        )
      )
      // La pagina già aperta passa subito sotto il controllo di questo service worker
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const richiesta = evento.request;
  if (richiesta.method !== 'GET' || new URL(richiesta.url).origin !== self.location.origin) {
    return;
  }

  // Apertura di una pagina (anche con ?parametri): rispondiamo con la home salvata
  if (richiesta.mode === 'navigate') {
    evento.respondWith(
      caches.match('./', { ignoreSearch: true }).then((salvata) => salvata || fetch(richiesta))
    );
    return;
  }

  // Tutti gli altri file: prima la copia salvata, se manca la rete
  evento.respondWith(caches.match(richiesta).then((salvata) => salvata || fetch(richiesta)));
});

// La pagina chiede il numero di versione per mostrarlo
self.addEventListener('message', (evento) => {
  if (evento.data?.tipo === 'versione') {
    evento.source.postMessage({ tipo: 'versione', versione: VERSIONE });
  }
});
