/** openDB(DB名稱, DB版本, { callback }) */
// 建立一個 todoList 資料庫

var dbPromise = idb.openDB('todoList', 4, {
    upgrade(db) {
        // 假如資料表中沒有 todoItem 的物件，就建立該物件，並以 id 當唯一的 key 值。
        if (!db.objectStoreNames.contains('todoItem')) {
            db.createObjectStore('todoItem', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sync-posts')) {
            db.createObjectStore('sync-posts', { keyPath: 'timeStamp' });
        }
    }
});

function writeData(objectStore, data) {
    return dbPromise.then(function(db) {
        // 第一步：開啟資料庫和交易(transaction)​
        var tx = db.transaction(objectStore, 'readwrite');  

        // 第二步：建立物件存檔(object store)​
        var store = tx.objectStore(objectStore);

        // 第三步：發出資料庫操作請求，例如新增(put)或取得(get)資料​
        store.put(data);
        return tx.complete;
    });
}

function readAllData(objectStore) {
    return dbPromise.then(function(db) {
        var tx = db.transaction(objectStore, 'readonly');
        var store = tx.objectStore(objectStore);
        return store.getAll();
    });
}

function clearAllData(objectStore) {
    return dbPromise.then(function(db) {
        var tx = db.transaction(objectStore, 'readwrite');
        var store = tx.objectStore(objectStore);
        store.clear();   // 全部清除indexedDB中的資料
        return tx.complete;
    })
}

function deleteItemFromData(objectStore, id) {
    dbPromise.then(function(db) {
        var tx = db.transaction(objectStore, 'readwrite');
        var store = tx.objectStore(objectStore);
        store.delete(id);
        return tx.complete;
    })
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


function openStore(storeName) {
    return new Promise(function (resolve, reject) {
        if (!('indexedDB' in window)) {
            reject('don\'t support indexedDB');
        }
        var request = indexedDB.open('PWA_DB', 1);
        request.onerror = function(e) {
            console.log('连接数据库失败');
            reject(e);
        }
        request.onsuccess = function(e) {
            console.log('连接数据库成功');
            resolve(e.target.result);
        }
        request.onupgradeneeded = function (e) {
            console.log('数据库版本升级');
            var db = e.srcElement.result;
            if (e.oldVersion === 0) {
                if (!db.objectStoreNames.contains(storeName)) {
                    var store = db.createObjectStore(storeName, {
                        keyPath: 'tag'
                    });
                    store.createIndex(storeName + 'Index', 'tag', {unique: false});
                    console.log('创建索引成功');
                }
            }
        }
    });
}