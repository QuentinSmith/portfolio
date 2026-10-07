// Session cache: everything the visitor loads is kept, so revisiting a page or asset never hits the network again.
// The cache is wiped after 5 minutes of inactivity, or when the visitor closes the site (last tab/browser).
const CACHE = 'qs-session-v1';
const IDLE = 5 * 60 * 1000;   // 5 min without activity
const GONE = 15 * 1000;       // no page open for 15s after the last one closed = visitor left
const META = '/__qs-meta';
let meta = null;              // { seen, bye }

const loadMeta = async () => {
  if (meta) return meta;
  try { const r = await (await caches.open(CACHE + '-meta')).match(META); meta = r ? await r.json() : { seen: 0, bye: 0 }; }
  catch (_) { meta = { seen: 0, bye: 0 }; }
  return meta;
};
const saveMeta = async () => { try { await (await caches.open(CACHE + '-meta')).put(META, new Response(JSON.stringify(meta))); } catch (_) {} };
const purge = async () => { await caches.delete(CACHE); };

// Before serving anything, decide whether the last session is over
const checkSession = async () => {
  const m = await loadMeta(), now = Date.now();
  const idle = m.seen && now - m.seen > IDLE;
  const left = m.bye && m.bye >= m.seen && now - m.bye > GONE;
  if (idle || left) await purge();
  m.seen = now; m.bye = 0; await saveMeta();
};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('message', (e) => {
  const t = e.data && e.data.type;
  if (t === 'ping') e.waitUntil(loadMeta().then(m => { m.seen = Date.now(); m.bye = 0; return saveMeta(); }));
  else if (t === 'clear') e.waitUntil(purge());
  else if (t === 'bye') e.waitUntil((async () => {
    const open = await self.clients.matchAll({ type: 'window' });
    if (open.length > 1) return;          // other tabs still open
    const m = await loadMeta(); m.bye = Date.now(); await saveMeta();
  })());
});

const cacheable = (req, url) => {
  if (req.method !== 'GET' || req.headers.has('range')) return false;   // videos stream with range requests; leave them to the browser
  if (/\.(mp4|webm|m3u8|ts|m4s)(\?|$)/i.test(url.pathname)) return false;
  if (url.origin === self.location.origin) return !url.pathname.endsWith('/sw.js');
  return /(^|\.)fonts\.(googleapis|gstatic)\.com$|(^|\.)cdn\.jsdelivr\.net$/.test(url.hostname);
};

self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (!cacheable(req, url)) return;
  e.respondWith((async () => {
    if (req.mode === 'navigate') await checkSession();
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()).catch(() => {});
    return res;
  })().catch(() => fetch(req)));
});
