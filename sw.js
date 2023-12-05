const staticCache = "Static-cache-v22";
const dynamicCache = "Dynamic-cache-v21";

const assets = [
  "/",
  "/index.html",
  "/pages/fallback.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/materialize.min.css",
  "/css/app.css",
  "/img/task.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

// Cache size limit
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", function (event) {
  console.log(`SW: Event fired: ${event.type}`);
  event.waitUntil(
    caches.open(staticCache).then(function (cache) {
      console.log("SW: Precaching App shell");
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Display notification when a new meal is added
const showNotification = (title, options) => {
  self.registration.showNotification(title, options);
  console.log('Notification shown: ${title}');
};

self.addEventListener("fetch", function (event) {
  if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(dynamicCache).then((cache) => {
              cache.put(event.request.url, fetchRes.clone());
              limitCacheSize(dynamicCache, 15);

              // Display notification when a new meal is added
              if (event.request.method === "POST") {
                const options = {
                  body: "A new meal has been added!",
                };
                showNotification("New Meal Added", options);
              }

              return fetchRes;
            });
          })
        );
      })
      .catch(() => caches.match("/pages/fallback.html"))
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  const action = event.action;

  if (action === "close") {
    notification.close();
  } else {
    // Handle notification click
    clients.openWindow("/"); // open the app window on click
    notification.close();
  }
});
