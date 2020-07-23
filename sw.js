const CACHE_NAME = 'static-cache-v1';
const CACHE_DYNAMIC_NAME = 'dynamic';
// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
	'/',
	'/index.html',
	'/assets/main.css',
	'/assets/images/btn_del.png',
	'/assets/images/ic_add.png',
	'/assets/images/icon-192x192.png',
	'/offline.html',
	'/manifest.json'
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

/** Cache with network fallback */
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             if(response) {
//                 return response;
// 			}
// 			else {
// 				return fetch(event.request)
// 					.then(res => {
// 						return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
// 							cache.put(event.request.url, res.clone());
// 							return res;
// 						})
// 					})
// 					.catch(function(err) {
// 						return caches.open(CACHE_NAME).then(function(cache) {
// 							return cache.match('/offline.html');
// 						});
// 					});
//             }
//         })
//     );
// });

/** Cache then network */
self.addEventListener('fetch', function(event) {
    event.respondWith(
		caches.open(CACHE_DYNAMIC_NAME)
			.then(cache => {
				return fetch(event.request)
					.then(res => {
						cache.put(event.request, res.clone());
						return res;
					});
			})
    );
});

// self.addEventListener('fetch', function(event) {
// 	// if (!(event.request.url.indexOf('http') === 0)) return;
// 	if (event.request.method !== "GET") return;

// 	event.respondWith(
// 		caches.open(CACHE_NAME)
// 			.then(cache => {
// 				return fetch(event.request)
// 					.then(response => {
// 						cache.put(event.request, response.clone());
// 						return response;
// 					});
// 			})
// 	);
// });

//代理請求，使用快取，請求傳送之前
// self.addEventListener('fetch', event => {
// 	const url = 'http://localhost:3000/todolist';
// 	if (!(event.request.url.indexOf('http') === 0)) return;
// 	if (event.request.method !== "GET") return;

// 	event.respondWith(
// 		//快取是否匹配 
// 		caches.match(event.request)
// 			.then(response => {
// 				// if (response != null) {
// 				// 	if (event.request.url.indexOf(url) > -1) {
// 				// 		return fetch(event.request)
// 				// 			.then(res =>
// 				// 				caches.open(CACHE_NAME)
// 				// 					.then(cache => {
// 				// 						cache.put(event.request, res.clone());
// 				// 						return res;
// 				// 					})
// 				// 			)
// 				// 			.catch(() => response);
// 				// 	}
// 				// 	//命中快取返回快取，結束請求
// 				// 	return response;
// 				// }
// 				//未命中快取，正常請求
// 				return fetch(event.request)
// 					.then(res => {
// 						// 存 caches 之前，要先打開 caches.open(CACHE_NAME)
// 						caches.open(CACHE_NAME)
// 							.then(function(cache) {
// 								cache.keys()
// 									.then(keys => {
// 										keys.forEach(request => {
// 											if (request.url.indexOf('sockjs-node') > -1) cache.delete(request)
// 										})
										
// 									})
// 								// 下一次 caches.match 會對應到 event.request
// 								cache.put(event.request, res.clone());
// 								return res;
// 							})
// 					})
// 					.catch(err => {
// 						caches.open(CACHE_NAME)
// 							.then(function(cache) {
// 								if (response != null) {
// 									return response;
// 								}
// 								// return cache.match('/offline.html');
// 							});
// 					})
// 			})
// 	);
// });