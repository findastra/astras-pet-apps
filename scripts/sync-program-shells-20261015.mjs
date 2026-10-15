// Explicit local rollout; does not commit, publish, install, or alter runtime settings.
// OpenAI Codex GPT-6, 2026-10-15.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {assertAnimal,assertInside} from './animal-guard-20261013.mjs';
import {embedPaper} from './embed-paper-20261015.mjs';
const registry=JSON.parse(readFileSync('pets.json','utf8'));
const parent=resolve(process.argv[2]||'..');
const css=readFileSync('apps/pet-phone-20261015.css','utf8'),js=readFileSync('apps/pet-phone-20261015.js','utf8');
const footer=readFileSync('apps/footer-template-20261014.js','utf8');
for(const pet of [...registry.pets,...registry.pipeline]){
  if(pet.repo===registry.cage)continue;
  const folder=join(parent,pet.repo),metadata=join(folder,'pet.json');
  if(!existsSync(metadata))continue;
  const meta=JSON.parse(readFileSync(metadata,'utf8').replace(/^\uFEFF/,''));
  const entry=meta.entry||meta.preview;if(!entry||!entry.endsWith('.html'))continue;
  const paths=pet.repo==='data-dealer'?['dashboard/src.html']:pet.repo==='github-goldfish'?['index.html','github-goldfish-20261008.html']:[entry];
  for(const file of paths){
    assertAnimal(registry,pet.repo);assertInside(folder,file);const path=join(folder,file);if(!existsSync(path))continue;
    let source=readFileSync(path,'utf8');
    source=source.replace(/<style data-astra-phone-baseline>[\s\S]*?<\/style><script data-astra-phone-baseline>[\s\S]*?<\/script>/g,'');
    source=source.replace(/\/\* Shared footer-template v1\.0\.[\s\S]*?customElements\.define\('astra-footer', AstraFooter\);\s*\}\)\(\);/g,()=>footer);
    const phone='<style data-astra-phone-baseline>'+css+'</style><script data-astra-phone-baseline>'+js+'</script>';
    const end=source.lastIndexOf('</body>');source=end<0?source+phone:source.slice(0,end)+phone+source.slice(end);
    source=embedPaper(source,pet.repo);
    writeFileSync(path,source);console.log(pet.repo+'/'+file);
  }
}
