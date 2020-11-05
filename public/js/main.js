// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/sw.js")
            .then(function() {
                console.log("Service Worker registration is successful");
            })
            .catch(function() {
                console.log("ServiceWorker registration failed");
            });
    });
} else {
    console.log("The browser does not support serviceWorker");
}

// Push Notification

// Periksa fitur Notifikasi API
if ("Notification" in window) {
    requestPermission();
} else {
    console.log("The browser does not support notifications.");
}

// Meminta ijin menggunkan Notifikasi API
function requestPermission() {
    Notification.requestPermission().then(function(result) {
        if (result === "denied") {
            console.log("Notification feature is not running");
            return;
        } else if (result === "default") {
            console.log("The user closes the notification dialog box");
            return;
        }

        if ("PushManager" in window) {
            navigator.serviceWorker.getRegistration().then(function(registration) {
                registration.pushManager
                    .subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            "BFgJJzXbTcst67eaziX3Ff4JACM7iiwxB5TKEdgABqQYI6PQPzH-0WJlMtJbK6UNpXSqqaWlZRPy7RkRaBx8DcA"
                        ),
                    })
                    .then(function(subscribe) {
                        console.log(
                            "Successfully subscribed with endpoints",
                            subscribe.endpoint
                        );
                        console.log(
                            "Successfully subscribed with key p256dh: ",
                            btoa(
                                String.fromCharCode.apply(
                                    null,
                                    new Uint8Array(subscribe.getKey("p256dh"))
                                )
                            )
                        );
                        console.log(
                            "Successfully subscribe with auth key: ",
                            btoa(
                                String.fromCharCode.apply(
                                    null,
                                    new Uint8Array(subscribe.getKey("auth"))
                                )
                            )
                        );
                    })
                    .catch(function(e) {
                        console.log("Unable to subscribe");
                    });
            });
        }
    });
}

// generate PublicKey ke Uint8array
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}