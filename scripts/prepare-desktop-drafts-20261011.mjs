// Local previews only: never copy private character assets into the public hub.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {png} from './art-kit.mjs';
const projects=join(process.env.USERPROFILE,'Documents','Projects');
const local=join(process.env.LOCALAPPDATA,'astras-pet-apps');
const cache=join(local,'drafts-20261011');
const pets=[];
// Sugarcube finished after the initial draft inventory.
function add(id,name,dir,idle,blink,repo=id){
  const entry={id,name,idle:join(dir,idle),blink:join(dir,blink),interface:`https://github.com/findastra/${repo}`};
  for(const key of ['idle','blink'])if(!existsSync(entry[key]))throw Error(`Missing ${entry[key]}`);
  pets.push(entry);
}
for(const id of ['claude-bot','rgbee','mine-mole','mail-snail','patch-cat','backup-beaver','rift-rabbit']){
  const repo=['claude-bot','rgbee'].includes(id)?`${id}-draft-art-20261011`:id;
  add(id,id.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' '),join(projects,repo,'draft-art',id),'idle-20261011.png','blink-20261011.png');
}
for(const id of ['wifi-butterfly','chat-rat'])add(id,id==='chat-rat'?'Chat Rat':'Wifi Butterfly',join(projects,id,'art'),'idle-20261009.png','blink-20261009.png');
add('deck-duck','Deck Duck',join(projects,'deck-duck','art','frames'),'neutral.png','blink.png');
add('raspberry-berry','Raspberry Pi',join(projects,'raspberry-berry','art','frames'),'idle-20261010.png','blink-20261010.png');
add('meme-fiend','Meme Fiend',join(projects,'meme-fiend','art'),'meme-fiend-20261009.png','meme-fiend-20261009.png');
add('fuzzboi-friend','Fuzzboi Friend',join(cache,'fuzzboi-friend','art'),'idle-20261009.png','blink-20261009.png');
add('gif-giraffe','Gif Giraffe',join(cache,'astras-gif-maker','art','frames','gif-giraffe'),'idle.png','blink.png','astras-gif-maker');
const mesh=JSON.parse(readFileSync(join(projects,'mesh-moth','sprite.json')));
const dir=join(cache,'mesh-moth');mkdirSync(dir,{recursive:true});
for(const mood of ['idle','blink']){
  const frame=mesh.frames[mood], [w,h]=mesh.size,rgba=Buffer.alloc(w*h*4);
  frame.rows.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='.')return;const hex=frame.pal[c].slice(1);const offset=(y*w+x)*4;for(let k=0;k<3;k++)rgba[offset+k]=parseInt(hex.slice(k*2,k*2+2),16);rgba[offset+3]=255;}));
  writeFileSync(join(dir,`${mood}-20261011.png`),png(w,h,rgba));
}
add('mesh-moth','Mesh Moth',dir,'idle-20261011.png','blink-20261011.png');
add('spoonfed-sugarcube','Sugarcube',join(projects,'spoonfed-art-20261011','draft-art','spoonfed-sugarcube'),'idle-20261011.png','blink-20261011.png','spoonfed');
writeFileSync(join(local,'desktop-drafts-20261011.json'),JSON.stringify({pets},null,2));
console.log(`${pets.length} local draft pets ready.`);
