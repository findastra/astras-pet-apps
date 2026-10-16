// Offline stationery and original mood artwork. OpenAI Codex GPT-6, 2026-10-15.
import {readFileSync,existsSync} from 'node:fs';
import {embedActivity} from './embed-l3-activity-20261016.mjs';
export function embedPaper(source,repo,root='.'){
  const registry=JSON.parse(readFileSync(root+'/pets.json','utf8'));
  const pet=[...registry.pets,...registry.pipeline].find(p=>p.repo===repo);
  if(!pet)return source;
  const moods={};for(const mood of ['sleep','idle','blink','curious','happy','worried','alarmed','sick','sad']){
    const path=root+'/art/frames/'+pet.art+'/'+mood+'.png';
    if(pet.art&&existsSync(path))moods[mood]='data:image/png;base64,'+readFileSync(path).toString('base64');
  }
  const config={repo,pet:pet.pet,moods};if(repo==='findastra-discord-presence')config.hue=204;
  const payload='<script type="application/json" data-astra-paper-data>'+JSON.stringify(config).replaceAll('<','\\u003c')+'</script>';
  const block='<!--astra-paper-start-->'+payload+'<style>'+readFileSync(root+'/apps/pet-paper-20261015.css','utf8')+'</style><script>'+readFileSync(root+'/apps/pet-paper-20261015.js','utf8')+'</script><!--astra-paper-end-->';
  source=source.replace(/<!--astra-paper-start-->[\s\S]*?<!--astra-paper-end-->/g,'');
  if(!/<meta[^>]*charset/i.test(source))source='<meta charset="utf-8">\n'+source;
  const end=source.lastIndexOf('</body>');return embedActivity(end<0?source+block:source.slice(0,end)+block+source.slice(end),repo,root);
}
