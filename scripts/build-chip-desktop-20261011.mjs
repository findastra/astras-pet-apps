// Astra's requested screen-face variant; original Data Dealer pixels remain available.
import {mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chipOriginalSprite} from './chip-original-20261008.mjs';
import {png} from './art-kit.mjs';
const dir=fileURLToPath(new URL('../desktop-art/chip/',import.meta.url));
mkdirSync(dir,{recursive:true});
const sprite=chipOriginalSprite({screenFace:true});
for(const [mood,frame] of Object.entries(sprite.frames)){
  const [w,h]=sprite.size,rgba=Buffer.alloc(w*h*4);
  frame.rows.forEach((row,y)=>[...row].forEach((c,x)=>{
    if(c==='.')return;const hex=frame.pal[c].slice(1),at=(y*w+x)*4;
    for(let k=0;k<3;k++)rgba[at+k]=parseInt(hex.slice(k*2,k*2+2),16);
    rgba[at+3]=255;
  }));
  writeFileSync(`${dir}${mood}-20261011.png`,png(w,h,rgba));
}
console.log('Chip: nine desktop screen-face frames.');
