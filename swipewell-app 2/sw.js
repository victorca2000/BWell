// Swipewell service worker: makes the app installable and usable offline.
// The events file is always fetched fresh when online, so updating events.csv
// shows up on the next open. Bump VERSION when you change index.html.
const VERSION = 'swipewell-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const isData = /\.(csv|json)$/i.test(url.pathname) && !url.pathname.endsWith('manifest.webmanifest');
  const isPage = e.request.mode === 'navigate';
  if (isData || isPage) {
    // network first, fall back to the last copy we saw
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(isData ? url.pathname : e.request, copy)); return res;
    }).catch(() => caches.match(isData ? url.pathname : e.request).then(r => r || caches.match('index.html'))));
    return;
  }
  // everything else (icons, fonts): cache first
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && (url.origin === location.origin || url.host.includes('gstatic') || url.host.includes('googleapis'))) {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy));
    }
    return res;
  })));
});
