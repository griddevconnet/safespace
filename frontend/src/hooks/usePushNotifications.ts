import { useState, useEffect } from 'react';
import api from '../api';

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      setError('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }

    return false;
  };

  const subscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported');
      }

      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        throw new Error('Notification permission denied');
      }

      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
        ) as any,
      });

      const subscriptionData: PushSubscription = {
        endpoint: pushSubscription.endpoint,
        p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(pushSubscription.getKey('auth')!),
      };

      await api.post('/api/users/push-subscription/', subscriptionData);
      setSubscription(subscriptionData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to push notifications');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.delete('/api/users/push-subscription/');
      setSubscription(null);
      
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe from push notifications');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    permission,
    loading,
    error,
    subscribe,
    unsubscribe,
    requestPermission,
  };
};

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as any;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
