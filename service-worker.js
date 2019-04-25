var cacheName = "Marcondes-v1";
var filesToCache = [
  './',
  './index.html',
  './login.html',
  './categorias.html',
  './public/js/CriaSW.js',
  './public/js/api.js',
  'https://code.jquery.com/jquery-3.3.1.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
  'https://unpkg.com/sweetalert/dist/sweetalert.min.js',
  './public/css/css.css',
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
