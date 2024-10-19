let caheData = "appV1";
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(caheData).then((cache) => {
      cache.addAll([
        "/static/js/main.chunk.js",
        "/static/js/0.chunk.js",
        "/static/js/bundle.js",
        '/index.js',
        '/'
      ]);
    })
  );
});

this.addEventListener("fetch",(event)=>{
    event.respondWith(
        caches.match(event.request).then((resp)=>{
            if (resp) {
                return resp
            }
        })
    )
})