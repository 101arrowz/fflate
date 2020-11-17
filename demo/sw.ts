/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope & {
  __precacheManifest: ({ url: string, revision: string })[];
};

const precacheVersion = sw.__precacheManifest
  .map(p => p.revision)
  .join('');
const precacheFiles = sw.__precacheManifest.map(p => p.url).filter(
  u => /\.(ico)$/.test(u)
);

const ch = () => caches.open(precacheVersion);
 
sw.addEventListener('install', ev => {
  // Do not finish installing until every file in the app has been cached
  ev.waitUntil(
    ch().then(
      cache => cache.addAll(precacheFiles)
    )
  );
});
 
sw.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== precacheVersion).map(
        k => caches.delete(k)
      )
    )).then(() => sw.clients.claim())
  );
});

sw.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request).then(resp => resp || ch().then(c =>
      fetch(ev.request).then(res => c.put(ev.request, res.clone()).then(
        () => res
      ))
    ))
  )
});