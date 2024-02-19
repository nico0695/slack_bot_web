// Subscribe to push notifications
export const serviceWorkerConfig = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const register = await navigator.serviceWorker.register(
      '/service-worker.js'
    );

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    return subscription;
  } catch (error) {
    console.log('SW: error= ', error);
    return;
  }
};
