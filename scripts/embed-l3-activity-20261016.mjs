// Narrow, idempotent activity embed; never replaces host scripts or other shared UI.
// By Astra; OpenAI Codex (GPT-6), 2026-10-16.
import {readFileSync} from 'node:fs';
export function embedActivity(source,repo,root='.',petName){
  const registry=JSON.parse(readFileSync(root+'/pets.json','utf8'));
  const pet=[...registry.pets,...registry.pipeline].find(p=>p.repo===repo);
  if(!pet&&!petName)throw Error('Unknown Pet Program: '+repo);
  const cfg=JSON.stringify({repo,pet:petName||pet.pet}).replaceAll('<','\\u003c');
  const block='<!--astra-l3-start--><script type="application/json" data-astra-l3-config>'+cfg+'</script><style data-astra-l3-style>'+readFileSync(root+'/apps/pet-l3-activity-20261016.css','utf8')+'</style><script data-astra-l3-script>'+readFileSync(root+'/apps/pet-l3-activity-20261016.js','utf8')+'</script><!--astra-l3-end-->';
  source=source.replace(/<!--astra-l3-start-->[\s\S]*?<!--astra-l3-end-->/g,'');
  const index=source.lastIndexOf('</body>');return index<0?source+block:source.slice(0,index)+block+source.slice(index);
}
