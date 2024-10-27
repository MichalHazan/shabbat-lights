let caheData = "appV1";
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(caheData).then((cache) => {
      cache.addAll([
        "/static/js/main.chunk.js",
        "/static/js/0.chunk.js",
        "/static/js/bundle.js",
        "/index.js",
        "/manifest.json",
        "/favicon.ico",
        "/static/css/main.6a39032e.css",
        "/static/media/candle.5740c5b52047ffcc8060.png",
        "/data/torahportions.csv",
        "/static/css/main.chunk.css",
        "/static/media/material-icons.woff2",
        "/sounds",
        "/sounds/cartoon-game-upgrade-ni-sound.mp3",
        "/sounds/bubble-pop-ding-betacut.mp3",
        "/sounds/cuckoo-9-94258.mp3",
        "/sounds/shalomAleichem.mp3",
        "/sounds/level-complete-mobile-game-app-locran-1-00-06.mp3",
        "/",
      ]);
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    if (event.request.url === "http://localhost:3000/static/js/main.chunk.js") {
      this.registration.showNotification("Internet", {
        body: "Internet not working",
      });
    }
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return the cached response if found
        if (response) {
          return response;
        }
        // Attempt to fetch from the network (will fail offline)
        return fetch(event.request).catch(() => {
          // Optional: Return a generic fallback if fetch fails
          return new Response(
            "You are offline, and the requested resource is not cached.",
            {
              status: 503,
              statusText: "Service Unavailable",
            }
          );
        });
      })
    );
  }
});

// Activate event - Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [cacheData];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
