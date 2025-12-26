const CACHE = "bozkurtai-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/app.html",
  "/about.html",
  "/styles.css",
  "/manifest.json",
  "/favicon.ico",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
