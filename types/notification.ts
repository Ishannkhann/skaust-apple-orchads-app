export type NotificationType = "weather" | "warning" | "advisory";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
}
