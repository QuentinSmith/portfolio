(() => {
  if (window.__qsTrans) return; window.__qsTrans = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const NAVY = '#0B1A3A', GOLD = '#FFC43D', Z = '2147483000';
  const ss = { get: k => { try { return sessionStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (_) {} } };
  const nameFor = (href) => {
    let n = decodeURIComponent((href.split('#')[0].split('?')[0].split('/').pop() || 'Portfolio Home.dc.html')).replace(/\.dc\.html$/, '').replace(/ - Mobile$/, '').replace(/^Case Study - /, '');
    if (n === 'Portfolio Home') n = 'Home';
    return n.replace(/[^A-Za-z0-9]+/g, '') + '.level';
  };
  // Blockout layouts in a 600×320 frame. r = room, h/v = corridor, p = pillar/cover, k = key, l = locked door. d = build order.
  const LV = [
    { n: 'HUB', s: [60, 170], g: [509, 89], b: [
      ['r', 0, 120, 120, 100, 0], ['h', 120, 158, 60, 24, 1], ['r', 180, 50, 180, 240, 2], ['p', 250, 150, 40, 40, 3],
      ['h', 360, 98, 60, 24, 3], ['h', 360, 218, 60, 24, 3], ['r', 420, 30, 180, 120, 4], ['r', 420, 180, 180, 120, 5]] },
    { n: 'GAUNTLET', s: [50, 160], g: [540, 160], b: [
      ['r', 0, 110, 100, 100, 0], ['h', 100, 148, 50, 24, 1], ['r', 150, 60, 130, 200, 2], ['p', 195, 100, 40, 24, 2], ['p', 195, 196, 40, 24, 2],
      ['h', 280, 148, 50, 24, 3], ['r', 330, 90, 110, 140, 4], ['h', 440, 148, 40, 24, 5], ['r', 480, 40, 120, 240, 6]] },
    { n: 'LOOP', s: [75, 265], g: [525, 55], b: [
      ['r', 0, 210, 150, 110, 0], ['h', 150, 253, 300, 24, 1], ['v', 63, 110, 24, 100, 1], ['r', 450, 210, 150, 110, 2], ['r', 0, 0, 150, 110, 2],
      ['p', 230, 130, 140, 60, 3], ['v', 513, 110, 24, 100, 3], ['h', 150, 43, 300, 24, 3], ['r', 450, 0, 150, 110, 4]] },
    { n: 'ARENA', s: [55, 120], g: [545, 120], b: [
      ['r', 0, 70, 110, 100, 0], ['h', 110, 108, 60, 24, 1], ['r', 170, 20, 260, 200, 2], ['p', 230, 70, 34, 34, 3], ['p', 336, 136, 34, 34, 3],
      ['v', 288, 220, 24, 40, 3], ['r', 240, 260, 120, 60, 4], ['h', 430, 108, 60, 24, 4], ['r', 490, 70, 110, 100, 5]] },
    { n: 'KEY & LOCK', s: [60, 235], g: [505, 220], b: [
      ['r', 0, 180, 120, 110, 0], ['h', 120, 223, 60, 24, 1], ['r', 180, 150, 170, 170, 2], ['v', 253, 90, 24, 60, 3], ['r', 200, 0, 130, 90, 4],
      ['k', 259, 39, 12, 12, 5], ['h', 350, 223, 60, 24, 3], ['l', 404, 219, 6, 32, 4], ['r', 410, 120, 190, 200, 5]] },
  ];
  const pick = (fromExit) => {
    const last = +ss.get('qs-lvl');
    if (fromExit && !isNaN(last) && LV[last]) return last;
    let i; do { i = Math.floor(Math.random() * LV.length); } while (LV.length > 1 && i === last);
    ss.set('qs-lvl', String(i)); return i;
  };
  const css = (el, s) => { el.style.cssText = s; return el; };
  const mk = (tag = 'div') => document.createElement(tag);
  const build = (li) => {
    const L = LV[li];
    const o = css(mk(), `position:fixed;inset:0;z-index:${Z};background:${NAVY};pointer-events:all;overflow:hidden;will-change:transform;contain:strict`);
    o.setAttribute('aria-hidden', 'true'); o.dataset.qsTrans = '';
    const grid = css(mk(), 'position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px);background-size:40px 40px');
    const cover = css(mk(), `position:absolute;inset:0;background:${NAVY};will-change:transform`);
    const sc = Math.min(1, (innerWidth - 80) / 600, (innerHeight - 200) / 320);
    const frame = css(mk(), `position:absolute;left:50%;top:50%;width:600px;height:320px;margin:-160px 0 0 -300px;transform:scale(${sc})`);
    const parts = L.b.map(([t, x, y, w, h, d]) => {
      let s = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;box-sizing:border-box;will-change:transform,opacity;`;
      if (t === 'r') s += `background:rgba(255,196,61,.06);border:2px solid ${GOLD}`;
      else if (t === 'h') s += `background:rgba(255,196,61,.16);border-top:2px solid ${GOLD};border-bottom:2px solid ${GOLD}`;
      else if (t === 'v') s += `background:rgba(255,196,61,.16);border-left:2px solid ${GOLD};border-right:2px solid ${GOLD}`;
      else if (t === 'p') s += 'background:rgba(255,196,61,.32)';
      else if (t === 'k') s += `background:${GOLD};border-radius:50%`;
      else if (t === 'l') s += 'background:#FF5A5A';
      const el = css(mk(), s); frame.appendChild(el); return { el, d };
    });
    const maxD = Math.max(...L.b.map(b => b[5]));
    const start = css(mk(), `position:absolute;left:${L.s[0] - 16}px;top:${L.s[1] - 16}px;width:32px;height:32px;border-radius:50%;border:2px solid ${GOLD};box-sizing:border-box`);
    const goal = css(mk(), `position:absolute;left:${L.g[0] - 9}px;top:${L.g[1] - 9}px;width:18px;height:18px;background:${GOLD};transform:rotate(45deg)`);
    frame.append(start, goal);
    const line = css(mk(), "position:absolute;left:48px;bottom:44px;display:flex;flex-direction:column;gap:10px;font:500 15px 'JetBrains Mono',ui-monospace,monospace;color:#C9D1E0;letter-spacing:.02em;white-space:nowrap");
    const txt = mk(); const pct = mk('span'); pct.style.color = GOLD;
    const tag = css(mk(), "font:600 11px 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.14em;color:#8E9AB3");
    tag.textContent = `LAYOUT · ${L.n}`;
    const bar = css(mk(), 'width:260px;height:3px;background:rgba(255,255,255,.12);overflow:hidden');
    const fill = css(mk(), `height:100%;width:100%;background:${GOLD};transform-origin:left;transform:scaleX(0);will-change:transform`); bar.appendChild(fill);
    line.append(tag, txt, bar);
    o.append(grid, cover, frame, line);
    return { o, cover, parts, maxD, extras: [start, goal], txt, pct, fill, line };
  };
  const label = (v, name) => { v.txt.innerHTML = `<span style="color:${GOLD}">&gt;</span> Compiling <span style="color:#F2F4F8">${name}</span>… `; v.txt.appendChild(v.pct); };
  const setPct = (v, p) => { v.pct.textContent = p + '%'; v.fill.style.transform = `scaleX(${p / 100})`; };
  const count = (v, from, ms, to = 100) => new Promise(res => { const t0 = performance.now(); const step = (t) => { const k = Math.min(1, (t - t0) / ms); v.p = from + (to - from) * k; setPct(v, Math.round(v.p)); if (k < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
  // Stall: compositor-driven bar + pulse so it stays smooth while the next page is busy building; number moves in coarse steps.
  const creep = (v) => {
    const bar = v.fill.animate([{ transform: `scaleX(${v.p / 100})` }, { transform: 'scaleX(.99)' }], { duration: 4000, easing: 'cubic-bezier(.1,.6,.3,1)', fill: 'forwards' });
    const pulse = v.extras[1].animate([{ transform: 'rotate(45deg) scale(1)', opacity: 1 }, { transform: 'rotate(45deg) scale(1.35)', opacity: .55 }, { transform: 'rotate(45deg) scale(1)', opacity: 1 }], { duration: 900, iterations: Infinity, easing: 'ease-in-out' });
    const ts = [[500, 95], [1500, 97], [2800, 99]].map(([t, p]) => setTimeout(() => { if (p > v.p) { v.p = p; v.pct.textContent = p + '%'; } }, t));
    return () => { ts.forEach(clearTimeout); const cur = getComputedStyle(v.fill).transform; bar.cancel(); pulse.cancel(); v.fill.style.transform = cur && cur !== 'none' ? cur : `scaleX(${v.p / 100})`; };
  };
  const snapIn = (v, dur) => {
    v.cover.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }], { duration: dur * .45, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'both' });
    const span = dur * .5 / Math.max(1, v.maxD);
    v.parts.forEach(r => r.el.animate([{ opacity: 0, transform: 'scale(1.12)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 120, delay: dur * .2 + r.d * span, easing: 'steps(3,end)', fill: 'both' }));
    v.extras.forEach((e, i) => e.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, delay: dur * .72 + i * 40, fill: 'both' }));
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    const href = a.getAttribute('href') || '';
    if ((a.getAttribute('target') || '') === '_blank' || !/\.dc\.html(#|\?|$)/.test(href)) return;
    e.preventDefault();
    const DUR = 700, v = build(pick(false));
    label(v, nameFor(href)); setPct(v, 0);
    document.documentElement.appendChild(v.o);
    v.o.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, fill: 'both' });
    snapIn(v, DUR); count(v, 0, DUR - 60, 90);
    ss.set('qs-trans', String(Date.now()));
    const dest = new URL(href, location.href).href;
    setTimeout(() => { location.href = dest; }, DUR + 40);
  });

  // Hold the overlay until the page has streamed, hydrated and gone quiet, then reveal with transform-only motion.
  const settled = (cap) => new Promise(res => {
    const t0 = performance.now(); let calm = 0, last = performance.now();
    const tick = (t) => {
      const gap = t - last; last = t;
      const ready = document.querySelector('[data-screen-label]') && document.readyState === 'complete';
      calm = ready && gap < 24 ? calm + 1 : 0;
      if (calm >= 6 || t - t0 > cap) res(); else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const enter = async (fast) => {
    const fromExit = !fast && Date.now() - (+ss.get('qs-trans') || 0) < 4000;
    ss.set('qs-trans', '0');
    const DUR = fast ? 380 : 700, v = build(pick(fromExit));
    label(v, nameFor(location.pathname));
    v.p = fast ? 100 : fromExit ? 90 : 0; setPct(v, v.p);
    document.documentElement.appendChild(v.o);
    const wait = Promise.all([settled(fast ? 900 : 4000), document.fonts ? document.fonts.ready.catch(() => {}) : 0]);
    if (!fast) {
      if (!fromExit) { snapIn(v, DUR); await count(v, 0, DUR - 60, 90); }
      const stop = creep(v); await wait; stop();
      await count(v, v.p, 160);
      await new Promise(r => setTimeout(r, 120));
    } else await wait;
    v.parts.forEach(r => r.el.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.9)' }], { duration: DUR * .22, delay: (v.maxD - r.d) * DUR * .025, easing: 'steps(2,end)', fill: 'both' }));
    v.extras.forEach(x => x.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: 'both' }));
    v.line.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'both' });
    v.o.style.pointerEvents = 'none';
    const an = v.o.animate([{ transform: 'translateY(0)' }, { transform: fast ? 'translateY(100%)' : 'translateY(-100%)' }], { duration: DUR * .55, delay: DUR * .2, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'both' });
    setTimeout(() => stagger(fast), DUR * .5);
    an.onfinish = () => v.o.remove();
  };
  const inView = (el) => { const cs = getComputedStyle(el); if (cs.position === 'fixed' || cs.display === 'none') return false; const r = el.getBoundingClientRect(); return r.height > 0 && r.top < innerHeight && r.bottom > 0; };
  const stagger = (fast) => {
    const root = document.querySelector('[data-screen-label]'); if (!root) return;
    let t = [...root.children].filter(inView);
    if (t.length === 1 && t[0].children.length > 1) t = [...t[0].children].filter(inView);
    t.slice(0, 6).forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
      { duration: fast ? 220 : 360, delay: i * (fast ? 40 : 70), easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
  };
  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  enter(!!nav && nav.type === 'back_forward');
  addEventListener('pageshow', (e) => { if (e.persisted) { document.querySelectorAll('[data-qs-trans]').forEach(n => n.remove()); enter(true); } });
})();

(() => {
  if (window.__qsKonami) return; window.__qsKonami = true;
  const SEQ = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
  let i = 0;
  addEventListener('keydown', (e) => {
    const tg = e.target; if (tg && (tg.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(tg.tagName))) return;
    const k = (e.key || '').toLowerCase();
    i = k === SEQ[i] ? i + 1 : (k === SEQ[0] ? 1 : 0);
    if (i < SEQ.length) return;
    i = 0;
    if (window.QSAch) { QSAch.unlock('noclip'); QSAch.route('konami'); }
    if (/404(\.dc)?\.html/.test(location.pathname)) return;
    const toast = document.createElement('div');
    toast.textContent = 'NOCLIP ENABLED';
    toast.style.cssText = "position:fixed;left:50%;top:40%;z-index:2147483001;transform:translate(-50%,-50%);padding:14px 26px;background:#0B1424;border:2px solid #FFC43D;color:#FFC43D;font:700 22px 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.2em;box-shadow:0 20px 60px rgba(0,0,0,.6);pointer-events:none";
    document.documentElement.appendChild(toast);
    toast.animate([{ opacity: 0, transform: 'translate(-50%,-50%) scale(1.4)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
    setTimeout(() => { const a = document.createElement('a'); a.href = '404.dc.html'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => toast.remove(), 1500); }, 650);
  });
})();
