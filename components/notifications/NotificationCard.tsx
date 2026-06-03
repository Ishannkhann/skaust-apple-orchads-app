import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import type { NotificationItem } from "@/types/notification";
import NotificationIcon from "./NotificationIcon";

export default function NotificationCard({ item }: { item: NotificationItem }) {
  const isDark = useColorScheme() === "dark";

  return (
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
          <NotificationIcon type={item.type} />
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
}
