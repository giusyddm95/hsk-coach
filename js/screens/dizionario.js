// Schermata "Dizionario": elenco delle parole del livello con ricerca (passo 3.7).

export const titolo = 'Dizionario';

export function mostra(contenitore) {
  contenitore.innerHTML = `
    <h1 tabindex="-1">Dizionario</h1>
    <p class="nota">Qui arriverà l'elenco delle parole del tuo livello, con la ricerca per carattere, pinyin o significato.</p>
  `;
}
