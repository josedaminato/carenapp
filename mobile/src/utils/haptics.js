import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

const THROTTLE_MS = 800;
let lastVibrateAt = 0;

function canVibrate() {
  return Platform.OS !== 'web';
}

function throttle() {
  const now = Date.now();
  if (now - lastVibrateAt < THROTTLE_MS) return false;
  lastVibrateAt = now;
  return true;
}

export async function vibrateOnFireSent() {
  if (!canVibrate()) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    Vibration.vibrate(200);
  }
}

export async function vibrateOnFireReceived() {
  if (!canVibrate() || !throttle()) return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // fallback silencioso
  }

  if (Platform.OS === 'android') {
    Vibration.vibrate([0, 280, 120, 280]);
  }
}

export const FIRE_VIBRATION_PATTERN = [0, 280, 120, 280];
