/* SYNAPSE ENGLISH: solo se almacena la portada pública, nunca datos privados. */
const CACHE = 'synapse-campus-v1';
const ARCHIVOS_PUBLICOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ARCHIVOS_PUBLICOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(claves => Promise.all(
      claves.filter(clave => clave.startsWith('synapse-campus-') && clave !== CACHE)
        .map(clave => caches.delete(clave))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evento => {
  const solicitud = evento.request;
  const url = new URL(solicitud.url);
  if (solicitud.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith('/SYNAPSE-ENGLISH-PWA/')) return;

  if (solicitud.mode === 'navigate') {
    evento.respondWith(
      fetch(solicitud).catch(() => caches.match('./index.html'))
    );
    return;
  }

  evento.respondWith(
    caches.match(solicitud).then(guardado => guardado || fetch(solicitud))
  );
});
