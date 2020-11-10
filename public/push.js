var webPush = require('web-push');
const vapidKeys = {
    publicKey : "BPxCxXHRpknfk2uAGIoYt4cuJLaR6NVCztf051ruJdQnEaUUVOcnt98K47yCdEf--PrDmvChJfHMs6CIy73Dpdc",
    privateKey : "bWwT6MHm3i9dkUHItIfX2kLk3zSmZJw2nrjLJWS_9-M"
};
 
 
webPush.setVapidDetails(
    "mailto:example@yourdomain.org",
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/eaXBqeh5GLo:APA91bHUBd_wdhfU3jsjsELy8PEtFUYD7RMuvKJI53aOvaiOwknaPIRrTtMtzfdZIUN7X8YN4MUjUzAjS7h7SITKjOGToda1D9np0Lv9gFyYNUjR-V59CM3LPFYzNV6ZTJ3E_GJ-4EbS",
    keys: {
        "p256dh": "BK941dh7v6a99/P764e4KjROqCKZz+cmrDSjUQgsjwFcNrJTMp1PlzpOHOXeKHeqWAn8vrgD+fG90XSD2vTjDdM=",
        "auth": "nXq/vvDLCoSRqdw2OaPlPw=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
var options = {
    gcmAPIKey: '50883727498',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);