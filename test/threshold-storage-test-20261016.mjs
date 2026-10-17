import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function harness(saved){
  const nodes=new Map(),storage=new Map(saved?[['the-threshold-backlog',saved]]:[]),blobs=[];
  const element=()=>({value:'',textContent:'',dataset:{},children:[],append(...x){this.children.push(...x);},replaceChildren(){this.children=[];},setAttribute(){},click(){}});
  const document={getElementById(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);},createElement:element,createTextNode:text=>({textContent:text}),querySelectorAll:()=>[]};
  document.getElementById('world-data').textContent=read('worlds/liminal-doors-register-20261016.json');document.getElementById('plan-filter').value='all';document.getElementById('note');
  const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
  vm.runInNewContext(read('worlds/the-threshold-20261016.js'),{document,localStorage,location:{hash:''},crypto:{randomUUID:()=> 'new-note'},Date,Intl,Blob,URL:{createObjectURL:b=>{blobs.push(b);return 'blob:test';},revokeObjectURL(){}},setTimeout(){}});
  return{nodes,storage,blobs,localStorage};
}
test('a large valid backup exports and restores with all notes intact',async()=>{
  const backup={schema:1,program:'the-threshold',floors:{1:{selected:true,stage:'concept'}},notes:Array.from({length:500},(_,i)=>({id:String(i),text:'💎'.repeat(4000),at:'2026-10-16T12:00:00Z'})),tools:{},project:null};
  const source=harness(JSON.stringify(backup));source.nodes.get('export-backup').onclick();const text=await source.blobs[0].text();assert.ok(Buffer.byteLength(text)>1000000);
  const dest=harness();dest.nodes.get('restore').files=[{size:Buffer.byteLength(text),text:async()=>text}];await dest.nodes.get('restore').onchange();
  const result=JSON.parse(dest.storage.get('the-threshold-backlog'));assert.deepEqual(result.notes,backup.notes);assert.equal(result.floors[1].selected,true);
});
test('corrupt storage is retained before a successful replacement and remains intact when recovery fails',()=>{
  const h=harness('{broken');h.nodes.get('note').value='A new idea';h.nodes.get('save-note').onclick();assert.ok([...h.storage.entries()].some(([k,v])=>k.startsWith('the-threshold-backlog:recovery:')&&v==='{broken'));assert.equal(JSON.parse(h.storage.get('the-threshold-backlog')).notes[0].text,'A new idea');
  const blocked=harness('{broken');blocked.localStorage.setItem=()=>{throw Error('full');};blocked.nodes.get('note').value='Still in memory';blocked.nodes.get('save-note').onclick();assert.equal(blocked.storage.get('the-threshold-backlog'),'{broken');assert.match(blocked.nodes.get('note-message').textContent,/Export/);
});
test('invalid imported notes do not replace an existing backlog',async()=>{
  const original={schema:1,program:'the-threshold',floors:{},notes:[{id:'keep',text:'Keep me',at:'2026-10-16T12:00:00Z'}],tools:{},project:null};const h=harness(JSON.stringify(original));
  h.nodes.get('restore').files=[{size:10,text:async()=>JSON.stringify({...original,notes:[{id:'bad',text:99}]})}];await h.nodes.get('restore').onchange();assert.deepEqual(JSON.parse(h.storage.get('the-threshold-backlog')),original);assert.match(h.nodes.get('backup-message').textContent,/Import not applied/);
});
