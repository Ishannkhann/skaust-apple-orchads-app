import { getItem, removeItem, setItem, StorageKeys } from "./storage";

/** Persist a successful login. Same values as before: "true" + phone string. */
export async function saveSession(phone: string): Promise<void> {
  await setItem(StorageKeys.isLoggedIn, "true");
  await setItem(StorageKeys.userPhone, phone);
}

/** Whether a user session exists. */
export async function isLoggedIn(): Promise<boolean> {
  const value = await getItem(StorageKeys.isLoggedIn);
  return value === "true";
}

/** The stored phone number for the current session (or null). */
export async function getUserPhone(): Promise<string | null> {
  return getItem(StorageKeys.userPhone);
}

/** Clear the session (logout). */
export async function clearSession(): Promise<void> {
  await removeItem(StorageKeys.isLoggedIn);
  await removeItem(StorageKeys.userPhone);
}
