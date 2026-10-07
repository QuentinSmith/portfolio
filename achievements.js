(() => {
  if (window.QSAch) return;
  if (window.QSDevice && window.QSDevice.isMobile) { // achievements are desktop-only
    const noop = () => {}; window.QSAch = new Proxy({}, { get: (_, k) => k === 'isStub' ? true : (k === 'state' || k === 'all' ? [] : noop) }); return;
  }
  const K = 'qs-ach', KP = 'qs-ach-progress', KQ = 'qs-ach-pending', KS = 'qs-ach-sound';
  const C = { g: '#FFC43D', d: '#B8860B', w: '#F2F4F8', r: '#FF5A5A', n: '#0B1424', b: '#5BC8FF', t: '#3FD3A0', o: '#C8823C', k: '#2B3550' };
  // 8×8 pixel badges
  const PX = {
    cases:   ['..ggg...', '.g...g..', 'g.ww..g.', 'g.w...g.', 'g.....g.', '.g...g..', '..gggdd.', '......dd'],
    oob:     ['..gggg..', '.gg..gg.', '.....gg.', '....gg..', '...gg...', '...gg...', '........', '...gg...'],
    resume:  ['.wwwww..', '.w...ww.', '.w.gg.w.', '.w....w.', '.w.ggg w', '.w....w.', '.w.gg.w.', '.wwwwww.'],
    bug:     ['r......r', '.r.rr.r.', '..rrrr..', 'rrrwwrrr', '..rrrr..', 'rrrrrrrr', '..rrrr..', '.r....r.'],
    tutorial:['g.......', 'gwwww...', 'gwwwwww.', 'gwwww...', 'g.......', 'g.......', 'g.......', 'ggg.....'],
    level:   ['gg.gg.gg', 'gg.gg.gg', '........', 'gg.ww.gg', 'gg.ww.gg', '........', 'gg.gg.gg', 'gg.gg.gg'],
    lore:    ['........', '.gggggg.', '.gwwwwg.', '.gw..wg.', '.gwwwwg.', '.gw..wg.', '.gggggg.', '........'],
    patch:   ['........', '.ggg.ww.', 'gggggggg', 'g......g', 'g.wwww.g', 'g......g', 'gggggggg', '........'],
    hotkeys: ['.wwwwww.', 'w......w', 'w.gggg.w', 'w.g..g.w', 'w.g.gg.w', 'w.gggg.w', 'w......w', '.wwwwww.'],
    fairy:   ['...g....', '...g....', '..ggg...', 'gggwggg.', '..ggg...', '...g....', '...g....', '........'],
    noclip:  ['..wwww..', '.wwwwww.', 'wwnwwnww', 'wwwwwwww', 'wwwwwwww', 'wwwwwwww', 'wwwwwwww', 'w.ww.ww.'],
    allroutes:['...ww...', '...ww...', '...ww...', '........', 'ggg..ggg', 'ggg..ggg', '...kk...', '...kk...'],
    quest:   ['...gg...', '...gg...', '...gg...', '...gg...', '...gg...', '........', '...gg...', '...gg...'],
    cat:     ['o.....o.', 'oo...oo.', 'ooooooo.', 'onoooon.', 'ooowooo.', '.ooooo..', '..o.o...', '........'],
    survived:['.rr.rr..', 'rrrrrrr.', 'rrwrrrr.', 'rrrrrrr.', '.rrrrr..', '..rrr...', '...r....', '........'],
    debt:    ['..gggg..', '.g....g.', 'g.w..w.g', 'g..ww..g', 'g.wwww.g', 'g..ww..g', '.g....g.', '..gggg..'],
    wishlist:['...g....', '...g....', '..ggg...', 'ggggggg.', '.ggggg..', '..g.g...', '.g...g..', '........'],
    trophy:  ['gggggggg', 'g.gggg.g', 'g.gggg.g', '.gggggg.', '..gggg..', '...gg...', '..gggg..', '.gggggg.'],
  };
  const LIST = [
    { id: 'cases', name: 'Case Closed', desc: 'View all six case studies.', icon: 'cases', rarity: 18.2, goal: 6 },
    { id: 'oob', name: '???', desc: 'Find ???', icon: 'oob', rarity: 9.6 },
    { id: 'resume', name: 'Paper Trail', desc: 'Download the resume.', icon: 'resume', rarity: 31.4 },
    { id: 'bug', name: 'First Bug Report', desc: 'File your first bug report.', icon: 'bug', rarity: 7.1 },
    { id: 'tutorial', name: 'Tutorial Complete', desc: 'Read the homepage all the way to the bottom.', icon: 'tutorial', rarity: 64.0 },
    { id: 'level', name: 'Level Select', desc: 'Open the Work page.', icon: 'level', rarity: 72.5 },
    { id: 'lore', name: 'Lore Hunter', desc: 'Read the About page.', icon: 'lore', rarity: 41.3 },
    { id: 'patch', name: 'Patch Notes', desc: 'Open every tab on the Insanitation case study.', icon: 'patch', rarity: 12.8, goal: 5 },
    { id: 'hotkeys', name: 'Hotkeys', desc: 'Switch tabs with the Q and E keys.', icon: 'hotkeys', rarity: 5.9 },
    { id: 'fairy', name: 'Follow the Fairy', desc: 'Click the Objective companion.', icon: 'fairy', rarity: 22.7 },
    { id: 'noclip', name: 'Noclip', desc: 'Enter the Konami code.', icon: 'noclip', rarity: 3.4, hidden: true },
    { id: 'allroutes', name: 'Out of Bounds', desc: 'Find all five ways off the map.', icon: 'allroutes', rarity: 0.8, hidden: true, goal: 5 },
    { id: 'quest', name: 'Quest Giver', desc: 'Accept the optional objective.', icon: 'quest', rarity: 6.2, hidden: true },
    { id: 'cat', name: 'Cat Spotted', desc: 'Catch the flying pillow cat.', icon: 'cat', rarity: 2.1, hidden: true },
    { id: 'survived', name: 'Survived', desc: 'Make it to the end of Endless Nightmare.', icon: 'survived', rarity: 15.6, hidden: true },
    { id: 'debt', name: 'Debt Collector', desc: 'Fill the Wolf’s Ledger on Oinkyuza.', icon: 'debt', rarity: 11.9, hidden: true },
    { id: 'wishlist', name: 'Wishlisted', desc: 'Open Insanitation on Steam.', icon: 'wishlist', rarity: 19.3 },
    { id: 'complete', name: 'Completionist', desc: 'Unlock every other achievement.', icon: 'trophy', rarity: 0.3 },
  ];
  const ls = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (_) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} } };
  const byId = Object.fromEntries(LIST.map(a => [a.id, a]));
  const emit = () => dispatchEvent(new CustomEvent('qs-ach-change'));
  const svg = (icon, size) => { const m = PX[icon] || PX.trophy; let r = ''; m.forEach((row, y) => [...row.padEnd(8, '.')].slice(0, 8).forEach((ch, x) => { if (C[ch]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${C[ch]}"/>`; })); return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`; };

  let audio;
  const chime = () => {
    if (ls.get(KS, false) !== true) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t = audio.currentTime;
      [[880, 0], [1318.5, .09]].forEach(([f, d]) => { const o = audio.createOscillator(), g = audio.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(.08, t + d + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d + .5); o.connect(g).connect(audio.destination); o.start(t + d); o.stop(t + d + .55); });
    } catch (_) {}
  };

  // toast queue (bottom right). Pending survives navigation so a toast cut off by a page change shows on the next page.
  let showing = false;
  const queue = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pump = () => {
    if (showing || !queue.length || !document.body) return;
    showing = true;
    const id = queue.shift(), a = byId[id];
    const el = document.createElement('div');
    el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    el.style.cssText = "position:fixed;right:24px;bottom:24px;z-index:2147483002;width:360px;display:flex;align-items:center;gap:14px;padding:12px 16px 12px 12px;box-sizing:border-box;background:linear-gradient(180deg,#14234A,#0B1424);border:1px solid rgba(255,196,61,.55);box-shadow:0 18px 50px rgba(0,0,0,.55);font-family:'Instrument Sans',system-ui,sans-serif;color:#F2F4F8;cursor:pointer";
    el.innerHTML = `<span style="flex:0 0 56px;height:56px;display:grid;place-items:center;background:#0B1424;border:1px solid rgba(255,196,61,.4)">${svg(a.icon, 40)}</span>
      <span style="display:flex;flex-direction:column;gap:3px;min-width:0">
        <span style="font:700 11px 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.14em;color:#FFC43D">ACHIEVEMENT UNLOCKED</span>
        <span style="font:700 18px/1.1 'Chakra Petch',system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#FFFFFF">${a.name}</span>
        <span style="font:400 13px/1.35 'Instrument Sans',system-ui,sans-serif;color:#AEB8CC">${a.desc}</span>
      </span>`;
    el.title = 'View achievements';
    el.addEventListener('click', () => { const l = document.createElement('a'); l.href = 'Achievements.dc.html'; document.body.appendChild(l); l.click(); l.remove(); });
    document.documentElement.appendChild(el);
    chime();
    if (!reduced) el.animate([{ transform: 'translate(40px,20px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
    setTimeout(() => ls.set(KQ, ls.get(KQ, []).filter(x => x !== id)), 1400);
    setTimeout(() => {
      const done = () => { el.remove(); showing = false; setTimeout(pump, 250); };
      if (reduced) return done();
      el.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(60px)', opacity: 0 }], { duration: 320, easing: 'ease-in', fill: 'forwards' }).onfinish = done;
    }, 4600);
  };

  const QSAch = {
    LIST, PX, COLORS: C, svg,
    state: () => ls.get(K, {}),
    progress: () => ls.get(KP, {}),
    has: (id) => !!ls.get(K, {})[id],
    unlock(id) {
      if (!byId[id] || /[?&]qs-preview/.test(location.search)) return;
      const s = ls.get(K, {}); if (s[id]) return;
      s[id] = Date.now(); ls.set(K, s);
      ls.set(KQ, [...ls.get(KQ, []), id]);
      queue.push(id); pump(); emit();
      if (id !== 'complete' && LIST.every(a => a.id === 'complete' || s[a.id])) setTimeout(() => QSAch.unlock('complete'), 400);
    },
    track(key, item, goal, id) {
      if (/[?&]qs-preview/.test(location.search)) return;
      const p = ls.get(KP, {}); const set = new Set(p[key] || []);
      if (!set.has(item)) { set.add(item); p[key] = [...set]; ls.set(KP, p); emit(); }
      if (set.size >= goal) QSAch.unlock(id || key);
    },
    route(r) { QSAch.track('allroutes', r, 5); },
    sound: (on) => { if (on === undefined) return ls.get(KS, false) === true; ls.set(KS, !!on); emit(); },
    reset() { [K, KP, KQ].forEach(k => { try { localStorage.removeItem(k); } catch (_) {} }); emit(); },
  };
  window.QSAch = QSAch;

  // page-level triggers
  const page = decodeURIComponent(location.pathname.split('/').pop() || 'Portfolio Home.dc.html');
  const CASES = { 'Case Study - Insanitation.dc.html': 'ins', 'Case Study - Free Rider.dc.html': 'fr', 'Case Study - Oinkyuza.dc.html': 'oink', 'Case Study - A-B Factory.dc.html': 'ab', 'Case Study - Night Forest.dc.html': 'nf', 'Case Study - Endless Nightmare.dc.html': 'en' };
  try { if (/\.dc\.html$/.test(location.pathname)) localStorage.setItem('qs-site-root', location.pathname.replace(/[^/]*$/, '')); } catch (_) {}
  const start = () => {
    ls.get(KQ, []).forEach(id => { if (!queue.includes(id)) queue.push(id); });
    if (CASES[page]) QSAch.track('cases', CASES[page], 6);
    if (page === 'Work.dc.html') QSAch.unlock('level');
    if (page === '404.dc.html') QSAch.unlock('oob');
    setTimeout(pump, 900);
  };
  document.body ? start() : addEventListener('DOMContentLoaded', start);
  addEventListener('scroll', () => {
    const d = document.scrollingElement || document.documentElement, f = (d.scrollTop + innerHeight) / d.scrollHeight;
    if ((page === 'Portfolio Home.dc.html' || page === '' || page === 'index.html') && f > .97) QSAch.unlock('tutorial');
    if (page === 'About.dc.html' && f > .7) QSAch.unlock('lore');
  }, { passive: true, capture: true });
  addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    const href = a.getAttribute('href') || '';
    if (/\.pdf(\?|#|$)/i.test(href)) QSAch.unlock('resume');
    if (/store\.steampowered\.com/.test(href)) QSAch.unlock('wishlist');
    if (/(^|\/)404\.dc\.html/.test(href)) { const r = a.closest('[data-oob-route]'); QSAch.route(r ? r.dataset.oobRoute : page === 'Work.dc.html' ? 'work' : 'other'); }
  }, true);

  // site nav hotkeys: Q / E step through the main pages (case studies use Q/E for tabs and call preventDefault first)
  const ORDER = ['Portfolio Home.dc.html', 'Work.dc.html', 'About.dc.html', 'Resume.dc.html'];
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    const tg = e.target; if (tg && (tg.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(tg.tagName))) return;
    const k = (e.key || '').toLowerCase(); if (k !== 'q' && k !== 'e') return;
    const local = [...document.querySelectorAll('[data-keys-local]')].some(el => { const r = el.getBoundingClientRect(); return r.height > 0 && r.bottom > 0 && r.top < innerHeight; });
    if (local) return;
    let i = ORDER.indexOf(page); if (i < 0) i = CASES[page] ? 1 : 0;
    const next = ORDER[(i + (k === 'q' ? -1 : 1) + ORDER.length) % ORDER.length];
    const l = document.createElement('a'); l.href = next; document.body.appendChild(l); l.click(); l.remove();
  });
  dispatchEvent(new CustomEvent('qs-ach-ready'));
})();
