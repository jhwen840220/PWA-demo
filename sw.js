importScripts('/idb.js')
importScripts('/utility.js');

const STATIC_CACHE_NAME = 'static-cache-v2';
const CACHE_DYNAMIC_NAME = 'dynamic';
// CODELAB: Add list of files to cache here.
const STATIC_FILES = [
	'/',
	'/index.html',
	'/btn_del.png',
	'/btn_check.png',
	'/ic_add.png',
	'/assets/images/icon-192x192.png',
	'/offline.html',
	'/manifest.json'
];


function isInArray(string, array) {
	var cachePath;
	// request 的 domain 是否與我們 PWA 的 domain 相同
    if (string.indexOf(self.origin) === 0) {   
		// 將 domain 之後的 url 擷取出來，也就是 localhost:8081 之後的 url
      	cachePath = string.substring(self.origin.length);   
    } else {
      	cachePath = string;   // 儲存完整的 request(也就是外部的 CDNs)
    }
    return array.indexOf(cachePath) > -1;
}

// install
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
		caches.open(STATIC_CACHE_NAME).then((cache) => {
		  return cache.addAll(STATIC_FILES);
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
			if (cacheName !== STATIC_CACHE_NAME) {
			  console.log('[ServiceWorker] Removing old cache', cacheName);
			  return caches.delete(cacheName);
			}
		  }));
		})
		.then(() => self.clients.claim())
	)
});

/** Cache Only */
// self.addEventListener('fetch', function(event) {
// 	event.respondWith(caches.match(event.request));
// });

/** Cache, falling back to network */
// self.addEventListener('fetch', function(event) {
// 	console.log(event.request.url)
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
// 						return caches.open(STATIC_CACHE_NAME).then(function(cache) {
// 							return cache.match('/offline.html');
// 						});
// 					});
//             }
//         })
//     );
// });

/** Cache then network */
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
// 		caches.open(CACHE_DYNAMIC_NAME)
// 			.then(cache => {
// 				return fetch(event.request)
// 					.then(res => {
// 						if(event.request.method === "GET") cache.put(event.request, res.clone());
// 						return res;
// 					})
// 					.catch(function(err) {
// 						return caches.open(STATIC_CACHE_NAME).then(function(cache) {
// 							return cache.match('/offline.html');
// 						});
// 					});
// 			})
//     );
// });



/** 組合式 */
self.addEventListener('fetch', event => {
	const requestUrl = event.request.url;
	const apiUrl = 'http://localhost:3000/';

	if (requestUrl.indexOf(apiUrl) > -1) {
		// Cache then network
        event.respondWith(
			fetch(event.request)
				.then(res => {
					const clonedRes = res.clone();
					if(event.request.method === "GET") {
						clearAllData('todoItem')
							.then(() => {   // 先清除 indexedDB
								return clonedRes.json();
							})
							.then(data => {
								for(var key in data) {
									writeData('todoItem', data[key]); // 再寫入新的 data
								}
							});
					}
					return res;
				})
        );
	} else if (isInArray(requestUrl, STATIC_FILES)) {
		// Cache Only
        event.respondWith(
            caches.match(event.request)
        );
	} else {
		// Cache, falling back to network
		event.respondWith(
			caches.match(event.request).then(response => {
				if(response) {
					return response;
				}
				else {
					return fetch(event.request)
						.then(res => {
							return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
								cache.put(requestUrl, res.clone());
								return res;
							})
						})
						.catch(err => {
							return caches.open(STATIC_CACHE_NAME).then(cache => {
								return cache.match('/offline.html');
							});
						});
				}
			})
		);
	}
});


self.addEventListener('sync', function (event) {
	const apiUrl = 'http://localhost:3000/';
    console.log('[Service Worker] Background syncing', event);
    if(event.tag === 'sync-new-post') {
        event.waitUntil(
            readAllData('sync-posts').then(function (data) {
                for(var dt of data) {
                    // feed.js中sendData()的code
                    fetch(`${apiUrl}todolist`, {
                        method: 'POST',
                        headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							isComplete: dt.isComplete,
							desc: dt.desc,
							id: dt.id,
							timeStamp: dt.timeStamp
						})
                    }).then(function (res) {
                        if(res.ok) {
							deleteItemFromData('sync-posts', dt.timeStamp);		
                        }
                    }).catch(function(err) {
                        console.log('Error while sending data', err); 
                    });
				}

            })
        );
    }
});


self.addEventListener('notificationclick', function (event) {
	// 顯示推播的物件內容
	var notification = event.notification;
	
	// 使用者點選的動作
    var action = event.action;

    console.log(notification);
    
    if (action === 'confirm') {
		console.log('Confirm was chosen');
		clients.openWindow('https://google.com');
	} 
	else {
        console.log(action);
	}
	notification.close();
	
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification was closed', event);
})


self.addEventListener('push', function(event) {
    if (event.data) {
		const data = JSON.parse(event.data.text());
		const options = {
			body: data.content,
			icon: './assets/images/icon-192x192.png',
			image: './assets/images/icon-192x192.png',
			dir: 'ltr',
			lang: 'zh-TW',   // BCP 47
			vibrate: [100, 50, 200],
			badge: './assets/images/icon-192x192.png',
			tag: 'confirm-notification',
			renotify: true,
			actions: [
				{ action: 'confirm', title: '收到', icon: './assets/images/btn_check.png' },
				{ action: 'cancel', title: '取消', icon: './assets/images/btn_del.png' }
			]
		}
	
		event.waitUntil(
			self.registration.showNotification(data.title, options)
		);
    }
});