const CACHE_NAME = 'static-cache-v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
	'./',
	// '/index.html',
	// '/offline.html'
];
// install
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
		  console.log('[ServiceWorker] Pre-caching offline page');
		  return cache.addAll(FILES_TO_CACHE);
		})
		.then(
			self.skipWaiting()
		)
	);
});

// activate
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activate');
	event.waitUntil(
		//遍歷當前快取keys
		caches.keys().then((cacheNames) => {
		  return Promise.all(cacheNames.map((cacheName) => {
			if (cacheName !== CACHE_NAME) {
			  console.log('[ServiceWorker] Removing old cache', cacheName);
			  return caches.delete(cacheName);
			}
		  }));
		})
		.then(() => self.clients.claim())
	)
});

//代理請求，使用快取，請求傳送之前
self.addEventListener('fetch', event => {
	console.log('[ServiceWorker] Fetch', event.request.url);

	event.respondWith(
		//快取是否匹配 
		caches.match(event.request).then(function (response) {
			if (response != null) {
				//命中快取返回快取，結束請求
				return response;
			}
			//未命中快取，正常請求
			return fetch(event.request)
				.then(res =>
					// 存 caches 之前，要先打開 caches.open(dataCACHE_NAME)
					caches.open(CACHE_NAME)
				.then(function(cache) {
					// cache.put(key, value)
					// 下一次 caches.match 會對應到 event.request
					cache.put(event.request, res.clone());
					return res;
				})
			);
		})
	);

	// event.respondWith(
	// 	fetch(event.request)
	// 		.catch(() => {
	// 			return caches.open(CACHE_NAME)
	// 				.then((cache) => {
	// 				  return cache.match('offline.html');
	// 				});
	// 		})
	// );
});