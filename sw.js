const C='connscreen-v1.0.0';const A=['./','index.html','player.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','src/signage-config.js','src/signage-core.js','src/signage-api.js','src/signage-layout.js'];
// الكاش على نفس نطاق github.io مع تطبيقات أخرى: نمسح فقط كاشات هذا التطبيق القديمة (بادئة connscreen-)
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('connscreen-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
// طلبات Supabase (البيانات والصور والفيديو) تمر للشبكة مباشرة بلا تدخل
if(new URL(e.request.url).hostname.endsWith('.supabase.co'))return;
e.respondWith(fetch(e.request).then(r=>{if(r.ok&&new URL(e.request.url).origin===location.origin){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match(e.request,{ignoreSearch:true})).then(m=>m||caches.match('index.html'))))});
