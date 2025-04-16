// Service Worker per SOCIALPRO
const CACHE_NAME = 'socialpro-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
];

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Attivazione e pulizia cache vecchie
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Strategia Cache First, poi Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - ritorna la risposta dalla cache
        if (response) {
          return response;
        }

        // Altrimenti, recupera dalla rete
        return fetch(event.request)
          .then((response) => {
            // Se la richiesta fallisce o non è valida, restituisci la risposta
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la risposta perché va consumata solo una volta
            const responseToCache = response.clone();

            // Salva in cache la risposta per usi futuri
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Escludi le API e altre risorse che non devono essere in cache
                if (event.request.url.indexOf('/api/') === -1) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // Se offline e richiedi una pagina, ritorna la homepage
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Per immagini, usa un'immagine di fallback
            if (event.request.destination === 'image') {
              return caches.match('/placeholder.png');
            }
          });
      })
  );
});

// Gestione aggiornamenti in background
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 