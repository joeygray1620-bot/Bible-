const CACHE_NAME = 'brp-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './plan.json',
  './assets/icon-72.png',
  './assets/icon-144.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k))))
  );
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return resp;
    }).catch(()=> caches.match('./index.html')))
  );
});