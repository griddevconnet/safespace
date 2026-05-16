const CACHE_NAME = 'safespace-v2';
const STATIC_CACHE = 'safespace-static-v2';
const DYNAMIC_CACHE = 'safespace-dynamic-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Cache static assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(error => {
              console.log(`Failed to cache ${url}:`, error);
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Network-first for API calls, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { url, method } = event.request;

  // Skip cross-origin requests
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  // API calls - Network first, fallback to cache
  if (url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Try to serve from cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets - Cache first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // Cache new static assets
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
      })
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-moods') {
    event.waitUntil(syncOfflineMoods());
  }
});

// Sync offline mood entries
async function syncOfflineMoods() {
  try {
    const offlineMoods = await getOfflineMoods();
    for (const mood of offlineMoods) {
      await fetch('/api/moods/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mood.token}`,
        },
        body: JSON.stringify(mood.data),
      });
    }
    // Clear synced moods
    await clearOfflineMoods();
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Helper functions for IndexedDB
async function getOfflineMoods() {
  return new Promise((resolve) => {
    const request = indexedDB.open('SafeSpaceDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineMoods'], 'readonly');
      const store = transaction.objectStore('offlineMoods');
      const getAll = store.getAll();
      getAll.onsuccess = () => resolve(getAll.result);
    };
  });
}

async function clearOfflineMoods() {
  return new Promise((resolve) => {
    const request = indexedDB.open('SafeSpaceDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineMoods'], 'readwrite');
      const store = transaction.objectStore('offlineMoods');
      store.clear();
      transaction.oncomplete = () => resolve();
    };
  });
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open SafeSpace',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SafeSpace', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
