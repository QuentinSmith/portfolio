(() => {
  if (window.__qsSkeleton) return; window.__qsSkeleton = true;
  const st = document.createElement('style');
  st.textContent = '@keyframes qs-sk{0%{background-position:150% 0}100%{background-position:-50% 0}}';
  document.head.appendChild(st);
  const BG = 'linear-gradient(100deg,#13213F 30%,#22365F 50%,#13213F 70%)';
  const pending = (el) => el.tagName === 'VIDEO' ? el.readyState < 2 : !(el.complete && el.naturalWidth > 0);
  const done = (el) => {
    if (!el.__sk) return; const o = el.__sk; el.__sk = null;
    el.style.backgroundImage = o.bi; el.style.backgroundColor = o.bc; el.style.backgroundSize = o.bs; el.style.animation = o.an;
    el.animate && el.animate([{ opacity: 0 }, {}], { duration: 320, easing: 'ease-out' });
  };
  const arm = (el) => {
    if (el.__sk || el.__skSeen === el.currentSrc + el.getAttribute('src')) return;
    const src = el.getAttribute('src') || el.getAttribute('poster') || el.querySelector?.('source')?.getAttribute('src') || '';
    if (!src || src.includes('{{')) return;
    el.__skSeen = el.currentSrc + el.getAttribute('src');
    if (!pending(el)) return;
    setTimeout(() => show(el), 250);
  };
  const show = (el) => {
    if (el.__sk || !el.isConnected || !pending(el)) return;
    el.__sk = { bi: el.style.backgroundImage, bc: el.style.backgroundColor, bs: el.style.backgroundSize, an: el.style.animation };
    el.style.backgroundColor = '#13213F'; el.style.backgroundImage = BG; el.style.backgroundSize = '200% 100%';
    el.style.animation = 'qs-sk 1.3s ease-in-out infinite';
    const fin = () => done(el);
    if (el.tagName === 'VIDEO') { el.addEventListener('loadeddata', fin, { once: true }); el.addEventListener('error', fin, { once: true }); }
    else { el.addEventListener('load', fin, { once: true }); el.addEventListener('error', fin, { once: true }); }
  };
  const scan = (root) => { (root.querySelectorAll ? root.querySelectorAll('img,video') : []).forEach(arm); if (root.tagName === 'IMG' || root.tagName === 'VIDEO') arm(root); };
  const mo = new MutationObserver((ms) => { for (const m of ms) { if (m.type === 'attributes') arm(m.target); else m.addedNodes.forEach(n => n.nodeType === 1 && scan(n)); } });
  const start = () => { scan(document); mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] }); };
  document.body ? start() : document.addEventListener('DOMContentLoaded', start);
})();
