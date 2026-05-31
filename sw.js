/* Шеф · Дом — service worker */
const CACHE = 'shef-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Сообщение от страницы — показать уведомление (когда приложение открыто)
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'notify' && data.title) {
    self.registration.showNotification(data.title, {
      body: data.body || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'shef-lubimaya',
      renotify: true,
      vibrate: [180, 80, 180],
      data: { url: './' }
    });
  }
});

// Web Push (на будущее — если подключим серверную доставку)
self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch (e) { payload = { title: 'Шеф · Дом', body: event.data ? event.data.text() : '' }; }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'Шеф · Дом', {
      body: payload.body || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'shef-lubimaya',
      renotify: true,
      vibrate: [180, 80, 180],
      data: { url: './' }
    })
  );
});

// Клик по уведомлению — открыть/сфокусировать приложение
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
