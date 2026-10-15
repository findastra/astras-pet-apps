import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const template=readFileSync(new URL('../scripts/system-map-template-20261012.html',import.meta.url),'utf8');
const extra=JSON.parse(readFileSync(new URL('../system-map.json',import.meta.url),'utf8'));
test('providers keep stable IDs and have exact owner-requested labels and alternative routes',()=>{
  assert.equal(extra.nodes.find(n=>n.id==='claude').name,'Anthropic');
  assert.equal(extra.nodes.find(n=>n.id==='openai').name,'OpenAI');
  for(const to of ['openai','claude','codex','claude-code']) assert.ok(extra.links.some(l=>l.from==='farm'&&l.to===to&&l.carries==='model'&&l.state==='planned'));
});
test('repeated visibility changes clear hidden focus and restore independent rings without allocating objects',()=>{
  const nodes=[{id:'farm',type:'infrastructure'},{id:'openai',type:'model'},{id:'codex',type:'assistant'},{id:'agent-harness',type:'harness'}];
  for(const n of nodes)n.iconSprite={material:[{},{}]};
  const meshes=nodes.map(n=>({userData:{node:n,baseOpacity:1},material:{},scale:{setScalar(){}}}));
  const makeLink=(from,to)=>({from,to,state:'planned',pair:[from,to].sort().join('|'),line:{material:{}},hit:{},dot:{}});
  const links=[makeLink('farm','openai'),makeLink('farm','codex'),makeLink('codex','openai')];
  const side={hidden:false}, glass={material:{}}, wire={material:{}}, ring={userData:{node:nodes[2]},material:{}};
  const c=vm.createContext({DATA:{nodes},APP_PROVIDER:{codex:'openai'},nodeById:Object.fromEntries(nodes.map(n=>[n.id,n])),hiddenTypes:new Set(),removed:new Set(),EXAMPLES:{},examplesHidden:false,appRingsOn:true,meshes,links,appRings:[ring],hatsOn:false,selected:nodes[2],hovered:nodes[2],selectedPair:null,matches:null,iconMode:false,shellsOn:true,harnessGlass:glass,harnessWire:wire,shells:[],ringTags:[],labelEls:Object.fromEntries(nodes.map(n=>[n.id,{dataset:{}}])),document:{getElementById:()=>side}});
  const nodeOn=template.match(/const nodeOn = .*;/)[0];
  const apply=template.slice(template.indexOf('function apply(){'),template.indexOf('const ray=new THREE.Raycaster'));
  vm.runInContext(nodeOn+'\nfunction linkVisible(l){return nodeOn(nodeById[l.from])&&nodeOn(nodeById[l.to]);}\n'+apply,c);
  for(let i=0;i<500;i++){
    vm.runInContext('appRingsOn=false;apply()',c);
    assert.equal(ring.visible,false); assert.equal(links[0].line.visible,true); assert.equal(links[1].line.visible,false);
    assert.equal(c.selected,null); assert.equal(c.hovered,null);
    vm.runInContext('appRingsOn=true;apply()',c);assert.equal(ring.visible,true);assert.equal(links[1].line.visible,true);
  }
  vm.runInContext("hiddenTypes.add('model');apply()",c);assert.equal(ring.visible,false);
  vm.runInContext("hiddenTypes.clear();apply()",c);assert.equal(ring.visible,true);
  assert.equal(meshes.length,4);assert.equal(links.length,3);
});
test('hover events coalesce and pointer cancellation releases navigation',()=>{
  const hover=template.slice(template.indexOf('let pendingPointer=null;'),template.indexOf("renderer.domElement.addEventListener('pointerleave'"));
  const handlers={}, calls=[];
  const c=vm.createContext({renderer:{domElement:{style:{},addEventListener:(name,fn)=>handlers[name]=fn}},pick:ev=>(calls.push(ev),null),hovered:null,selected:null,selectedPair:null,apply(){},tip:{},innerWidth:1000});
  vm.runInContext(hover,c);
  for(let i=0;i<1000;i++)handlers.pointermove({buttons:0,clientX:i,clientY:2});
  assert.equal(calls.length,0);vm.runInContext('updateHover()',c);assert.equal(calls.length,1);assert.equal(calls[0].clientX,999);
  vm.runInContext('updateHover()',c);assert.equal(calls.length,1);
  assert.match(template,/pointercancel',releaseNavigation/);
  assert.doesNotMatch(template,/new THREE.TubeGeometry|preserveDrawingBuffer:true/);
});

test('coin spin starts still, slows down and stops after four turns',()=>{
 const c=vm.createContext({});vm.runInContext(template.match(/function coinSpinAngle[^\n]+/)[0],c);
 const at=t=>vm.runInContext('coinSpinAngle('+t+')',c);
 assert.equal(at(0),0);assert.equal(at(5000),Math.PI*8);assert.equal(at(9000),at(5000));
 let prior=Infinity;for(let t=0;t<5000;t+=500){const step=at(t+500)-at(t);assert.ok(step>=0&&step<prior);prior=step;}
});
