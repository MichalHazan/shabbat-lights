// Cache name
const CACHE_NAME = 'appV1';

// List of resources to cache
const urlsToCache = [
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/index.js',
  '/manifest.json',
  '/favicon.ico',
  '/static/css/main.6a39032e.css',
  '/static/media/candle.5740c5b52047ffcc8060.png',
  '/data/torahportions.csv',
  '/static/css/main.chunk.css',
  '/static/media/material-icons.woff2',
  '/static/media/ShmulikCLM.31d6cfe0d16ae931b73c.ttf',
  '/static/media/bricks.d02e151511ab06810ccf.jpeg',
  '/sounds/cartoon-game-upgrade-ni-sound.mp3',
  '/sounds/bubble-pop-ding-betacut.mp3',
  '/sounds/cuckoo-9-94258.mp3',
  '/sounds/shalomAleichem.mp3',
  '/sounds/sound1.mp3',
  '/sounds/sound2.mp3',
  '/sounds/sound3.mp3',
  '/sounds/sound4.mp3',
  '/sounds/sound5.mp3',
  '/sounds/sound6.mp3',
  '/sounds/sound7.mp3',
  '/sounds/level-complete-mobile-game-app-locran-1-00-06.mp3',
  '/',
];

// Install event handler
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Failed to cache resources:', err);
      })
  );
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If fetch fails (offline), return a custom offline page or message
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html') || new Response(
                'You are offline. Please check your internet connection.',
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({
                    'Content-Type': 'text/plain'
                  })
                }
              );
            }
          });
      })
  );
});

// Activate event handler
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});