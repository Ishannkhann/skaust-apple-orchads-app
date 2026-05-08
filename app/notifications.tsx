import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Bell,
  CloudRain,
  TriangleAlert,
  Leaf,
} from "lucide-react-native";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type:
    | "weather"
    | "warning"
    | "advisory";
  time: string;
}

export default function NotificationsScreen() {
  const isDark =
    useColorScheme() === "dark";

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      []
    );

  // LOAD NOTIFICATIONS
  useEffect(() => {
    loadNotifications();
    clearNotificationCount();
  }, []);

  const loadNotifications =
    async () => {
      try {
        const stored =
          await AsyncStorage.getItem(
            "notifications"
          );

        if (stored) {
          setNotifications(
            JSON.parse(stored)
          );
        } else {
          // DEMO DATA
          const demoNotifications: NotificationItem[] =
            [
              {
                id: "1",
                title:
                  "Rain Alert",
                message:
                  "Heavy rainfall expected tomorrow in your orchard area. Prepare drainage systems and avoid spraying pesticides.",
                type: "weather",
                time: "10 mins ago",
              },

              {
                id: "2",
                title:
                  "Apple Advisory",
                message:
                  "Current humidity levels may increase fungal risk. Recommended fungicide spray window available today.",
                type: "advisory",
                time: "1 hour ago",
              },

              {
                id: "3",
                title:
                  "Strong Wind Warning",
                message:
                  "Strong winds expected tonight. Secure support structures and orchard protection nets.",
                type: "warning",
                time: "3 hours ago",
              },

              {
                id: "4",
                title:
                  "Temperature Advisory",
                message:
                  "Night temperatures may drop significantly this week. Consider frost protection measures.",
                type: "weather",
                time: "Yesterday",
              },
            ];

          setNotifications(
            demoNotifications
          );

          await AsyncStorage.setItem(
            "notifications",
            JSON.stringify(
              demoNotifications
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  // CLEAR BELL COUNT
  const clearNotificationCount =
    async () => {
      try {
        await AsyncStorage.setItem(
          "notification_count",
          "0"
        );
      } catch (error) {
        console.log(error);
      }
    };

  // CLEAR ALL NOTIFICATIONS
  const clearAllNotifications =
    async () => {
      try {
        setNotifications([]);

        await AsyncStorage.removeItem(
          "notifications"
        );
      } catch (error) {
        console.log(error);
      }
    };

  // ICONS
  const renderIcon = (
    type: string
  ) => {
    switch (type) {
      case "weather":
        return (
          <CloudRain
            size={24}
            color="#2563eb"
          />
        );

      case "warning":
        return (
          <TriangleAlert
            size={24}
            color="#dc2626"
          />
        );

      default:
        return (
          <Leaf
            size={24}
            color="#15803d"
          />
        );
    }
  };

  // NOTIFICATION CARD
  const renderItem = ({
    item,
  }: {
    item: NotificationItem;
  }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      className={`mx-5 mb-4 rounded-3xl p-5 border ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-green-100"
      }`}
    >
      <View className="flex-row">

        {/* ICON */}
        <View className="mr-4 mt-1">
          {renderIcon(item.type)}
        </View>

        {/* CONTENT */}
        <View className="flex-1">

          <Text
            className={`text-base font-bold ${
              isDark
                ? "text-white"
                : "text-green-950"
            }`}
          >
            {item.title}
          </Text>

          <Text
            className={`mt-2 leading-6 ${
              isDark
                ? "text-gray-400"
                : "text-green-800"
            }`}
          >
            {item.message}
          </Text>

          <Text
            className={`mt-3 text-xs ${
              isDark
                ? "text-slate-500"
                : "text-green-600"
            }`}
          >
            {item.time}
          </Text>

        </View>

      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark
          ? "bg-slate-950"
          : "bg-lime-50"
      }`}
    >

      {/* HEADER */}
      <View className="px-5 pt-3 pb-5 flex-row items-center justify-between">

        <View className="flex-row items-center">

          <Bell
            size={24}
            color={
              isDark
                ? "white"
                : "#052e16"
            }
          />

          <Text
            className={`text-2xl font-bold ml-3 ${
              isDark
                ? "text-white"
                : "text-green-950"
            }`}
          >
            Notifications
          </Text>

        </View>

        {notifications.length >
          0 && (
          <TouchableOpacity
            onPress={
              clearAllNotifications
            }
          >
            <Text className="text-red-500 font-semibold">
              Clear All
            </Text>
          </TouchableOpacity>
        )}

      </View>

      {/* LIST */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-40">

            <Bell
              size={70}
              color={
                isDark
                  ? "#475569"
                  : "#bbf7d0"
              }
            />

            <Text
              className={`text-lg font-semibold mt-5 ${
                isDark
                  ? "text-gray-400"
                  : "text-green-800"
              }`}
            >
              No Notifications Yet
            </Text>

          </View>
        }
      />

    </SafeAreaView>
  );
}
