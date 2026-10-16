const C = "weighle-v1";
self.addEventListener("install", e => self.skipWaiting());
// 같은 주소(leesu1026.github.io)를 쓰는 Peakle의 캐시는 건드리지 않도록 weighle- 캐시만 정리
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("weighle-") && k !== C).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
// 네트워크 우선 (항상 최신 버전) + 오프라인 시 캐시 폴백
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      try {
        if (new URL(e.request.url).origin === location.origin) {
          const cl = r.clone();
          caches.open(C).then(c => c.put(e.request, cl));
        }
      } catch (_) {}
      return r;
    }).catch(() => caches.match(e.request))
  );
});
