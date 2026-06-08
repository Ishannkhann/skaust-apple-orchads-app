import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Bell } from "lucide-react-native";

import BackButton from "@/components/ui/BackButton";

export default function NotificationsHeader({
  showClearAll,
  onClearAll,
  onBack,
}: {
  showClearAll: boolean;
  onClearAll: () => void;
  onBack?: () => void;
}) {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  return (
    <View
      className="px-5 pb-5 flex-row items-center justify-between relative"
      style={{ paddingTop: insets.top + 12 }}
    >
      {/* Left: Back button */}
      {onBack && <BackButton onPress={onBack} />}

      {/* Center: Bell + Title (absolutely centered, vertically and horizontally) */}
      <View className="absolute left-0 right-0 top-0 bottom-0 flex-row items-center justify-center">
        <Bell
          size={24}
          color={isDark ? "white" : "#052e16"}
        />
        <Text
          className={`text-2xl font-bold ml-3 leading-none ${
            isDark ? "text-white" : "text-green-950"
          }`}
        >
          Notifications
        </Text>
      </View>

      {/* Right: Clear All */}
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
