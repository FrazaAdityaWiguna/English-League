importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

workbox.precaching.precacheAndRoute(
    [
        { url: "./index.html", revision: "1" },
        { url: "./nav.html", revision: "null" },
        { url: "./info_teams.html", revision: "null" },
        { url: "./manifest.json", revision: "null" },
        { url: "./css/materialize.min.css", revision: "null" },
        { url: "./js/api.js", revision: "null" },
        { url: "./js/db.js", revision: "null" },
        { url: "./js/idb.js", revision: "null" },
        { url: "./js/indexedDB.js", revision: "null" },
        { url: "./js/main.js", revision: "null" },
        { url: "./js/materialize.min.js", revision: "null" },
        { url: "./js/nav.js", revision: "null" },
        { url: "./js/push.js", revision: "null" },
        { url: "./js/standings.js", revision: "null" },
        { url: "./js/team-detail.js", revision: "null" },
        { url: "./js/team-saved.js", revision: "null" },
    ], {
        ignoreUrlParametersMatching: [/.*/],
    }
);

workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "pages",
    })
);

workbox.routing.registerRoute(
    /\.(?:png|jpg|webp|svg|gif)$/,
    workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 25,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://fonts.gstatic.com/",
    workbox.strategies.cacheFirst({
        cacheName: "Materialize-icon",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 25,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://api.football-data.org",
    workbox.strategies.staleWhileRevalidate({
        cacheName: "english-league",
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 30,
            }),
        ],
    })
);

self.addEventListener("push", function(event) {
    var body;

    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push Message no payload";
    }

    var options = {
        body: body,
        icon: "img/icon_8.png",
        vibrate: [100, 50, 100],
        data: {
            dataOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification("Push Notifikasi", options)
    );
});