const webPush = require('web-push');
const axios = require('axios');

const vapidKeys = {
    publicKey: 'BJ5PnvoWA9NI0xfqxTQM4sx_OcnfaFT6sOxwOw7YAC6kaIiUhnP8XoBdP7pXTvrJV0OWj5fhWIdzJr8PZR7CHFA',
    privateKey: '1DH3Tap2XLy4dlK6gbVqytnQT19jLzA-Jc5BgegDnzY'
};

webPush.setVapidDetails(
  'mailto:jhwen840220@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const options = {
    title: '測試PUSH',
    content: '成功嚕~~',
}


axios.get('http://localhost:3000/subscriptions')
    .then(res => {
        return res.data
    })
    .then(data => {
        data.forEach(value => {
            webPush.sendNotification(value, JSON.stringify(options))
                .catch( err => { console.log(err) })
        });
    })
