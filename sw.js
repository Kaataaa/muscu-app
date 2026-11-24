// Réseau d'abord pour la page (toujours la dernière version quand il y a internet),
// cache en secours (hors connexion). Les icônes restent servies depuis le cache.
const CACHE = 'muscu-v21';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
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
