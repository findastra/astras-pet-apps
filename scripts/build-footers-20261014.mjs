// Apply the shared signature to hub-hosted program copies after app generation.
// Existing source-release links and operational footer controls remain intact.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { assertAnimal } from './animal-guard-20261013.mjs';
import { embedPaper } from './embed-paper-20261015.mjs';
assertAnimal(JSON.parse(readFileSync('pets.json','utf8')), 'astras-pet-os', 'build footers for');
let count=0;
for (const name of readdirSync('apps').filter(n=>n.endsWith('.html') && !n.startsWith('footer-template-'))) {
  const path='apps/'+name;
  let source=readFileSync(path,'utf8');
  source=source.replace(/\/\* Shared footer-template v1\.0\.[\s\S]*?customElements\.define\('astra-footer', AstraFooter\);\s*\}\)\(\);/g,()=>readFileSync('apps/footer-template-20261014.js','utf8'));
  // Embed the shared original Chip phone so standalone program copies stay offline-capable.
  source=source.replace(/<style data-astra-phone-baseline>[\s\S]*?<\/style><script data-astra-phone-baseline>[\s\S]*?<\/script>/g,'');
  const phone='<style data-astra-phone-baseline>\n'+readFileSync('apps/pet-phone-20261015.css','utf8')+'\n</style><script data-astra-phone-baseline>\n'+readFileSync('apps/pet-phone-20261015.js','utf8')+'\n</script>';
  const phonePosition=source.lastIndexOf('</body>');
  source=phonePosition<0?source+phone:source.slice(0,phonePosition)+phone+source.slice(phonePosition);
  const registry=JSON.parse(readFileSync('pets.json','utf8'));
  const pet=[...registry.pets,...registry.pipeline].find(p=>p.interface_local_url==='apps/'+name);
  if(pet)source=embedPaper(source,pet.repo);
  writeFileSync(path,source);
  if(name==='astras-pet-apps-20261008.html'&&!source.includes('href="footer-template-20261014.html"')){source=source.replace('<div data-astra-shared-footer','<p style="text-align:center"><a href="footer-template-20261014.html">footer-template</a></p><div data-astra-shared-footer');writeFileSync(path,source);}
  if(!source.includes('pet-page-spacing-20261014.css')){const link='<link rel="stylesheet" href="pet-page-spacing-20261014.css">';source=source.includes('</head>')?source.replace('</head>',link+'</head>'):link+source;writeFileSync(path,source);}
  if(source.includes('data-astra-shared-footer'))continue;
  // Only remove the old signature, not license/version/help/control contents.
  let next=source.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi,footer=>footer
    .replace(/<p>Made by Astra[^<]*<\/p>/g,'')
    .replace(/<br>Made by Astra\.?/g,''));
  const signature='<div data-astra-shared-footer style="max-width:1180px;margin:24px auto;padding:0 20px 24px"><astra-footer date="2026-10-14"></astra-footer></div><script src="footer-template-20261014.js"></script>';
  const closing=next.lastIndexOf('</body>');
  const position=closing<0 ? next.length : closing;
  next=next.slice(0,position)+signature+next.slice(position);
  writeFileSync(path,next);count++;
}
console.log(`Shared footer applied to ${count} hub program pages.`);
