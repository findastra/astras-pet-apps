// Shared read-only L3 activity view. By Astra; OpenAI Codex (GPT-6), 2026-10-16.
(()=>{'use strict';
  if(window.astraL3Activity)return;
  const cfg=JSON.parse(document.querySelector('[data-astra-l3-config]')?.textContent||'{}');
  const allowed=new Set(['disconnected','idle','working','awaiting-review','complete','error','off']);
  let view=null,log=null,summary=null,source=null,last=null,lastKey='',events=[];
  const clean=(s,n=240)=>typeof s==='string'?s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').slice(0,n):'';
  function receive(x){
    if(!x||x.repo!==cfg.repo||!allowed.has(x.status)||!Number.isFinite(Date.parse(x.at)))return false;
    if(Date.parse(x.at)>Date.now()+10000||last&&Date.parse(x.at)<Date.parse(last.at))return false;
    last={status:x.status,at:x.at,provider:clean(x.provider,80),task:clean(x.task),session:clean(x.session,80)};
    events=(Array.isArray(x.events)?x.events:[]).slice(-80).filter(e=>e&&Number.isFinite(Date.parse(e.at))&&Date.parse(e.at)<=Date.now()+10000&&typeof e.message==='string').map(e=>({at:e.at,message:clean(e.message,500)}));
    render();return true;
  }
  function render(){if(!view)return;
    const stale=last&&Date.now()-Date.parse(last.at)>120000&&['idle','working','awaiting-review'].includes(last.status);
    const state=stale?'stale':last?.status||'disconnected';view.dataset.state=state;
    summary.textContent=!last?'Disconnected · No L3 activity feed is connected.':stale?'Stale · Waiting for a fresh L3 update.':last.status.replaceAll('-',' ')+' · '+(last.task||'No current task reported.');
    source.textContent=last?[(last.provider||'Provider not reported'),last.session?'Session '+last.session:null,'Updated '+new Date(last.at).toLocaleString()].filter(Boolean).join(' · '):'Seat: empty. Opening this program does not start an agent.';
    const key=JSON.stringify(events);if(key===lastKey)return;lastKey=key;
    const atBottom=log.scrollHeight-log.scrollTop-log.clientHeight<30;log.replaceChildren();
    if(!events.length){const p=document.createElement('p');p.textContent='No activity received.';log.append(p);}
    for(const e of events){const p=document.createElement('p');p.textContent=new Date(e.at).toLocaleTimeString()+' · '+e.message;log.append(p);}
    if(atBottom)log.scrollTop=log.scrollHeight;
  }
  function mount(){
    view=document.createElement('section');view.className='astra-l3-activity';view.setAttribute('data-astra-l3-activity','1');view.setAttribute('aria-label',(cfg.pet||'Pet')+' L3 activity');
    const heading=document.createElement('h2');heading.textContent=(cfg.pet||'Pet')+' · L3 activity';
    summary=document.createElement('p');summary.className='astra-l3-status';summary.setAttribute('role','status');
    source=document.createElement('p');source.className='astra-l3-source';
    log=document.createElement('div');log.className='astra-l3-log';log.setAttribute('role','log');log.setAttribute('aria-live','polite');log.setAttribute('aria-relevant','additions');log.setAttribute('tabindex','0');log.setAttribute('aria-label','Recent L3 activity');
    view.append(heading,summary,source,log);
    const slot=document.querySelector('[data-astra-l3-mount]'),header=document.querySelector('header');
    if(slot)slot.replaceWith(view);else if(header)header.insertAdjacentElement('afterend',view);else document.body.prepend(view);
    render();setInterval(render,15000);
  }
  window.astraL3Activity=Object.freeze({receive});
  document.addEventListener('astra-l3-activity',e=>receive(e.detail));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
