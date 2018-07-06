const version = "0.7";
const cacheName = 'pt-${version}';

self.addEventListener('install', e => {
  console.log('ServiceWorker registerd');
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/templates/404.html?timestamp=${timeStamp}',
        '/templates/index.html?timestamp=${timeStamp}',
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
