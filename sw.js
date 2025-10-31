const CACHE_NAME = 'my-collections-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/save.html',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached all files successfully');
      })
      .catch((err) => {
        console.log('Service Worker: Error caching files', err);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Found in Cache', event.request.url);
          return response;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Add to cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((err) => {
            console.log('Service Worker: Fetch failed', err);
            // You can return a fallback page here
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Handle Background Sync (for offline functionality)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background Sync', event.tag);
  if (event.tag === 'background-sync') {
    // Handle background sync tasks
    event.waitUntil(doBackgroundSync());
  }
});

// Handle Push Notifications (optional feature)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        {
          action: 'explore',
          title: 'View Collections',
          icon: '/icon-192.png'
        },
        {
          action: 'close', 
          title: 'Close',
          icon: '/icon-192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('My Collections', options)
    );
  }
});

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click Received.');

  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  console.log('Service Worker: Doing background sync');
  // You can add offline sync logic here
  // For example, sync saved links when back online
}

// Handle share target (when app receives shared content)
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SHARE_TARGET') {
    // Handle shared data
    const sharedData = event.data.data;
    console.log('Shared data received:', sharedData);
  }
});