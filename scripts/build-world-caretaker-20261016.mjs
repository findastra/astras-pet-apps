// Rebuild the local Pet Program and connected concept website from one floor register.
// By Astra; OpenAI Codex (GPT-6), 2026-10-16. No network or model invocation.
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {assertAnimal} from './animal-guard-20261013.mjs';
import {embedActivity} from './embed-l3-activity-20261016.mjs';
export function buildWorldCaretaker(root=resolve(fileURLToPath(new URL('..',import.meta.url)))){
  const read=p=>readFileSync(root+'/'+p,'utf8').replaceAll('\r\n','\n');
  assertAnimal(JSON.parse(read('pets.json')),'astras-pet-os','build the owner-requested caretaker prototype');
  const data=JSON.parse(read('worlds/liminal-doors-register-20261016.json'));
  const payload=JSON.stringify(data).replaceAll('<','\\u003c');
  const css=read('worlds/world-caretaker-20261016.css');
  const phone='<style data-astra-phone-baseline>'+read('apps/pet-phone-20261015.css')+'</style><script data-astra-phone-baseline>'+read('apps/pet-phone-20261015.js')+'</script>';
  const preview=read('worlds/liminal-doors-preview-20261016.html').replace('__CSS__',()=>css).replace('__DATA__',()=>payload).replace('__PREVIEW_JS__',()=>read('worlds/liminal-doors-preview-20261016.js'));
  let manager=read('worlds/the-threshold-20261016.html').replace('__CSS__',()=>css).replace('__DATA__',()=>payload).replace('__MANAGER_JS__',()=>read('worlds/the-threshold-20261016.js')).replace('__PHONE__',()=>phone);
  manager=embedActivity(manager,'the-threshold',root,'Door Dormouse');
  writeFileSync(root+'/apps/liminal-doors-20261016.html',preview);writeFileSync(root+'/apps/the-threshold-20261016.html',manager);
  return {preview,manager};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('Built Liminal Doors + The Threshold:',Object.keys(buildWorldCaretaker()).join(', '));
