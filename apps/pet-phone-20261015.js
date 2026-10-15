/* Owner's original Chip phone baseline, 2026-10-15. No model connection is implied. */
(() => {
  const run = () => {
    if(document.querySelector('[data-astra-phone-ready]')) return;
    const make=(tag,text,parent,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;if(parent)parent.append(e);return e;};
    let launch=document.querySelector('#tower-chat-launcher,#pet-open,#pet-chat');
    let panel=launch ? document.getElementById(launch.id==='pet-open'?'pet':launch.id==='pet-chat'?'cyber-deck':'tower-chat') : null;
    const original=launch?.querySelector('canvas,img') || document.querySelector('body>header img,header img')?.cloneNode(true);
    const name=launch?.getAttribute('aria-label')?.replace(/^Open /,'').replace(/ chat$/i,'') || document.querySelector('h1')?.textContent || 'Pet';
    if(!launch || !panel){
      launch=make('button',null,document.body);launch.type='button';launch.setAttribute('aria-label','Open '+name+' chat');
      panel=make('dialog',null,document.body);panel.id='astra-phone-chat';
      panel.setAttribute('aria-label',name+' Chat');
      const head=make('div',null,panel,'pet-head');make('h2',name+' Chat',head);
      const close=make('button','×',head,'pet-x');close.type='button';close.setAttribute('aria-label','Close chat');close.onclick=()=>panel.close();
      const display=make('div',null,panel,'lcd phone-display');make('p','Seat: empty. No AI account is connected to this page.',display);
      make('p','Chat becomes available when a compatible host is connected.',display);
      const form=make('div',null,panel,'pet-in');const input=make('input',null,form);input.placeholder='Chat is disconnected';input.disabled=true;input.setAttribute('aria-label','Message');const send=make('button','SEND',form);send.disabled=true;
      launch.onclick=()=>panel.showModal();
    }
    launch.className='astra-phone-launch';launch.dataset.astraPhoneReady='true';launch.setAttribute('aria-controls',panel.id);
    // Keep live canvases and their IDs so existing drawing and host handlers still work.
    const canvases=[...launch.querySelectorAll('canvas')];
    const badge=launch.querySelector('.badge');
    launch.replaceChildren();
    if(original){launch.append(original);if(original.tagName==='CANVAS')original.hidden=false;}
    else make('span','▣',launch);
    for(const canvas of canvases)if(canvas!==original){canvas.hidden=true;launch.append(canvas);}
    make('span','CHAT',launch,'lbl');if(badge)launch.append(badge);
    panel.classList.add('astra-phone');
    if(panel.id==='tower-chat'){
      panel.querySelector('h2').textContent='Discord Damsel Chat';
      const head=make('div',null,panel,'pet-head');head.append(panel.querySelector('h2'),panel.querySelector('.tower-close'));panel.prepend(head);
      panel.querySelector('.tower-close').className='pet-x';
      const display=make('div',null,panel,'lcd phone-display');for(const p of [...panel.querySelectorAll(':scope > p')])display.append(p);
      const form=make('div',null,panel,'pet-in');const input=make('input',null,form);input.disabled=true;input.placeholder='Chat is disconnected';input.setAttribute('aria-label','Message');make('button','SEND',form).disabled=true;
    }
    for(const edge of document.querySelectorAll('.coin-edge,.tower-edge'))edge.remove();
    for(const controls of document.querySelectorAll('.tool-controls')){
      const details=controls.closest('details'),summary=details?.querySelector(':scope>summary');if(!summary)continue;
      details.classList.add('tower-tool');controls.className='tower-controls tower-light-controls';summary.append(controls);
      for(const input of controls.querySelectorAll('input[type=checkbox]')){
        const label=input.closest('label');if(!label)continue;label.hidden=true;
        const maintenance=/Sick|Not working/i.test(input.getAttribute('aria-label')||'');
        const light=make('button',null,controls,'tower-light');light.type='button';light.dataset.control=maintenance?'sick':'enabled';
        const update=()=>{light.dataset.active=String(input.checked);const state=maintenance?(input.checked?'Needs maintenance':'Working'):(input.checked?'On':'Off');light.title=state+' — click to change';light.setAttribute('aria-label',(input.getAttribute('aria-label')||'Tool')+': '+state);light.setAttribute('aria-pressed',String(input.checked));};
        update();input.addEventListener('change',update);light.onclick=event=>{event.preventDefault();event.stopPropagation();input.click();update();};
      }
    }
    if(!document.querySelector('.tower-shared')){
      const common=make('section',null,document.body,'astra-common');common.setAttribute('aria-label','Shared Pet Program controls');
      const section=(title)=>{const s=make('section',null,common);make('h2',title,s);return s;};
      const notes=section('Your Notes');const area=make('textarea',null,notes);area.setAttribute('aria-label','Pet Program notes');
      let identity=location.pathname;try{identity=JSON.parse(document.querySelector('script[data-astra-paper-data]')?.textContent||'{}').repo||identity;}catch{}const noteKey='astra-phone-notes:'+identity;try{let value=localStorage.getItem(noteKey);if(value===null){value=localStorage.getItem('astra-phone-notes:'+location.pathname);if(value!==null)localStorage.setItem(noteKey,value);}area.value=value||'';}catch{}
      const save=make('button','Save notes',notes);const receipt=make('p','Saved on this browser only.',notes);receipt.setAttribute('role','status');save.onclick=()=>{try{localStorage.setItem(noteKey,area.value);receipt.textContent='Notes saved in this browser.';}catch{receipt.textContent='Browser storage unavailable; copy your notes before closing.';}};
      const exportNotes=make('button','Export notes',notes);exportNotes.onclick=()=>{const blob=new Blob([JSON.stringify({schema:1,program:identity,notes:area.value},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=make('a');a.href=url;a.download='pet-notes-'+new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replaceAll('-','')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
      const restoreLabel=make('label','Import notes',notes),restore=make('input',null,restoreLabel);restore.type='file';restore.accept='.json';restore.onchange=async()=>{const file=restore.files?.[0];if(!file)return;try{if(file.size>5_000_000)throw Error('Export is too large.');const data=JSON.parse(await file.text());if(data.schema!==1||data.program!==identity||typeof data.notes!=='string')throw Error('Choose an export from this Pet Program.');const current=area.value;localStorage.setItem(noteKey+':before-import',current);localStorage.setItem(noteKey,data.notes);area.value=data.notes;receipt.textContent='Notes imported. Previous notes kept for Undo import.';}catch(error){receipt.textContent='Import not applied: '+error.message;}finally{restore.value='';}};
      const undo=make('button','Undo import',notes);undo.onclick=()=>{try{const old=localStorage.getItem(noteKey+':before-import');if(old===null){receipt.textContent='No import backup exists.';return;}localStorage.setItem(noteKey,old);area.value=old;receipt.textContent='Previous notes restored.';}catch{receipt.textContent='Browser storage is unavailable.';}};
      const tutorials=section('Your Tutorials');tutorials.classList.add('astra-tutorials');
      const existingTutorials=document.querySelector('#tutorial-grid');
      if(existingTutorials){for(const box of [...existingTutorials.children]){const summary=box.querySelector('summary');if(summary&&summary.firstChild?.nodeType===3)summary.firstChild.textContent=box.id.includes('play-with')?'Play with '+name:'Care for '+name;tutorials.append(box);}const note=existingTutorials.previousElementSibling,heading=note?.previousElementSibling;if(heading?.tagName==='H2'&&heading.textContent==='Tutorial tools'){heading.remove();note.remove();}existingTutorials.remove();}
      else for(const label of ['Play with '+name,'Care for '+name]){const button=make('button',label,tutorials);button.onclick=()=>launch.click();}
      make('p','Open this pet’s chat. Guided tutorials require a connected host; opening chat does not start a tutorial.',tutorials);
      const split=make('div',null,common,'astra-shared-split');split.append(tutorials,notes);
      const training=section('Clicker Training');training.classList.add('astra-clicker-training');
      const bindings=make('dl',null,training);
      for(const [gesture,action] of [['One click','Show the most important emotion-linked message.'],['Two clicks','Show or hide this Pet Program window. Background work continues.'],['Three clicks','Run the assigned quick tool. No quick tool is assigned by this page.']]){make('dt',gesture,bindings);make('dd',action,bindings);}
      make('p','Desktop binding status: not verified by this page. The yellow phone opens browser chat.',training);
      const about=section('About');const collar=make('details',null,about);make('summary','Pet collar',collar);make('p',name+' · by Astra. The collar holds identity, version and provenance information. Release signatures and installed versions have not been verified by this page.',collar);
      for(const footer of [...document.querySelectorAll('body > footer,body > [data-astra-shared-footer]')])common.append(footer);
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
