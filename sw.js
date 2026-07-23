// Service worker for the Bliss Tactile Symbol Designer web app.
// Bump CACHE_NAME when deploying changes to any file in SHELL — the activate
// handler purges old caches so clients get the new version on next load. It only
// ever goes UP, and moves only at release (in lockstep with APP_RELEASE in
// app.html and latest_app_version.json). See RELEASING.md.
const CACHE_NAME = 'bts-v7';

// The app's own shell, served over HTTP from this origin (GitHub Pages).
// The user's .scad / .json / SVGs come from the File System Access API (local
// disk) and never touch the network, so the fetch handler never sees them.
const SHELL = [
  './app.html',
  './favicon.svg',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './openscad-wasm/openscad.js',
  './openscad-wasm/openscad.fonts.js',
  './vendor/three/build/three.module.min.js',
  './vendor/three/examples/jsm/controls/TrackballControls.js',
  './vendor/three/examples/jsm/loaders/STLLoader.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Cache-first for GET requests that match our shell; fall back to network.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached ?? fetch(e.request))
  );
});
