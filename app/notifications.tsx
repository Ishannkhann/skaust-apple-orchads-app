import React from "react";

import { FlatList, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useNotifications } from "@/hooks/useNotifications";
import EmptyNotifications from "@/components/notifications/EmptyNotifications";
import NotificationCard from "@/components/notifications/NotificationCard";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";

export default function NotificationsScreen() {
  const isDark = useColorScheme() === "dark";

  const { notifications, clearAllNotifications } = useNotifications();

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark
          ? "bg-slate-950"
          : "bg-lime-50"
      }`}
    >

      <NotificationsHeader
        showClearAll={notifications.length > 0}
        onClearAll={clearAllNotifications}
      />

      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ListEmptyComponent={<EmptyNotifications />}
      />

    </SafeAreaView>
  );
}
