const CACHE_NAME = 'unit-converter-cache-v1';
const PRECACHE_URLS = [
  "./",
  "./about.html",
  "./ads.txt",
  "./assets/icons/icon-128x128.png",
  "./assets/icons/icon-144x144.png",
  "./assets/icons/icon-152x152.png",
  "./assets/icons/icon-192x192.png",
  "./assets/icons/icon-256x256.png",
  "./assets/icons/icon-384x384.png",
  "./assets/icons/icon-48x48.png",
  "./assets/icons/icon-512x512.png",
  "./assets/icons/icon-72x72.png",
  "./assets/icons/icon-96x96.png",
  "./assets/images/og-about.png",
  "./assets/images/og-contact.png",
  "./assets/images/og-data.png",
  "./assets/images/og-discount.png",
  "./assets/images/og-image.png",
  "./assets/images/og-length.png",
  "./assets/images/og-mass.png",
  "./assets/images/og-number.png",
  "./assets/images/og-power.png",
  "./assets/images/og-privacy.png",
  "./assets/images/og-temperature.png",
  "./assets/images/og-text.png",
  "./assets/images/og-time.png",
  "./contact.html",
  "./data.html",
  "./discount.html",
  "./footer.css",
  "./googlee96642ac7e0a4cdd.html",
  "./images/about.png",
  "./images/about.webp",
  "./images/animated/about.gif",
  "./images/animated/add.gif",
  "./images/animated/calculator.gif",
  "./images/animated/convert.gif",
  "./images/animated/discount.gif",
  "./images/animated/file.gif",
  "./images/animated/heart.gif",
  "./images/animated/incognito.gif",
  "./images/animated/info.gif",
  "./images/animated/network.gif",
  "./images/animated/password.gif",
  "./images/animated/phone-contact.gif",
  "./images/animated/privacy-policy.gif",
  "./images/animated/software.gif",
  "./images/animated/text.gif",
  "./images/contact.png",
  "./images/contact.webp",
  "./images/converter.png",
  "./images/converter.webp",
  "./images/data.png",
  "./images/data.webp",
  "./images/discount.png",
  "./images/discount.webp",
  "./images/length.png",
  "./images/length.webp",
  "./images/mass.png",
  "./images/mass.webp",
  "./images/me-in-the-pool-300-by-597.png",
  "./images/me-in-the-pool.jpg",
  "./images/number-system.png",
  "./images/number-system.webp",
  "./images/power-mod.png",
  "./images/power-mod.webp",
  "./images/privacy-policy.png",
  "./images/privacy-policy.webp",
  "./images/socials/email.png",
  "./images/socials/email.webp",
  "./images/socials/facebook.png",
  "./images/socials/facebook.webp",
  "./images/socials/github.png",
  "./images/socials/github.webp",
  "./images/socials/instagram.png",
  "./images/socials/instagram.webp",
  "./images/socials/whatsapp.png",
  "./images/socials/whatsapp.webp",
  "./images/socials/youtube.png",
  "./images/socials/youtube.webp",
  "./images/temperature.png",
  "./images/temperature.webp",
  "./images/text.png",
  "./images/text.webp",
  "./images/time.png",
  "./images/time.webp",
  "./index.css",
  "./index.html",
  "./length.html",
  "./manifest.json",
  "./mass.html",
  "./nav.js",
  "./numbersystem.html",
  "./power.html",
  "./privacy.html",
  "./robots.txt",
  "./sitemap.xml",
  "./styles.css",
  "./temperature.html",
  "./text.html",
  "./time.html"
];

// Allow active client to prompt skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Install event - Precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and precaching core assets.');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Cache-First, then Network, caching new requests dynamically
self.addEventListener('fetch', (event) => {
  // Only cache GET requests and http/https traffic
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If not in cache, fetch from network and dynamically cache it
      return fetch(event.request).then((networkResponse) => {
        // Don't cache non-successful responses or cross-origin requests unless they are opaque
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for offline if not cached
        return new Response('Network error happened and resource is not cached.', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      });
    })
  );
});
