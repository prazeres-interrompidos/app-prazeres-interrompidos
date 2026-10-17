const CACHE = 'prazeres-app-shell-v15';
const SHELL = ['./', './index.html', './styles.css?v=5', './app.js?v=13', './manifest.webmanifest?v=9', './assets/app-icon-192-v9.png', './assets/app-icon-512-v9.png', './assets/favicon-v9.png', './assets/logo-prazeres.jpg', './assets/logo-192.png', './assets/logo-apple.png?v=4'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('prazeres-app-shell-') && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Refresh installation metadata and icons even when an older URL is reused.
  if (url.pathname.endsWith('/manifest.webmanifest') || /\/assets\/.*\.(png|jpg|svg)$/.test(url.pathname)) {
    event.respondWith(fetch(request, { cache: 'no-cache' }).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request)));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request, { cache: 'no-cache' }).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put('./index.html', copy));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
