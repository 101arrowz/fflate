var e,n,t,c,i;n="13d9f6f7",t=["index.html","favicon.66d2054e.ico","index.be564f92.css","index.8c6f4535.js","workers.d15d22a8.js","index.cfdc8355.js"].filter(function(e){return!/\.(ico)$/.test(e)}),c=self,i=function(){return caches.open(n)},c.addEventListener("install",function(e){e.waitUntil(i().then(function(e){return e.addAll(t)}))}),c.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.filter(function(e){return e!==n}).map(function(e){return caches.delete(e)}))}).then(function(){return c.clients.claim()}))}),c.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(n){return n||i().then(function(n){return fetch(e.request).then(function(t){return n.put(e.request,t.clone()).then(function(){return t})})})}))});
//# sourceMappingURL=sw.js.map
