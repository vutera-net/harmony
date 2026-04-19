self.addEventListener('push', function (event) {
  if (!event.data) {
    console.log('Push event received but no data.');
    return;
  }

  const data = JSON.parse(event.data.toString());
  const title = data.title || 'Thông báo từ Harmony';
  const options = {
    body: data.body || 'Vào xem vận hạn hằng ngày của bạn ngay thôi!',
    icon: '/logo.svg',
    badge: '/logo.svg',
    data: {
      url: data.url || '/tu-vi-hang-ngay',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
