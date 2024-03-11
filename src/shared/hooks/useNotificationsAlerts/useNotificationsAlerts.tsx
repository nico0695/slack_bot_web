import { useEffect, useState } from 'react';

interface INorificationMessage {
  title: string;
  body: unknown;
  icon: string;
  url?: string;
}

const useNotificationsAlert = (
  onmessage?: (message: INorificationMessage) => void
) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const channel = new BroadcastChannel('sb-push-notifications');

    channel.onmessage = (event) => {
      const notificationData = event.data;

      if (!isVisible) {
        document.title = `${notificationData.title} - Alerta!`;
      }

      alert(notificationData.title + ': ' + notificationData.body);

      if (onmessage) {
        onmessage(notificationData);
      }
    };

    channel.onmessageerror = (event) => {
      console.log('onmessageerror -- event= ', event);
    };

    // App is visible
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        setIsVisible(true);
        document.title = '';
      } else {
        setIsVisible(false);
      }
    });

    return () => {
      channel.close();
      document.removeEventListener('visibilitychange', () => {});
    };
  }, [isVisible]);

  return;
};

export default useNotificationsAlert;
