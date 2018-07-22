const version = "1.0";
const cacheName = 'pt-${version}';

self.addEventListener('install', e => {
  console.log('ServiceWorker registerd');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/static/icons/icon.png',
        '/static/css/reset.css',
        '/static/css/style.css'
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
