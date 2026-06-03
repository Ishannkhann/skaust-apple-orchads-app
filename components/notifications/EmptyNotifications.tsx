import React from "react";

import { View, Text, useColorScheme } from "react-native";

import { Bell } from "lucide-react-native";

export default function EmptyNotifications() {
  const isDark = useColorScheme() === "dark";

  return (
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
  );
}
