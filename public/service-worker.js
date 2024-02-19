self.addEventListener('push', (event) => {
  const data = event.data.json();

  console.log('Push data= ', data);

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
    }
  } catch (error) {
    console.log('SW: push error', error);
  }
});
