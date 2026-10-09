// Crea le icone provvisorie dell'app (PNG 180, 192, 512 px) nella cartella icons/.
// Uso: node tools/crea-icone.mjs
// Nessuna libreria esterna: il PNG viene scritto a mano con zlib di Node.
// Le icone non hanno trasparenza, altrimenti iOS mette uno sfondo nero.

import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const SFONDO = [185, 28, 28]; // rosso
const TESTO = [255, 255, 255]; // bianco

// Lettere "HSK" disegnate su una griglia 5×7 (1 = quadratino pieno).
const LETTERE = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
};

function disegna(lato) {
  const parola = 'HSK';
  const colonne = parola.length * 5 + (parola.length - 1); // 1 colonna vuota tra le lettere
  const cella = Math.floor((lato * 0.6) / colonne);
  const x0 = Math.floor((lato - colonne * cella) / 2);
  const y0 = Math.floor((lato - 7 * cella) / 2);

  // Ogni riga del PNG comincia con un byte di "filtro" (0 = nessuno), poi R, G, B per ogni pixel.
  const righe = Buffer.alloc(lato * (1 + lato * 3));
  for (let y = 0; y < lato; y++) {
    const inizio = y * (1 + lato * 3);
    righe[inizio] = 0;
    for (let x = 0; x < lato; x++) {
      const cx = Math.floor((x - x0) / cella);
      const cy = Math.floor((y - y0) / cella);
      let pieno = false;
      if (x >= x0 && y >= y0 && cx < colonne && cy < 7) {
        const lettera = Math.floor(cx / 6);
        const colonna = cx % 6;
        pieno = colonna < 5 && LETTERE[parola[lettera]][cy][colonna] === '1';
      }
      const colore = pieno ? TESTO : SFONDO;
      righe.set(colore, inizio + 1 + x * 3);
    }
  }
  return righe;
}

// Un "pezzo" del file PNG: lunghezza, tipo, dati, codice di controllo CRC.
function pezzo(tipo, dati) {
  const lunghezza = Buffer.alloc(4);
  lunghezza.writeUInt32BE(dati.length);
  const tipoEDati = Buffer.concat([Buffer.from(tipo, 'ascii'), dati]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(tipoEDati));
  return Buffer.concat([lunghezza, tipoEDati, crc]);
}

function png(lato) {
  const intestazione = Buffer.alloc(13);
  intestazione.writeUInt32BE(lato, 0); // larghezza
  intestazione.writeUInt32BE(lato, 4); // altezza
  intestazione[8] = 8; // 8 bit per canale
  intestazione[9] = 2; // colore RGB, senza trasparenza
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // firma del formato PNG
    pezzo('IHDR', intestazione),
    pezzo('IDAT', deflateSync(disegna(lato))),
    pezzo('IEND', Buffer.alloc(0)),
  ]);
}

const cartella = new URL('../icons/', import.meta.url);
mkdirSync(cartella, { recursive: true });
for (const lato of [180, 192, 512]) {
  writeFileSync(new URL(`icon-${lato}.png`, cartella), png(lato));
  console.log(`icons/icon-${lato}.png`);
}
