import React, { useState, useEffect } from 'react';
import Header from '../Components/Header.jsx';
import { NavLink } from 'react-router-dom'



const MainLayout = ({ children }) => {
    // Public Key:
    // BJ5PnvoWA9NI0xfqxTQM4sx_OcnfaFT6sOxwOw7YAC6kaIiUhnP8XoBdP7pXTvrJV0OWj5fhWIdzJr8PZR7CHFA

    // Private Key:
    // 1DH3Tap2XLy4dlK6gbVqytnQT19jLzA-Jc5BgegDnzY

    const [notiEnable, setNotiEnable] = useState(false)

    useEffect(() => {
        if('Notification' in window && 'serviceWorker' in navigator) {
            // 顯示「訂閱」Button
            setNotiEnable(true)
        }
    }, [])

    // 點擊「訂閱」Button
    const askForNotificationPermission = function () {
        Notification.requestPermission(function (result) {
            // 這裡result會有三種結果：一個是用戶允許(granted)，另一個是用戶封鎖(denied)，最後是用戶直接關閉(default)
            console.log('User Choice', result);
            if(result !== 'granted') {
                console.log('No notification permission granted!');
            } else {
                configurePushSub();
                // displayConfirmNotification();
            }
        });
    }

    const configurePushSub = function () {
        var reg;
        navigator.serviceWorker.ready.then(function(sw) {
            reg = sw;
            return sw.pushManager.getSubscription();
        })
            .then(function(sub) {
                if(sub === null) {
                    // 尚未訂閱
                    var vapidPublicKey = 'BJ5PnvoWA9NI0xfqxTQM4sx_OcnfaFT6sOxwOw7YAC6kaIiUhnP8XoBdP7pXTvrJV0OWj5fhWIdzJr8PZR7CHFA';
                    var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
                    return reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidPublicKey 
                    });
                } else {
                    // 已經訂閱
                }
            })
            .then(function(newSub) {
                console.log(newSub)
                if (newSub) {
                    return fetch('http://localhost:3000/subscriptions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(newSub)
                    })
                        .then(function(res) {
                            if(res.ok) {
                                displayConfirmNotification();
                            }
                        })
                        .catch(function(err) {
                            console.log(err);
                        })
                }
                else displayConfirmNotification();
            })
    }

    const displayConfirmNotification = function () {
        var options = {
            body: '您已成功訂閱我們的推播服務!',
            icon: '../../assets/images/icon-192x192.png',
            image: '../../assets/images/icon-192x192.png',
            dir: 'ltr',
            lang: 'zh-TW',   // BCP 47
            vibrate: [100, 50, 200],
            badge: '../../assets/images/icon-192x192.png',
            tag: 'confirm-notification',
            renotify: true,
            actions: [
                { action: 'confirm', title: '收到', icon: '../../assets/images/btn_check.png' },
                { action: 'cancel', title: '取消', icon: '../../assets/images/btn_del.png' }
            ]
        }
        navigator.serviceWorker.ready
            .then(function(sw) {
                sw.showNotification('成功訂閱!! (from Service Worker)', options);
            });
        
    }

    return (
        <div>
            <Header />
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            {notiEnable && <button onClick={askForNotificationPermission}>訂閱</button>}
            {children}
        </div>
    )
}

export default MainLayout;