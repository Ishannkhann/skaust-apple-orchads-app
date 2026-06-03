import AsyncStorage from "@react-native-async-storage/async-storage";

/** All AsyncStorage keys used in the app (previously magic strings). */
export const StorageKeys = {
  orchards: "orchards",
  editingOrchard: "editingOrchard",
  newOrchard: "newOrchard",
  notifications: "notifications",
  notificationCount: "notification_count",
  isLoggedIn: "isLoggedIn",
  userPhone: "userPhone",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/** Read a raw string value (or null). Mirrors AsyncStorage.getItem. */
export async function getItem(key: StorageKey): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

/** Write a raw string value. Mirrors AsyncStorage.setItem. */
export async function setItem(key: StorageKey, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

/** Remove a value. Mirrors AsyncStorage.removeItem. */
export async function removeItem(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/**
 * Read + JSON.parse a value, returning `fallback` when absent.
 * Equivalent to the existing `const x = await getItem(); if (x) JSON.parse(x)`
 * pattern used in home/my-orchards/notifications.
 */
export async function getJSON<T>(key: StorageKey, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

/** JSON.stringify + write a value. */
export async function setJSON<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
