/**
 * Progressive Web App (PWA) Service Worker Registration
 * Ensures zero interference with Vite development server and HMR
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  // In development: aggressively unregister any active service worker to keep the tab fast and responsive
  if (!import.meta.env?.PROD) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('[PWA] Unregistered development service worker for maximum local speed.');
          }
        });
      }
    });
    return;
  }

  // In production only: register the service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered in production:', registration.scope);
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}
