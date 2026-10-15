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
        :host{display:block;--footer-border:#d994c6;--footer-background:#211c2b;--footer-radius:22px;--footer-icon:32px}
        *{box-sizing:border-box}
        footer{border-top:1px solid #d5bad0;border-bottom:1px solid #d5bad0;background:#ffffff80;color:var(--footer-color,inherit);padding:22px 12px;overflow:visible;font:12px/1.4 system-ui,sans-serif}
        .line{display:flex;align-items:center;justify-content:center;width:100%;min-width:0;flex-wrap:wrap;gap:22px 30px;white-space:normal}
        .group{display:flex;align-items:center;justify-content:center;gap:10px;flex:0 1 auto;flex-wrap:wrap;max-width:100%;padding:5px 0}.group:nth-of-type(even){margin-top:10px}
        .group::before{content:"✦";color:#d994c6;font-size:12px;line-height:1;margin:0 .5cm}
        .title,time,.more,.home-group{display:inline-flex;align-items:center;gap:7px}
        a{display:inline-grid;place-items:center;color:inherit;width:27px;height:32px;border-radius:8px;text-decoration:none}a:hover{background:#ffffff55}a:focus-visible{outline:3px solid #d994c6;outline-offset:3px}svg{width:22px;height:22px;fill:currentColor}
        .home img{width:28px;height:28px;object-fit:contain;image-rendering:pixelated}
        slot{display:contents}::slotted([slot=status]){flex:1 0 100%;min-width:0;max-width:100%}
      </style><footer aria-label="Made by Astra — signature and links"><div class="line"><slot name="status"></slot><div class="group"><span class="title">Made by Astra</span><time></time></div><div class="group"><span class="title">Find Out More</span><span class="more"></span></div><div class="group"><span class="title">Take Me Home!</span><span class="home-group"></span></div></div></footer>`;
      const date = this.getAttribute('date') || '2026-10-14';
      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10) === date;
      const time = root.querySelector('time'); time.textContent = validDate ? date : '2026-10-14'; time.dateTime = time.textContent;
      const link = (label, href, cls='') => { const a=document.createElement('a'); a.href=href;a.title=label;a.setAttribute('aria-label',label);a.className=cls;return a; };
      for(const [key,label,url,art] of [['github','GitHub — Astra','https://github.com/findastra',github],['pole','Pole TikTok — @astra_on_fire','https://www.tiktok.com/@astra_on_fire',tiktok],['vr','VR TikTok — @findastra','https://www.tiktok.com/@findastra',tiktok]]){
        const a=link(label,safe(this.getAttribute(key),url),key);a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+art+'</svg>';root.querySelector('.more').append(a);
      }
      const home=link('The Farm — Friendly Farmer',safe(this.getAttribute('home'),base+'apps/astras-pet-apps-20261008.html'),'home');
      const art=safe(this.getAttribute('farmer'),base+'art/icons/astras-pet-os-20261012.png');
      const img=document.createElement('img');img.src=art;img.alt='';home.append(img);root.querySelector('.home-group').append(home);
    }
  }

  customElements.define('astra-footer', AstraFooter);
})();
