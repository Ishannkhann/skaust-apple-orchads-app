import type { NotificationItem } from "@/types/notification";

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Rain Alert",
    message:
      "Heavy rainfall expected tomorrow in your orchard area. Prepare drainage systems and avoid spraying pesticides.",
    type: "weather",
    time: "10 mins ago",
  },
  {
    id: "2",
    title: "Apple Advisory",
    message:
      "Current humidity levels may increase fungal risk. Recommended fungicide spray window available today.",
    type: "advisory",
    time: "1 hour ago",
  },
  {
    id: "3",
    title: "Strong Wind Warning",
    message:
      "Strong winds expected tonight. Secure support structures and orchard protection nets.",
    type: "warning",
    time: "3 hours ago",
  },
  {
    id: "4",
    title: "Temperature Advisory",
    message:
      "Night temperatures may drop significantly this week. Consider frost protection measures.",
    type: "weather",
    time: "Yesterday",
  },
];
