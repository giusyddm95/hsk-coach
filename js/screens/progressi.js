// Schermata "Progressi": statistiche e calendario delle sessioni (tappa 9).

export const titolo = 'Progressi';

export function mostra(contenitore) {
  contenitore.innerHTML = `
    <h1 tabindex="-1">Progressi</h1>
    <p class="nota">Qui vedrai quante parole hai imparato, le risposte giuste degli ultimi 30 giorni e i giorni di studio consecutivi.</p>
  `;
}
