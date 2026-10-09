// Astra's original Data Dealer Chip artwork, ported by OpenAI Codex (GPT-6), 2026-10-08.
// Only the owner-authorized drawing function and launcher appearance are reproduced here.
// Original: Data Dealer dashboard drawPet, source commit 0be8aab.
// The 32x24 LCD pixels are retained exactly. The original animation clock is an input so builds are deterministic.
import { MOODS } from './sheet-to-sprites.mjs';
import { drawText, textWidth } from './label-font.mjs';

export const CHIP_COLOURS = {
  neon: '#d9e25a', shellInk: '#0a0b05', lcd: '#c3d39b', ink: '#1f2b0e', mid: '#7d8f55',
};

/** Execute the original 32x24 canvas drawing with a tiny in-memory canvas adapter. */
export function originalChipPixels(face = 'happy', { bob = 0, blink = false, time = 1200 } = {}) {
  const pixels = new Array(32 * 24).fill(null);
  const c = {
    fillStyle: CHIP_COLOURS.lcd,
    fillRect(x, y, w, h) {
      for (let yy = Math.max(0, y); yy < Math.min(24, y + h); yy++) {
        for (let xx = Math.max(0, x); xx < Math.min(32, x + w); xx++) pixels[yy * 32 + xx] = this.fillStyle;
      }
    },
  };
  const cv = { getContext: () => c };

  function drawPet(cv,face,bob,blink){
    const c=cv.getContext('2d'), BG='#c3d39b', INK='#1f2b0e', MID='#7d8f55';
    c.fillStyle=BG;c.fillRect(0,0,32,24);
    const p=(x,y,col=INK,fixed)=>{c.fillStyle=col;c.fillRect(x,y+(fixed?0:bob),1,1)};
    // a microchip: package outline, side pins, orientation notch, pin-1 dot
    for(let x=9;x<=22;x++){p(x,4);p(x,16)}
    for(let y=4;y<=16;y++){p(9,y);p(22,y)}
    [6,9,12,15].forEach(y=>{p(7,y);p(8,y);p(23,y);p(24,y)});
    p(15,4,BG);p(16,4,BG);p(15,5);p(16,5);p(11,6,MID);
    [12,19].forEach(x=>{for(let y=17+bob;y<=19;y++)p(x,y,INK,true);p(x-1,20,INK,true);p(x,20,INK,true);p(x+1,20,INK,true)});
    const eyesOpen=()=>{p(13,9);p(13,10);p(18,9);p(18,10)};
    const eyesShut=()=>{p(12,10);p(13,10);p(18,10);p(19,10)};
    if(face==='sleep'){eyesShut();p(15,13);p(16,13);[[25,1],[26,1],[27,1],[26,2],[25,3],[26,3],[27,3]].forEach(([x,y])=>p(x,y,INK,true));return}
    if(face==='think'){p(14,8);p(14,9);p(19,8);p(19,9);p(14,13);p(15,13);p(16,13);p(17,13);[[25,2],[27,2],[29,2]].forEach(([x,y],i)=>{if((time/400|0)%4>i)p(x,y,INK,true)});return}
    blink?eyesShut():eyesOpen();
    if(face==='happy'){p(13,12);p(14,13);p(15,13);p(16,13);p(17,13);p(18,12);p(11,12,MID);p(20,12,MID)}
    else if(face==='hungry'){[[14,12],[15,12],[16,12],[17,12],[14,13],[17,13],[14,14],[15,14],[16,14],[17,14]].forEach(([x,y])=>p(x,y))}
    else if(face==='worried'){p(13,14);p(14,13);p(15,13);p(16,13);p(17,13);p(18,14);p(26,5,MID);p(26,6,MID)}
  }
  drawPet(cv, face, bob, blink);
  return pixels;
}

export const CHIP_MOODS = {
  idle: { face: 'happy', bob: 0 },
  blink: { face: 'happy', bob: 0, blink: true },
  happy: { face: 'happy', bob: -1 },
  curious: { face: 'think', bob: 0 },
  worried: { face: 'worried', bob: 0 },
  sad: { face: 'worried', bob: 0 },
  sick: { face: 'hungry', bob: 0 },
  alarmed: { face: 'hungry', bob: -1 },
  sleep: { face: 'sleep', bob: 0 },
};

export function chipLayout(size = 256) {
  const scale = Math.floor(size / 128);
  if (scale < 1) throw new Error('Original Chip requires a frame at least 128px square');
  const x = Math.floor((size - 76 * scale) / 2);
  // Reserve headroom above the antenna for the Cage's shared mood badges.
  const y = Math.floor((size - 106 * scale) / 2) + 20 * scale;
  const screenX = x + 12 * scale, screenY = y + 19 * scale;
  return { scale, x, y, screenX, screenY, lcdX: screenX + 10 * scale, lcdY: screenY + Math.floor(7.5 * scale) };
}

/** A deterministic pixel rendering of the original yellow pocket-launcher shell. */
export function chipOriginalSprite({ size = 256 } = {}) {
  const layout = chipLayout(size), s = layout.scale;
  const { x, y, screenX, screenY, lcdX, lcdY } = layout;
  const frames = {};
  for (const mood of MOODS) {
    const rgba = Buffer.alloc(size * size * 4);
    const pixel = (xx, yy, colour) => {
      if (xx < 0 || yy < 0 || xx >= size || yy >= size) return;
      const at = (yy * size + xx) * 4;
      rgba.set([1, 3, 5].map((n) => parseInt(colour.slice(n, n + 2), 16)), at);
      rgba[at + 3] = 255;
    };
    const rounded = (left, top, width, height, topRadius, bottomRadius, colour) => {
      for (let yy = top; yy < top + height; yy++) for (let xx = left; xx < left + width; xx++) {
        const r = yy < top + height / 2 ? topRadius : bottomRadius;
        const nx = Math.max(left + r, Math.min(xx + 0.5, left + width - r));
        const ny = Math.max(top + r, Math.min(yy + 0.5, top + height - r));
        if ((xx + 0.5 - nx) ** 2 + (yy + 0.5 - ny) ** 2 <= r ** 2) pixel(xx, yy, colour);
      }
    };
    // Original launcher: 76x92, radius 24 top / 28 bottom, 3px border and neon rim.
    rounded(x - 3 * s, y - 3 * s, 82 * s, 98 * s, 27 * s, 31 * s, CHIP_COLOURS.neon);
    rounded(x + 14 * s, y - 14 * s, 14 * s, 17 * s, 5 * s, 0, CHIP_COLOURS.shellInk);
    rounded(x + 17 * s, y - 11 * s, 8 * s, 14 * s, 2 * s, 0, CHIP_COLOURS.neon);
    rounded(x, y, 76 * s, 92 * s, 24 * s, 28 * s, CHIP_COLOURS.shellInk);
    rounded(x + 3 * s, y + 3 * s, 70 * s, 86 * s, 21 * s, 25 * s, CHIP_COLOURS.neon);
    rounded(screenX, screenY, 52 * s, 39 * s, 9 * s, 9 * s, CHIP_COLOURS.shellInk);
    rounded(screenX + 3 * s, screenY + 3 * s, 46 * s, 33 * s, 6 * s, 6 * s, CHIP_COLOURS.lcd);
    const state = CHIP_MOODS[mood];
    const original = originalChipPixels(state.face, state);
    for (let cy = 0; cy < 24; cy++) for (let cx = 0; cx < 32; cx++) {
      for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) pixel(lcdX + cx * s + dx, lcdY + cy * s + dy, original[cy * 32 + cx]);
    }
    drawText(rgba, size, 'CHIP', Math.floor((size - textWidth('CHIP', s)) / 2), screenY + 45 * s, CHIP_COLOURS.shellInk, s);
    const pal = {}, keys = new Map(), alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const rows = Array.from({ length: size }, (_, yy) => Array.from({ length: size }, (_, xx) => {
      const at = (yy * size + xx) * 4;
      if (!rgba[at + 3]) return '.';
      const colour = '#' + [...rgba.subarray(at, at + 3)].map((v) => v.toString(16).padStart(2, '0')).join('');
      if (!keys.has(colour)) { const key = alphabet[keys.size]; keys.set(colour, key); pal[key] = colour; }
      return keys.get(colour);
    }).join(''));
    frames[mood] = { pal, rows };
  }
  return { size: [size, size], frames };
}
