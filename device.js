(() => {
  // Decides desktop vs mobile once per visit, then routes to the matching page.
  // Desktop pages never change; they only gain this one script. Mobile pages live in their own files.
  if (window.QSDevice) return;
  const MAP = {
    'Portfolio Home.dc.html': 'Portfolio Home - Mobile.dc.html',
    'Work.dc.html': 'Work - Mobile.dc.html',
    'About.dc.html': 'About - Mobile.dc.html',
    'Resume.dc.html': 'Resume - Mobile.dc.html',
    '404.dc.html': '404 - Mobile.dc.html',
    'Case Study - Insanitation.dc.html': 'Case Study - Insanitation - Mobile.dc.html',
    'Case Study - Oinkyuza.dc.html': 'Case Study - Oinkyuza - Mobile.dc.html',
    'Case Study - A-B Factory.dc.html': 'Case Study - A-B Factory - Mobile.dc.html',
    'Case Study - Free Rider.dc.html': 'Case Study - Free Rider - Mobile.dc.html',
    'Case Study - Night Forest.dc.html': 'Case Study - Night Forest - Mobile.dc.html',
    'Case Study - Endless Nightmare.dc.html': 'Case Study - Endless Nightmare - Mobile.dc.html',
  };
  const REV = Object.fromEntries(Object.entries(MAP).map(([d, m]) => [m, d]));
  const file = decodeURIComponent(location.pathname.split('/').pop() || 'Portfolio Home.dc.html');
  const q = new URLSearchParams(location.search);
  const ss = { get: k => { try { return sessionStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (_) {} } };
  const detect = () => {
    const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1;
    const short = Math.min(screen.width, screen.height), long = Math.max(screen.width, screen.height);
    return touch && short <= 1024 && long <= 1400 ? 'mobile' : 'desktop';
  };
  let mode;
  const forced = q.get('device');
  if (forced === 'mobile' || forced === 'desktop') { mode = forced; window.name = 'qs-device:' + forced; } // preview frames: per-frame, never touches the visit's choice
  else if (/^qs-device:(mobile|desktop)$/.test(window.name)) mode = window.name.split(':')[1];
  else { mode = ss.get('qs-device'); if (mode !== 'mobile' && mode !== 'desktop') { mode = detect(); ss.set('qs-device', mode); } }
  window.QSDevice = { mode, isMobile: mode === 'mobile', MAP, REV, href: (desk) => mode === 'mobile' && MAP[desk] ? MAP[desk] : desk };
  document.documentElement.dataset.device = mode;
  const go = (target) => { const keep = new URLSearchParams(location.search); keep.delete('device'); const s = keep.toString(); location.replace(encodeURI(target) + (s ? '?' + s : '') + location.hash); };
  if (mode === 'mobile' && MAP[file]) go(MAP[file]);
  else if (mode === 'desktop' && REV[file]) go(REV[file]);
  // Desktop pages reflow from 1440px up; narrower windows scale the 1440 layout down to fit
  if (mode === 'desktop') {
    const MIN = 1440, de = document.documentElement; let sb = 0;
    const fit = () => {
      const z = parseFloat(de.style.zoom) || 1;
      if (z === 1) sb = Math.max(0, innerWidth - de.clientWidth);
      const w = innerWidth - sb, nz = w < MIN ? w / MIN : 1;
      if (Math.abs(nz - z) > .002) de.style.zoom = nz < 1 ? String(nz) : '';
    };
    fit(); addEventListener('resize', fit); addEventListener('load', fit);
  }
  // Recruiter mode (per visit): hides [data-flair] game flair, reveals [data-recruit] summaries; pages listen for 'qs-recruiter'
  const RK = 'qs-recruiter', hde = document.documentElement;
  const rst = document.createElement('style');
  rst.textContent = 'html[data-recruiter] [data-flair]{display:none !important}html:not([data-recruiter]) [data-recruit]{display:none !important}';
  (document.head || hde).appendChild(rst);
  const applyR = (on) => { if (on) hde.dataset.recruiter = '1'; else delete hde.dataset.recruiter; };
  // per-window value; preview frames (?qs-preview) keep their own setting instead of sharing the tab's sessionStorage
  const rq = q.get('recruiter'), isolated = q.has('qs-preview') && (rq === '1' || rq === '0');
  if (!isolated && (rq === '1' || rq === '0')) ss.set(RK, rq);
  let rOn = isolated ? rq === '1' : ss.get(RK) === '1';
  window.QSRecruiter = { get on() { return rOn; }, set(v) { rOn = !!v; if (!isolated) ss.set(RK, rOn ? '1' : '0'); applyR(rOn); dispatchEvent(new CustomEvent('qs-recruiter', { detail: rOn })); } };
  applyR(rOn);
  // Session cache (sw.js): only on the published site, never in the editor preview or local dev
  const live = 'serviceWorker' in navigator && location.protocol === 'https:' && !/claudeusercontent|localhost|127\.0\.0\.1/.test(location.hostname);
  if (live) {
    const base = location.pathname.replace(/[^/]*$/, '');
    navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(() => {});
    const send = (type) => { const c = navigator.serviceWorker.controller; if (c) c.postMessage({ type }); };
    const IDLE = 5 * 60 * 1000; let last = Date.now(), pinged = 0, idleT;
    const arm = () => { clearTimeout(idleT); idleT = setTimeout(() => send('clear'), IDLE); };
    const active = () => { last = Date.now(); arm(); if (last - pinged > 30000) { pinged = last; send('ping'); } };
    ['pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart', 'mousemove'].forEach(ev => addEventListener(ev, active, { passive: true, capture: true }));
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { if (Date.now() - last > IDLE) send('clear'); active(); } });
    addEventListener('pagehide', () => send('bye'));
    arm();
  }
})();
