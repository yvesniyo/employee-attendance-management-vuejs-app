const workbox = import("./plugins/workbox-v6.1.5/workbox-sw")

workbox.setConfig({ modulePathPrefix: './plugins/workbox-v6.1.5/' })
// const precacheManifest = [injectionPoint];

// workbox.precaching.precacheAndRoute(precacheManifest);
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

var version = 'v1.0';
var staticCache = 'copera-pwa-static-' + version;
var serverCache = 'copera-pwa-server-' + version;
var outSideCache = 'copera-pwa-outside-' + version;
var FALLBACK_IMAGE_URL = "";
var FALLBACK_FONT_URL = "";

const { ExpirationPlugin } = workbox.expiration;
const { registerRoute, setDefaultHandler, setCatchHandler } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
// const navigationPreload = workbox.navigationPreload;
const { matchPrecache, precacheAndRoute } = workbox.precaching;
const { BackgroundSyncPlugin } = workbox.backgroundSync;


precacheAndRoute([]);



const bgSyncPlugin = new BackgroundSyncPlugin('myQueueName', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
    /\/api\/.*\/*/,
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

// cache google fonts
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com',
    new StaleWhileRevalidate({
        cacheName: 'google-fonts',
        plugins: [
            new ExpirationPlugin({ maxEntries: 20 }),
        ],
    }),
);


// cache styles and scripts
registerRoute(
    ({ request }) => request.destination === 'script' ||
        request.destination === 'style',
    new StaleWhileRevalidate({
        cacheName: staticCache
    })
);



// cache images
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);


// cache api requests
registerRoute(
    ({ url }) => isItServerRequest(url.pathname),
    new NetworkFirst({
        cacheName: serverCache,
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            })
        ]
    })
);


function isItServerRequest(path) {

    if (path.indexOf("/api/") < 0) {
        return false;
    }
    return true;

    if (path == '' || path.split('.').length == 1)
        return true;
    else
        return false;
}



// Use a stale-while-revalidate strategy for all other requests.
setDefaultHandler(new StaleWhileRevalidate());
setCatchHandler(({ event }) => {
    switch (event.request.destination) {
        case 'image':
            // If using precached URLs:
            // return matchPrecache(FALLBACK_IMAGE_URL);
            return caches.match(FALLBACK_IMAGE_URL);
            break;
        case 'font':
            // If using precached URLs:
            // return matchPrecache(FALLBACK_FONT_URL);
            return caches.match(FALLBACK_FONT_URL);
            break;

        default:
            // If we don't have a fallback, just return an error response.
            let res = {
                "data": "offline",
                "status": 502,
                "offline": true,
                "message": "It's seems like you are offline",
            };
            return new Response(JSON.stringify(res), res);
    }
});