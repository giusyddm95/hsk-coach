// Schermata "Studia": allenamento di una singola abilità.

export const titolo = 'Studia';

export function mostra(contenitore) {
  contenitore.innerHTML = `
    <h1 tabindex="-1">Studia</h1>
    <p class="nota">Qui potrai allenare una sola abilità alla volta: lessico, grammatica, ascolto, scrittura, lettura.</p>
  `;
}
