export default function swDev() {
  if ('serviceWorker' in navigator) {
    // Wait for the page to fully load before registering the service worker
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((res) => {
          console.warn("Service Worker registered successfully:", res);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  } else {
    console.warn("Service Workers are not supported in this browser.");
  }
}
