import React from "react";

import { CloudRain, TriangleAlert, Leaf } from "lucide-react-native";

import type { NotificationType } from "@/types/notification";

export default function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "weather":
      return <CloudRain size={24} color="#2563eb" />;

    case "warning":
      return <TriangleAlert size={24} color="#dc2626" />;

    default:
      return <Leaf size={24} color="#15803d" />;
  }
}
