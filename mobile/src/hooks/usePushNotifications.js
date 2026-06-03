import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { vibrateOnFireReceived, FIRE_VIBRATION_PATTERN } from '../utils/haptics';

const FIRE_CHANNEL_ID = 'fire';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setupAndroidChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(FIRE_CHANNEL_ID, {
    name: 'Fuego',
    description: 'Cuando alguien enciende el fuego',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: FIRE_VIBRATION_PATTERN,
    enableVibrate: true,
    sound: 'default',
  });
}

export function usePushNotifications() {
  const { user } = useAuth();
  const registered = useRef(false);

  useEffect(() => {
    setupAndroidChannel();
  }, []);

  useEffect(() => {
    if (!user || registered.current) return;

    (async () => {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );

      await api.registerPush({
        token: tokenData.data,
        platform: Platform.OS,
      });
      registered.current = true;
    })();
  }, [user]);

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      if (notification.request.content.data?.type === 'fire_triggered') {
        vibrateOnFireReceived();
      }
    });

    return () => receivedSub.remove();
  }, []);
}
