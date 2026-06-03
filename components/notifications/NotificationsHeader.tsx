import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import { Bell } from "lucide-react-native";

export default function NotificationsHeader({
  showClearAll,
  onClearAll,
}: {
  showClearAll: boolean;
  onClearAll: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  return (
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

      {showClearAll && (
        <TouchableOpacity onPress={onClearAll}>
          <Text className="text-red-500 font-semibold">
            Clear All
          </Text>
        </TouchableOpacity>
      )}

    </View>
  );
}
