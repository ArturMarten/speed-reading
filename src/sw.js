if (typeof importScripts === 'function') {
  // eslint-disable-next-line no-undef
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');

    /* injection point for manifest files. */
    // eslint-disable-next-line
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    /* custom cache rules */
    const handler = workbox.precaching.createHandlerBoundToURL('/index.html');
    const navigationRoute = new workbox.routing.NavigationRoute(handler, {
      denylist: [/^\/_/, /\/[^/]+\.[^/]+$/],
    });

    workbox.routing.registerRoute(navigationRoute);

    /* analytics */
    workbox.googleAnalytics.initialize();

    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      }),
    );
  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }

  this.addEventListener('message', (event) => {
    if (!event.data) {
      return;
    }
    switch (event.data) {
      case 'skipWaiting':
        this.skipWaiting();
        break;
      default:
        // NOOP
        break;
    }
  });
}
