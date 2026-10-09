// Avvio dell'app e navigazione tra le schermate.
// Ogni schermata ha il suo indirizzo dopo il # (per esempio #dizionario):
// funziona anche offline, perché la parte dopo il # non va mai in rete.

import { avviaAggiornamenti } from './aggiornamenti.js';
import * as oggi from './screens/oggi.js';
import * as studia from './screens/studia.js';
import * as dizionario from './screens/dizionario.js';
import * as progressi from './screens/progressi.js';
import * as impostazioni from './screens/impostazioni.js';
import * as informazioni from './screens/informazioni.js';

const SCHERMATE = { oggi, studia, dizionario, progressi, impostazioni, informazioni };

// Informazioni non ha una voce sua nella barra: si apre da Impostazioni
const VOCE_DELLA_BARRA = { informazioni: 'impostazioni' };

const contenitore = document.getElementById('schermata');

function mostraSchermata({ spostaFocus }) {
  const richiesta = location.hash.slice(1);
  const nome = richiesta in SCHERMATE ? richiesta : 'oggi';
  const schermata = SCHERMATE[nome];

  contenitore.replaceChildren();
  schermata.mostra(contenitore);
  document.title = `${schermata.titolo} · HSK Coach`;

  const voceAttiva = VOCE_DELLA_BARRA[nome] ?? nome;
  for (const voce of document.querySelectorAll('.barra a')) {
    if (voce.dataset.schermata === voceAttiva) {
      voce.setAttribute('aria-current', 'page');
    } else {
      voce.removeAttribute('aria-current');
    }
  }

  window.scrollTo(0, 0);
  // Chi usa VoiceOver sente subito il titolo della schermata nuova
  if (spostaFocus) contenitore.querySelector('h1')?.focus();
}

window.addEventListener('hashchange', () => mostraSchermata({ spostaFocus: true }));
mostraSchermata({ spostaFocus: false });
avviaAggiornamenti();
