// Schermata "Impostazioni": per ora contiene solo il collegamento a Informazioni.
// Le impostazioni vere arrivano nel passo 3.2.

export const titolo = 'Impostazioni';

export function mostra(contenitore) {
  contenitore.innerHTML = `
    <h1 tabindex="-1">Impostazioni</h1>
    <p class="nota">Qui arriveranno livello, parole nuove al giorno, pinyin a colori, velocità della voce e backup.</p>
    <nav class="elenco" aria-label="Altre pagine">
      <a class="riga" href="#informazioni">
        <span>Informazioni</span>
        <span class="freccia" aria-hidden="true">›</span>
      </a>
    </nav>
  `;
}
