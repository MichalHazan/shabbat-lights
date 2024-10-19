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
        "/",
      ]);
    })
  );
});

this.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      if (resp) {
        return resp;
      }
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [cacheData];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);  // Delete old caches
            }
          })
        );
      })
    );
  });
