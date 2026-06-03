import { useEffect, useState } from "react";

import { DEMO_NOTIFICATIONS } from "@/constants/notifications";
import { getJSON, removeItem, setItem, setJSON, StorageKeys } from "@/lib/storage";
import type { NotificationItem } from "@/types/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    loadNotifications();
    clearNotificationCount();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await getJSON<NotificationItem[] | null>(
        StorageKeys.notifications,
        null
      );

      if (stored) {
        setNotifications(stored);
      } else {
        setNotifications(DEMO_NOTIFICATIONS);
        await setJSON(StorageKeys.notifications, DEMO_NOTIFICATIONS);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearNotificationCount = async () => {
    try {
      await setItem(StorageKeys.notificationCount, "0");
    } catch (error) {
      console.log(error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      setNotifications([]);
      await removeItem(StorageKeys.notifications);
    } catch (error) {
      console.log(error);
    }
  };

  return { notifications, clearAllNotifications };
}
