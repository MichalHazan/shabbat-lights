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
        "/",
      ]);
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    if (event.request.url === "http://localhost:3000/static/js/main.chunk.js") {
      event.waitUntil(
        this.registration.showNotification("Internet", {
          body: "internet not working",
        })
      );
    }
    event.respondWith(
      caches.match(event.request).then((resp) => {
        if (resp) {
          return resp;
        }
        let requestUrl = event.request.clone();
        fetch(requestUrl);
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
