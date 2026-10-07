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
})();
