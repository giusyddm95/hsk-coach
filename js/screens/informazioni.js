// Schermata "Informazioni": versione, controllo aggiornamenti, fonti dei dati e licenze.

import { leggiVersione, controllaAggiornamenti } from '../aggiornamenti.js';

export const titolo = 'Informazioni';

// Fonti elencate in SPEC.md, sezione 4
const FONTI = [
  {
    nome: 'HSK 3.0 (krmanik)',
    indirizzo: 'https://github.com/krmanik/HSK-3.0',
    uso: 'Parole, caratteri e punti di grammatica per livello, dal sillabo HSK 2025 (trascrizione non ufficiale).',
    licenza: 'CC BY-SA 4.0',
  },
  {
    nome: 'Complete HSK Vocabulary (drkameleon)',
    indirizzo: 'https://github.com/drkameleon/complete-hsk-vocabulary',
    uso: 'Pinyin, significati in inglese, classificatori e frequenza delle parole.',
    licenza: 'MIT; i significati vengono da CC-CEDICT (CC BY-SA 4.0)',
  },
  {
    nome: 'CC-CEDICT',
    indirizzo: 'https://www.mdbg.net/chinese/dictionary?page=cc-cedict',
    uso: 'Dizionario di riserva per le parole mancanti.',
    licenza: 'CC BY-SA 4.0',
  },
  {
    nome: 'Tatoeba',
    indirizzo: 'https://tatoeba.org',
    uso: 'Frasi reali in cinese con traduzione in italiano o inglese.',
    licenza: 'CC BY 2.0 FR',
  },
  {
    nome: 'Hanzi Writer',
    indirizzo: 'https://hanziwriter.org',
    uso: 'Animazione dell\'ordine dei tratti e quiz di scrittura.',
    licenza: 'MIT; dati dei caratteri (hanzi-writer-data) con Arphic Public License',
  },
  {
    nome: 'ts-fsrs',
    indirizzo: 'https://github.com/open-spaced-repetition/ts-fsrs',
    uso: 'Algoritmo FSRS per la ripetizione dilazionata.',
    licenza: 'MIT',
  },
];

export function mostra(contenitore) {
  const elencoFonti = FONTI.map(
    (fonte) => `
      <li>
        <a href="${fonte.indirizzo}" target="_blank" rel="noopener">${fonte.nome}</a>
        <span>${fonte.uso}</span>
        <span class="licenza">Licenza: ${fonte.licenza}</span>
      </li>`
  ).join('');

  contenitore.innerHTML = `
    <a class="indietro" href="#impostazioni">‹ Impostazioni</a>
    <h1 tabindex="-1">Informazioni</h1>

    <section>
      <h2>L'app</h2>
      <p>HSK Coach è un'app personale per studiare il cinese, dall'HSK 1 all'HSK 7-9. Non ha account, non usa server e non invia dati a nessuno: tutto resta su questo telefono.</p>
      <p id="info-versione">Versione: in caricamento…</p>
      <button type="button" class="pulsante-testo" id="info-controlla">Controlla aggiornamenti</button>
      <p class="stato" id="info-stato" aria-live="polite"></p>
    </section>

    <section>
      <h2>Fonti dei dati e licenze</h2>
      <p class="nota">Per ora l'app non contiene ancora dati da queste fonti: arriveranno dalla tappa 1.</p>
      <ul class="fonti">${elencoFonti}</ul>
    </section>
  `;

  const campoVersione = contenitore.querySelector('#info-versione');
  const campoStato = contenitore.querySelector('#info-stato');
  const pulsante = contenitore.querySelector('#info-controlla');

  if (!('serviceWorker' in navigator)) {
    campoVersione.textContent = 'Versione: non disponibile (service worker non supportato qui)';
    pulsante.hidden = true;
    return;
  }

  leggiVersione().then((versione) => {
    campoVersione.textContent = versione ? `Versione ${versione}` : 'Versione: non disponibile';
  });

  pulsante.addEventListener('click', async () => {
    campoStato.textContent = 'Controllo in corso…';
    campoStato.textContent = await controllaAggiornamenti();
  });
}
