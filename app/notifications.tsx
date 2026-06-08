import React from "react";

import { FlatList, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useNotifications } from "@/hooks/useNotifications";
import EmptyNotifications from "@/components/notifications/EmptyNotifications";
import NotificationCard from "@/components/notifications/NotificationCard";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";

export default function NotificationsScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const { notifications, clearAllNotifications } = useNotifications();

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
    >
      <NotificationsHeader
        showClearAll={notifications.length > 0}
        onClearAll={clearAllNotifications}
        onBack={() => router.back()}
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
