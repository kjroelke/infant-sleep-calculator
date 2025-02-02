self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('sleep-log-cache').then((cache) => {
			return cache.addAll([
				'/',
				'/index.html',
				'/src/index.tsx',
				'/manifest.json',
				'/icons/icon-192x192.png',
				'/icons/icon-512x512.png',
				// Add other assets to cache
			]);
		}),
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		}),
	);
});
