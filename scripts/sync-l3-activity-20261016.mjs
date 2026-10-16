// Explicit, local-only shared activity rollout. By Astra; OpenAI Codex GPT-6.
// Replaces only its own marker block; no commits, publishing, or host changes.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {assertAnimal,assertInside} from './animal-guard-20261013.mjs';
import {embedActivity} from './embed-l3-activity-20261016.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const registry=JSON.parse(readFileSync(join(root,'pets.json'),'utf8'));
let count=0;const write=(folder,path,repo)=>{assertAnimal(registry,repo,'embed L3 activity');assertInside(folder,path);const f=resolve(folder,path);if(!existsSync(f))return;const before=readFileSync(f,'utf8'),after=embedActivity(before,repo,root);if(before!==after){writeFileSync(f,after);count++;}console.log(JSON.stringify({repo,file:path}));};
for(const pet of [...registry.pets,...registry.pipeline]){
  if(pet.interface_local_url&&existsSync(join(root,pet.interface_local_url)))write(root,pet.interface_local_url,pet.repo);
  if(!process.argv.includes('--siblings')||pet.repo==='astras-pet-os')continue;
  const folder=resolve(root,'..',pet.repo),metadata=join(folder,'pet.json');if(!existsSync(metadata))continue;
  const m=JSON.parse(readFileSync(metadata,'utf8').replace(/^\uFEFF/,''));const entry=m.entry||m.preview;if(!entry?.endsWith('.html'))continue;
  const targets=pet.repo==='github-goldfish'?['index.html',entry]:pet.repo==='data-dealer'?['dashboard/src.html',entry,'dashboard/index.html']:[entry];
  for(const path of new Set(targets))write(folder,path,pet.repo);
}
console.log(JSON.stringify({updated:count}));
