// Schermata "Oggi": qui arriverà la sessione di oggi (tappa 3).

export const titolo = 'Oggi';

export function mostra(contenitore) {
  contenitore.innerHTML = `
    <h1 tabindex="-1">Oggi</h1>
    <p class="nota">Qui arriverà la sessione di oggi: ripasso, parole nuove e, più avanti, grammatica, ascolto e lettura.</p>
  `;
}
