var webPush = require("web-push");

const vapidKeys = {
    publicKey: "BFgJJzXbTcst67eaziX3Ff4JACM7iiwxB5TKEdgABqQYI6PQPzH-0WJlMtJbK6UNpXSqqaWlZRPy7RkRaBx8DcA",
    privateKey: "MBJI3IOpWnI5kBJbkSM062oV6TP9UvS94PXc3jKLfYI",
};

webPush.setVapidDetails(
    "mailto:adityafraja12@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

var pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/f9FBnvoPuIg:APA91bGOyyZwdePw8gv1sgivaRRsJPLapoun30iS39f1BJgOmMidMByJ9H4YUYhN4-U7OEQ7VHDMl2uW55349Y7nJUHH8FqukwUZi8LXlub0pJvyylkLnul_RznL1MiCmLLBXiTSnr28",
    keys: {
        p256dh: "BEj6u1fK6WNiyb+OvyXz1a2x4EWiV6uTSMWcUES1oAhJC6MfE+a8NjRD+S1XV+hxjV12F/17o/ghznADfHET9ao=",
        auth: "qk5r/xx9UwrLabKsYe8ajg==",
    },
};

var payload = "Selamat Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
    gcmAPIKey: "215015656581",
    TTL: 60,
};

webPush.sendNotification(pushSubscription, payload, options);