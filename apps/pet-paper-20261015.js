/* Shared portrait stationery, mood gallery and bounded zoom. OpenAI Codex GPT-6, 2026-10-15. */
(() => {
  function start(){
    if(document.body.dataset.paperReady)return;
    document.body.dataset.paperReady='true';
    const data=document.querySelector('script[data-astra-paper-data]');
    let config={};try{config=JSON.parse(data?.textContent||'{}');}catch{}
    const make=(tag,text,parent,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;if(parent)parent.append(e);return e;};
    let seed=0;for(const c of config.repo||document.title)seed=(seed*31+c.charCodeAt(0))>>>0;
    const dark=getComputedStyle(document.documentElement).colorScheme==='dark';
    document.documentElement.style.setProperty('--paper-hue',String(config.hue??seed%360));
    document.documentElement.style.setProperty('--paper-light',dark?'13%':'90%');
    document.documentElement.style.setProperty('--paper-ink',dark?'#e8e1eb':'#58445d');
    document.body.classList.add('astra-stationery');
    const common=document.querySelector('.tower-shared,.astra-common')||document.body;
    const gallery=make('section',null,null,'astra-mood-gallery');gallery.setAttribute('aria-label','Nine emotions');
    const meanings={Sleepy:'The program is open in a background tab.',Awake:'The program is open and you have interacted within the last minute.',Idle:'The program is open, with no interaction for over a minute.',Curious:'A connected tool is running a check.',Happy:'A connected tool reports a successful result, with no known broken tools.',Worried:'At least one tool is marked broken, below your Sick threshold.',Alarmed:'A connected source reports an active alarm.',Sick:'The broken-tool or pending-question and notification count has reached your chosen threshold.',Sad:'This browser had not opened the program for your chosen number of days.'};
    const grid=make('div',null,gallery,'mood-grid');
    for(const [label,art] of [['Sleepy','sleep'],['Awake','idle'],['Idle','idle'],['Curious','curious'],['Happy','happy'],['Worried','worried'],['Alarmed','alarmed'],['Sick','sick'],['Sad','sad']]){
      const item=make('figure',null,grid);if(config.moods?.[art]){const img=make('img',null,item);img.src=config.moods[art];img.alt=(config.pet||'Pet')+' — '+label;img.loading='lazy';}else make('span','Art pending',item,'mood-pending');
      item.dataset.emotion=label;const bubble=make('figcaption',null,item);make('strong',label.toUpperCase(),bubble);make('span',meanings[label],bubble);
    }
    const moodStatus=make('p','',gallery,'mood-status');moodStatus.setAttribute('role','status');
    const storageKey='astra-pet-activity:'+config.repo;let activity={},storageAvailable=true;
    try{const parsed=JSON.parse(localStorage.getItem(storageKey)||'{}');activity=parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};}catch{storageAvailable=false;}
    const previousVisit=Number(activity.lastOpened)||0;
    const limit=(key,fallback,max)=>Number.isInteger(activity[key])&&activity[key]>=1&&activity[key]<=max?activity[key]:fallback;
    const limits={days:limit('days',30,3650),broken:limit('broken',3,10000),pending:limit('pending',10,10000)};
    let lastInteraction=Date.now(),health=window.astraPetHealth||{};
    function saveActivity(){try{localStorage.setItem(storageKey,JSON.stringify({...limits,lastOpened:Date.now()}));}catch{storageAvailable=false;}}
    if(!document.hidden)saveActivity();
    function updateEmotion(){
      const broken=Number.isFinite(health.brokenTools)?health.brokenTools:null;
      const pending=Number.isFinite(health.unansweredQuestions)&&Number.isFinite(health.notifications)?health.unansweredQuestions+health.notifications:null;
      let state='Awake',reason='This page is open.';
      if(document.hidden){state='Sleepy';reason='This page is in the background.';}
      else if(Date.now()-lastInteraction>60000){state='Idle';reason='No recent interaction.';}
      if(health.successful===true&&broken===0){state='Happy';reason='The connected tool reported a successful check.';}
      if(previousVisit&&Date.now()-previousVisit>=limits.days*86400000){state='Sad';reason='This browser had not opened the program for '+limits.days+' days.';}
      if(health.checking){state='Curious';reason='A check is running.';}
      if(broken>0){state='Worried';reason=broken+(broken===1?' tool marked broken.':' tools marked broken.');}
      if(broken>=limits.broken||pending!==null&&pending>=limits.pending){state='Sick';reason=broken>=limits.broken?broken+' tools marked broken.':pending+' pending questions and notifications.';}
      if(health.alarm===true){state='Alarmed';reason='A connected source reports an active alarm.';}
      moodStatus.textContent=state+' · '+reason+(pending===null?' Question and notification queues are not connected.':'')+(!storageAvailable?' Visit history is unavailable.':'');
      for(const figure of grid.children)figure.classList.toggle('current-emotion',figure.dataset.emotion===state);
    }
    const settings=make('details',null,gallery,'emotion-settings');make('summary','Emotion settings',settings);
    make('p','Visit history is local to this browser. Blink stays an animation; Awake and Idle currently share the existing open-eye artwork.',settings);
    for(const [key,label] of [['days','Days away before Sad'],['broken','Broken tools before Sick'],['pending','Pending questions and notifications before Sick']]){const row=make('label',label,settings);const input=make('input',null,row);input.type='number';input.min='1';input.max=key==='days'?'3650':'10000';input.value=String(limits[key]);input.onchange=()=>{const value=Number(input.value);if(Number.isInteger(value)&&value>=1&&value<=Number(input.max)){limits[key]=value;saveActivity();updateEmotion();}else input.value=String(limits[key]);};}
    document.addEventListener('astra-pet-health',event=>{health=event.detail||{};updateEmotion();});
    document.addEventListener('pointerdown',()=>{lastInteraction=Date.now();updateEmotion();},{passive:true});
    document.addEventListener('keydown',()=>{lastInteraction=Date.now();updateEmotion();},{passive:true});
    document.addEventListener('input',()=>{lastInteraction=Date.now();updateEmotion();},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)saveActivity();updateEmotion();});
    setInterval(updateEmotion,30000);updateEmotion();
    const footer=common.querySelector('footer,[data-astra-shared-footer]');if(footer)common.insertBefore(gallery,footer);else common.append(gallery);
    for(let i=0;i<2;i++){const flake=make('span','✦',document.body,'paper-glitter');flake.setAttribute('aria-hidden','true');flake.style.left=(12+(seed+i*37)%77)+'%';flake.style.top=(16+(seed+i*23)%65)+'%';flake.style.animationDelay=(-i*11-(seed%17))+'s';}
    // No stored zoom or toolbar: every load starts at normal size. Ctrl+wheel is bounded by the full-page fit.
    let factor=1,minimum=1;
    function measure(){const body=document.body;const height=body.scrollHeight+parseFloat(getComputedStyle(body).marginTop)+parseFloat(getComputedStyle(body).marginBottom);minimum=Math.max(Number.EPSILON,Math.min(1,(innerHeight-32)/height,(innerWidth-16)/body.offsetWidth));}
    function set(value){measure();factor=Math.min(1,Math.max(minimum,value));document.body.style.zoom=String(factor);document.body.classList.toggle('paper-overview',factor<.999);}
    document.addEventListener('wheel',event=>{
      if(!event.ctrlKey)return;event.preventDefault();
      const before=factor,anchor=(scrollY+event.clientY)/before;
      set(factor*Math.exp(-event.deltaY*.002));
      window.scrollTo({top:factor<=minimum+.001?0:anchor*factor-event.clientY,left:0});
    },{passive:false,capture:true});
    document.addEventListener('keydown',event=>{if(event.ctrlKey&&['0','-','=','+'].includes(event.key)){event.preventDefault();set(event.key==='0'?1:factor*(event.key==='-'?.9:1.1));}},{capture:true});
    document.addEventListener('click',event=>{if(factor>=.999)return;event.preventDefault();event.stopImmediatePropagation();const target=event.target;set(1);requestAnimationFrame(()=>{if(target instanceof Element)target.scrollIntoView({block:'center',inline:'center'});});},true);
    window.addEventListener('resize',()=>{if(factor<1)set(factor);else measure();});measure();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
