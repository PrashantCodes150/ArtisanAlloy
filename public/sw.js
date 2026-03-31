// Service Worker for PWA functionality
const CACHE_NAME = 'f-jewelry-v1';
const STATIC_CACHE = 'f-jewelry-static-v1';

// URLs that should never be cached (API calls, auth, etc.)
const NEVER_CACHE_URLS = [
  '/api/',
  '/auth/',
  '/cart',
  '/wishlist',
  '/orders',
  'razorpay.com',
  'googleapis.com',
  'gstatic.com',
  'checkout.razorpay.com'
];

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Check if this is a request that should never be cached
  const shouldNeverCache = NEVER_CACHE_URLS.some(pattern => {
    if (pattern.includes('/')) {
      return url.pathname.includes(pattern) || url.pathname.startsWith(pattern);
    }
    return url.hostname.includes(pattern);
  });

  // For API calls and dynamic requests, always fetch from network
  if (shouldNeverCache || request.method !== 'GET') {
    event.respondWith(fetch(request).catch(error => {
      console.error('Network fetch failed for uncached request:', error);
      return new Response('Network Error', { 
        status: 503, 
        statusText: 'Service Unavailable' 
      });
    }));
    return;
  }

  // For static assets only, use cache-first strategy
  if (request.method === 'GET' && 
      (url.pathname.includes('/assets/') || 
       url.pathname.includes('/static/') ||
       url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/))) {
    
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            return response;
          }
          
          // Not in cache, fetch from network
          return fetch(request).then(networkResponse => {
            // Only cache successful responses
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(error => {
            console.error('Failed to fetch static asset:', error);
            return new Response('Asset not found', { 
              status: 404, 
              statusText: 'Not Found' 
            });
          });
        });
      })
    );
    return;
  }

  // For all other GET requests, use network-first strategy
  event.respondWith(
    fetch(request).then(networkResponse => {
      // Only cache successful GET responses
      if (networkResponse.ok && request.method === 'GET') {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
        });
      }
      return networkResponse;
    }).catch(error => {
      // Network failed, try cache as fallback
      console.log('Network failed, trying cache for:', request.url);
      return caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return new Response('Offline', { 
          status: 503, 
          statusText: 'Service Unavailable' 
        });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).catch(error => {
      console.error('Activate event failed:', error);
    })
  );
  // Take control of clients immediately
  event.waitUntil(self.clients.claim());
});