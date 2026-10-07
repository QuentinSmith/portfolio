(() => {
  if (window.__insFx) return; window.__insFx = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = '#2E2A33', CREAM = '#FFF6DE';

  // ---------- sound (synthesized, off by default) ----------
  let on = false; try { on = localStorage.getItem('ins-sfx') === '1'; } catch (_) {}
  let ac = null;
  const ctx = () => (ac = ac || new (window.AudioContext || window.webkitAudioContext)());
  const tone = (f0, f1, dur, type = 'sine', vol = .12, delay = 0) => {
    if (!on) return; const a = ctx(), t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .02);
  };
  const SFX = {
    squeak: () => { tone(1400, 2200, .07, 'triangle', .08); tone(2100, 1600, .06, 'triangle', .06, .06); },
    boop: () => tone(520, 380, .09, 'sine', .05),
    meow: () => { if (!on) return; const a = ctx(), t = a.currentTime, o = a.createOscillator(), g = a.createGain(), fl = a.createBiquadFilter();
      o.type = 'sawtooth'; fl.type = 'bandpass'; fl.Q.value = 6;
      o.frequency.setValueAtTime(520, t); o.frequency.linearRampToValueAtTime(820, t + .12); o.frequency.linearRampToValueAtTime(460, t + .45);
      fl.frequency.setValueAtTime(900, t); fl.frequency.linearRampToValueAtTime(1800, t + .15); fl.frequency.linearRampToValueAtTime(700, t + .45);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
      o.connect(fl).connect(g).connect(a.destination); o.start(t); o.stop(t + .55); },
  };

  // sound toggle pill
  const pill = document.createElement('button');
  pill.type = 'button';
  pill.style.cssText = `position:fixed;right:24px;bottom:24px;z-index:60;display:flex;align-items:center;gap:10px;padding:10px 16px;background:#FFFFFF;color:${INK};border:2.5px solid ${INK};border-radius:999px;box-shadow:3px 4px 0 ${INK};font:700 14px 'Fredoka',sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer`;
  const paint = () => { pill.innerHTML = `<span style="font-size:16px;line-height:1">${on ? '♪' : '♪̸'}</span>SFX ${on ? 'on' : 'off'}`; pill.setAttribute('aria-pressed', String(on)); pill.style.background = on ? '#FFE9A8' : '#FFFFFF'; };
  pill.addEventListener('click', () => { on = !on; try { localStorage.setItem('ins-sfx', on ? '1' : '0'); } catch (_) {} paint(); if (on) { ctx().resume(); SFX.meow(); } });
  paint();
  const mountPill = () => document.body.appendChild(pill);
  document.body ? mountPill() : addEventListener('DOMContentLoaded', mountPill);

  if (reduce) return;
  const ADD = { composite: 'add' };

  // ---------- target detection ----------
  const inChrome = el => !!el.closest('nav') || el === pill;
  const isCard = el => { if (!el || el.nodeType !== 1 || el.offsetWidth <= 140 || inChrome(el)) return false; const cs = getComputedStyle(el); return cs.borderRadius.includes('/') && /\d+px \d+px 0px( 0px)?$/.test(cs.boxShadow.split(',').pop().trim()) && !/,/.test(cs.boxShadow.replace(/rgba?\([^)]*\)/g, '')); };
  const cardOf = t => { let e = t, i = 0; while (e && e.nodeType === 1 && i++ < 7) { if (isCard(e)) return e; e = e.parentElement; } return null; };
  const isBtn = el => { if (!el || inChrome(el)) return false; if (el.tagName === 'BUTTON') return true; if (el.tagName !== 'A') return false; const cs = getComputedStyle(el); const bg = cs.backgroundColor; return bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && parseFloat(cs.paddingLeft) >= 8 && el.offsetWidth < 520; };
  const btnOf = t => { const b = t.closest && t.closest('button, a[href]'); return b && isBtn(b) && !isCard(b) ? b : null; };

  // ---------- wobbly cards ----------
  const lastWob = new WeakMap();
  document.addEventListener('mouseover', (e) => {
    const c = cardOf(e.target); if (!c || (e.relatedTarget && c.contains(e.relatedTarget))) return;
    const now = performance.now(); if (now - (lastWob.get(c) || 0) < 600) return; lastWob.set(c, now);
    c.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.035,.965)' }, { transform: 'scale(.985,1.025)' }, { transform: 'scale(1.01,.992)' }, { transform: 'scale(1,1)' }],
      { duration: 460, easing: 'ease-out', ...ADD });
    SFX.boop();
  }, true);

  // ---------- button wiggles ----------
  const lastBtn = new WeakMap();
  document.addEventListener('mouseover', (e) => {
    const b = btnOf(e.target); if (!b || (e.relatedTarget && b.contains(e.relatedTarget))) return;
    const now = performance.now(); if (now - (lastBtn.get(b) || 0) < 400) return; lastBtn.set(b, now);
    b.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-3deg) scale(1.04)' }, { transform: 'rotate(2.5deg) scale(1.04)' }, { transform: 'rotate(-1.5deg) scale(1.02)' }, { transform: 'rotate(0deg)' }],
      { duration: 380, easing: 'ease-in-out', ...ADD });
  }, true);
  document.addEventListener('pointerdown', (e) => {
    const b = btnOf(e.target); if (!b) return;
    b.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.08,.88)' }, { transform: 'scale(.96,1.06)' }, { transform: 'scale(1,1)' }], { duration: 320, easing: 'ease-out', ...ADD });
    if (!/wishlist/i.test(b.textContent || '')) SFX.squeak();
  }, true);

  // ---------- fur confetti on Wishlist ----------
  const FUR = ['#C98A4B', '#E8B57A', '#8A5A33', '#F2E2C4', '#9C948C', '#3B3330'];
  const burst = (x, y) => {
    const layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147482000;overflow:hidden';
    document.body.appendChild(layer);
    let done = 0; const N = 34;
    for (let i = 0; i < N; i++) {
      const tuft = document.createElement('span');
      const w = 8 + Math.random() * 14, h = 2 + Math.random() * 3, c = FUR[i % FUR.length];
      const curl = Math.random() < .5;
      tuft.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${curl ? w * .6 : h}px;` +
        (curl ? `border:${h}px solid ${c};border-color:${c} transparent transparent transparent;border-radius:50%;box-sizing:border-box` : `background:${c};border-radius:${h}px`);
      layer.appendChild(tuft);
      const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.3, sp = 140 + Math.random() * 260;
      const dx = Math.cos(ang) * sp, dy = Math.sin(ang) * sp, rot = (Math.random() - .5) * 720, fall = 220 + Math.random() * 260;
      const a = tuft.animate([
        { transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * .7}px), calc(-50% + ${dy * .7}px)) rotate(${rot * .5}deg)`, opacity: 1, offset: .35 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + fall}px)) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards' });
      a.onfinish = () => { if (++done === N) layer.remove(); };
    }
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('a, button'); if (!b || !/wishlist/i.test(b.textContent || '')) return;
    const r = b.getBoundingClientRect(); burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2); SFX.meow();
  }, true);

  // idle nudge on the Wishlist button so it never sits dead still
  setInterval(() => {
    if (document.hidden) return;
    const b = [...document.querySelectorAll('a')].find(a => /wishlist on steam/i.test(a.textContent || '')); if (!b) return;
    const r = b.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-in-out', ...ADD });
  }, 5200);
})();
