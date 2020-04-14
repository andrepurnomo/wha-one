"use strict";

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = "static-cache-v1";

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  "manifest.json",
  "index.html",
  "history.html",
  "assets/js/main.js",
  "/assets/images/icon.png",
  "/assets/images/favicon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.4.0/css/bulma.css",
];

self.addEventListener("install", (evt) => {
  console.log("[ServiceWorker] Install");
  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  console.log("[ServiceWorker] Activate");
  // CODELAB: Remove previous cached data from disk.

  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  console.log("[ServiceWorker] Fetch", event.request.url);
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
