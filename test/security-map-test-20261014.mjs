import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { systemMapData } from '../scripts/system-map-20261012.mjs';
import { buildPetCatalog } from '../scripts/pet-catalog-20261014.mjs';
import { isAnimal } from '../scripts/animal-guard-20261013.mjs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const registry=JSON.parse(read('pets.json')), catalog=JSON.parse(read('pet-programs.json'));
test('every numbered catalog program has exactly one map representation without becoming an animal',()=>{
  const map=systemMapData(registry,JSON.parse(read('system-map.json')));
  for(const p of catalog.programs) assert.equal(map.nodes.filter(n=>n.programNumber===p.number).length,1,p.icon);
  assert.equal(isAnimal(registry,'pet-program-81'),false);
  assert.equal(map.nodes.find(n=>n.name==='Intel Owl').state,'planned');
});
test('map explains owner authority and does not invent ring-wide permissions',()=>{
  const page=read('scripts/system-map-template-20261012.html');
  assert.match(page,/You own the system/); assert.match(page,/Effective permissions: unverified/);
  assert.doesNotMatch(page,/rwx:\s*\[|rwxHtml|can only control animals/);
});
test('catalog never links nonexistent repositories and escapes supplied names',()=>{
  const fixture={programs:[{number:1,icon:'<script>bad</script>',program:'x',stage:'seed',assigned:false,idea:'Test',repo:'no-repo',repo_exists:false,mini_descriptor:{text:'<img>'}}]};
  const html=buildPetCatalog(fixture,{nodes:[]});
  assert.match(html,/&lt;script&gt;/); assert.doesNotMatch(html,/<script>bad/);
  assert.doesNotMatch(html,/github.com\/findastra\/no-repo/);
});
test('repo identity cannot hide an extra path segment',()=>{
  assert.equal(isAnimal(registry,'findastra/astras-pet-os/other'),false);
  assert.equal(isAnimal(registry,'findastra/astras-pet-os'),true);
});
