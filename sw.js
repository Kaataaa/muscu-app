// Réseau d'abord pour la page (toujours la dernière version quand il y a internet),
// cache en secours (hors connexion). Les icônes restent servies depuis le cache.
const CACHE = 'muscu-v23';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'img/bicycle-0.jpg', 'img/bicycle-1.jpg', 'img/climber-0.jpg', 'img/climber-1.jpg', 'img/crunch-0.jpg', 'img/crunch-1.jpg', 'img/curl-0.jpg', 'img/curl-1.jpg', 'img/deadbug-0.jpg', 'img/deadbug-1.jpg', 'img/dev-0.jpg', 'img/dev-1.jpg', 'img/ecarteSol-0.jpg', 'img/ecarteSol-1.jpg', 'img/hipdips-0.jpg', 'img/hipdips-1.jpg', 'img/jacks-0.jpg', 'img/jacks-1.jpg', 'img/lat-0.jpg', 'img/lat-1.jpg', 'img/planche-0.jpg', 'img/planche-1.jpg', 'img/pompes-0.jpg', 'img/pompes-1.jpg', 'img/rowing-0.jpg', 'img/rowing-1.jpg', 'img/sdt-0.jpg', 'img/sdt-1.jpg', 'img/serrees-0.jpg', 'img/serrees-1.jpg', 'img/squat-0.jpg', 'img/squat-1.jpg', 'img/triceps-0.jpg', 'img/triceps-1.jpg', 'img/twist-0.jpg', 'img/twist-1.jpg', 'img/wu2-0.jpg', 'img/wu2-1.jpg', 'img/wu3-0.jpg', 'img/wu3-1.jpg'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) =>
	e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())),
);
self.addEventListener('fetch', (e) => {
	if (e.request.method !== 'GET') return;
	const page = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(e.request.url).pathname);
	if (page) {
		e.respondWith(
			fetch(e.request, {cache: 'no-store'})
				.then((r) => {
					const copy = r.clone();
					caches.open(CACHE).then((c) => c.put('index.html', copy));
					return r;
				})
				.catch(() => caches.match('index.html')),
		);
		return;
	}
	e.respondWith(caches.match(e.request, {ignoreSearch: true}).then((hit) => hit || fetch(e.request)));
});
