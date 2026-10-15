/* Shared footer-template v1.0. Made by Astra; OpenAI Codex GPT-6, 2026-10-14. */
(() => {
  if (customElements.get('astra-footer')) return;
  const base = 'https://findastra.github.io/astras-pet-os/';
  const github = '<path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.09c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.73 2.63 1.23 3.27.94.1-.73.4-1.23.71-1.51-2.51-.29-5.15-1.26-5.15-5.58 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.16A10.7 10.7 0 0 1 12 6.12c.95 0 1.9.13 2.8.38 2.14-1.46 3.08-1.16 3.08-1.16.61 1.55.23 2.69.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.65 5.29-5.17 5.57.41.35.77 1.03.77 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z"/>';
  const tiktok = '<path d="M16 2c.4 2.7 1.9 4.3 4.5 4.5v3.4a9 9 0 0 1-4.5-1.4v7.4a6.3 6.3 0 1 1-5.5-6.3v3.5a2.9 2.9 0 1 0 2 2.8V2Z"/>';
  const safe = (value, fallback) => { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : fallback; } catch { return fallback; } };
  class AstraFooter extends HTMLElement {
    static get observedAttributes() { return ['date','github','pole','vr','home','farmer']; }
    constructor() { super(); this.attachShadow({mode:'open'}); }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if(this.isConnected) this.render(); }
    render() {
      const root = this.shadowRoot;
      root.innerHTML = `<style>
        :host{display:block;--footer-border:#d994c6;--footer-background:#211c2b;--footer-radius:22px;--footer-coin:64px}
        *{box-sizing:border-box}footer{border:0;background:transparent;color:var(--footer-color,inherit);padding:8px 0;overflow-x:auto;font:14px/1.4 system-ui,sans-serif}
        .line{display:flex;align-items:center;justify-content:center;gap:16px;white-space:nowrap;flex-wrap:nowrap;min-width:max-content;min-height:calc(var(--footer-coin) + 10px)}
        .group{display:inline-flex;align-items:center;gap:8px;flex:none}a{display:inline-grid;place-items:center;color:inherit;width:40px;height:44px;border-radius:12px;text-decoration:none}a:hover{background:#ffffff18}a:focus-visible{outline:3px solid var(--footer-border);outline-offset:3px}svg{width:25px;height:25px;fill:currentColor}.pole,.vr{color:inherit}.divider{opacity:.35}
        .home{width:calc(var(--footer-coin) + 10px);height:calc(var(--footer-coin) + 10px);perspective:500px}.coin{position:relative;width:var(--footer-coin);height:var(--footer-coin);transform-style:preserve-3d;animation:footer-spin 6s linear infinite}.face,.edge{position:absolute;inset:0}.edge{background:linear-gradient(125deg,#fff6b7,#d58d14 45%,#fff0a0 65%,#a56206);mask-size:contain;mask-repeat:no-repeat;mask-position:center}.face{backface-visibility:hidden;display:grid;place-items:center;transform:translateZ(calc(var(--footer-coin) * .025))}.back{transform:rotateY(180deg) translateZ(calc(var(--footer-coin) * .025))}.face img{width:100%;height:100%;object-fit:contain;image-rendering:pixelated}.back img{transform:scaleX(-1)}.home:hover .coin,.home:focus-visible .coin{animation-play-state:paused}@keyframes footer-spin{to{transform:rotateY(360deg)}}@media(prefers-reduced-motion:reduce){.coin{animation:none}}
      </style><footer aria-label="Made by Astra — signature and links"><div class="line"><span>Made by Astra</span><time></time><span class="divider" aria-hidden="true">│</span><span class="group more">Find Out More →</span><span class="divider" aria-hidden="true">│</span><span class="group home-group">Take Me Home! →</span></div></footer>`;
      const date = this.getAttribute('date') || '2026-10-14';
      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10) === date;
      const time = root.querySelector('time'); time.textContent = validDate ? date : '2026-10-14'; time.dateTime = time.textContent;
      const link = (label, href, cls='') => { const a=document.createElement('a'); a.href=href;a.title=label;a.setAttribute('aria-label',label);a.className=cls;return a; };
      for(const [key,label,url,art] of [['github','GitHub — Astra','https://github.com/findastra',github],['pole','Pole TikTok — @astra_on_fire','https://www.tiktok.com/@astra_on_fire',tiktok],['vr','VR TikTok — @findastra','https://www.tiktok.com/@findastra',tiktok]]){
        const a=link(label,safe(this.getAttribute(key),url),key);a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+art+'</svg>';root.querySelector('.more').append(a);
      }
      const home=link('The Farm — Friendly Farmer',safe(this.getAttribute('home'),base+'apps/astras-pet-apps-20261008.html'),'home');
      const art=safe(this.getAttribute('farmer'),base+'art/icons/astras-pet-os-20261012.png');
      const coin=document.createElement('span');coin.className='coin';coin.setAttribute('aria-hidden','true');
      for(let i=0;i<9;i++){const edge=document.createElement('span');edge.className='edge';edge.style.maskImage='url("'+art+'")';edge.style.transform=`translateZ(calc(var(--footer-coin) * ${(i-4)*.00625}))`;coin.append(edge);}
      for(const side of ['face','face back']){const face=document.createElement('span');face.className=side;const img=document.createElement('img');img.alt='';img.src=art;face.append(img);coin.append(face);}
      home.append(coin);root.querySelector('.home-group').append(home);
    }
  }
  customElements.define('astra-footer', AstraFooter);
})();
