self.addEventListener('push', (event) => {
  const data = event.data.json();

  const notificationOptions = {
    body: data.body,
    tag: data.tag ?? 'pw-tag',
    icon: data?.icon ?? 'https://i.imgur.com/Gayy8Qt.png',
    data: {
      url: data?.url,
    },
  };

  try {
    if (Notification.permission === 'granted') {
      self.registration.showNotification(
        data?.title ?? 'Alert',
        notificationOptions
      );

      // Notify to all tabs (useNotificationsAlerts)
      const channel = new BroadcastChannel('sb-push-notifications');

      channel.postMessage({
        title: data?.title ?? 'Alert',
        body: data.body,
        icon: data?.icon ?? 'https://i.imgur.com/Gayy8Qt.png',
        url: data?.url,
      });
    }
  } catch (error) {
    console.log('SW: push error', error);
  }
});
