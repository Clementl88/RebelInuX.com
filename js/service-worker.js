// ===== SERVICE WORKER FOR OFFLINE CAPABILITY =====

const CACHE_NAME = 'rebelinux-v1.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/header-footer.css',
  '/css/index.css',
  '/js/includes.js',
  '/js/common.js',
  '/js/index.js',
  '/js/optimizations.js',
  '/images/Logo_REBL.svg',
  // Add other critical assets
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache addAll failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event with network-first strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If network fails and we don't have a cached version,
            // you could return a custom offline page here
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for failed requests
self.addEventListener('sync', event => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(syncFailedRequests());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'New update from RebelInuX!',
    icon: '/images/Logo_REBL.svg',
    badge: '/images/Logo_REBL.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/images/Logo_REBL.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/Logo_REBL.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('RebelInuX', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://rebelinux.fun/')
    );
  }
});
