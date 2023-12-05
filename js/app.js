// Does the browser support service workers?
if ("serviceWorker" in navigator) {
  // Defer service worker installation until page completes loading
  window.addEventListener("load", () => {
    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Display success message
        console.log(`Service Worker Registration (Scope: ${reg.scope})`);
      })
      .catch((error) => {
        // Display error message
        console.log(`Service Worker Error (${error})`);
      });
  });

  // Check if the browser supports notifications
  if ("Notification" in window) {
    // Request notification permission
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied");
      }
    });
  } else {
    console.log("Notifications not supported in this browser");
  }
} else {
  // Happens when the app isn't served over a TLS connection (HTTPS)
  // or if the browser doesn't support the service worker
  console.log("Service Worker not available");
}



