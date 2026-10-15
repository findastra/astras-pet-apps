import test from 'node:test'; import assert from 'node:assert/strict'; import vm from 'node:vm'; import fs from 'node:fs';
const source=fs.readFileSync(new URL('../apps/pet-paper-20261015.js',import.meta.url),'utf8');
function page(stored='{}',health={}){
  const nodes=[];let now=Date.now();
  class Element{constructor(){this.style={setProperty(){}};this.dataset={};this.children=[];this.classList={add(){},toggle(){}};this.scrollHeight=2000;this.offsetWidth=816;nodes.push(this);}append(e){this.children.push(e);}setAttribute(){}querySelector(){return null;}scrollIntoView(){this.focused=true;}}
  const body=new Element(),listeners={},windowEvents={},handlers={};
  const context={document:{body,documentElement:new Element(),title:'Damsel',readyState:'complete',querySelector:()=>null,createElement:()=>new Element(),addEventListener:(name,fn)=>{(handlers[name]??=[]).push(fn);listeners[name]=event=>handlers[name].forEach(f=>f(event));}},getComputedStyle:()=>({colorScheme:'light',marginTop:'60',marginBottom:'24'}),innerHeight:900,innerWidth:900,scrollY:0,Element,requestAnimationFrame:fn=>fn(),setInterval:()=>0,localStorage:{getItem:()=>stored,setItem(){}},Date:class extends Date{static now(){return now;}}};
  context.window={astraPetHealth:health,addEventListener:(name,fn)=>windowEvents[name]=fn,scrollTo:({top})=>context.scrollY=Math.max(0,top)};
  vm.runInNewContext(source,context);
  const wheel=(delta,ctrl=true)=>{let prevented=false;listeners.wheel({ctrlKey:ctrl,deltaY:delta,clientY:300,preventDefault:()=>prevented=true});return prevented;};
  return {body,listeners,context,wheel,status:()=>nodes.find(n=>n.className==='mood-status').textContent,tick:ms=>now+=ms};
}
test('ordinary wheel keeps normal zoom and native scrolling',()=>{const p=page();assert.equal(p.wheel(300,false),false);assert.equal(p.body.style.zoom,undefined);});
test('Ctrl wheel reaches whole-page fit and never goes past either limit',()=>{const p=page();assert.equal(p.wheel(100000),true);const min=Number(p.body.style.zoom);assert.ok(min>.4&&min<.5);p.wheel(100000);assert.equal(Number(p.body.style.zoom),min);assert.equal(p.context.scrollY,0);p.wheel(-100000);assert.equal(Number(p.body.style.zoom),1);});
test('new page starts normal; Ctrl+0 restores normal without activating page actions',()=>{const p=page();p.wheel(300);let prevented=false;p.listeners.keydown({ctrlKey:true,key:'0',preventDefault:()=>prevented=true});assert.equal(prevented,true);assert.equal(Number(p.body.style.zoom),1);const fresh=page();assert.equal(fresh.body.style.zoom,undefined);});
test('malformed history does not break the page or zoom',()=>{for(const stored of ['null','[]','123','{']){const p=page(stored);assert.match(p.status(),/^Awake/);p.wheel(100);assert.ok(Number(p.body.style.zoom)<1);}});
test('Sick uses real counts, unknown queues stay unknown, success must be explicit',()=>{assert.match(page('{}',{brokenTools:3}).status(),/^Sick/);assert.match(page('{}',{brokenTools:0}).status(),/^Awake/);assert.match(page('{}',{brokenTools:0,successful:true}).status(),/^Happy/);assert.match(page('{}',{brokenTools:0,unansweredQuestions:10,notifications:0}).status(),/^Sick/);assert.match(page('{}',{brokenTools:0,unansweredQuestions:10,notifications:null}).status(),/queues are not connected/);});
test('long absence is Sad and keyboard/input activity prevents Idle',()=>{const p=page(JSON.stringify({lastOpened:Date.now()-31*86400000}));assert.match(p.status(),/^Sad/);const active=page();active.tick(70000);active.listeners.input({});assert.match(active.status(),/^Awake/);});
