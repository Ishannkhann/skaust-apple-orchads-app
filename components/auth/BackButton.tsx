import React from "react";

import { View, TouchableOpacity, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";

export default function BackButton({ onPress }: { onPress: () => void }) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="px-6 pt-2">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`w-11 h-11 rounded-full items-center justify-center ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          elevation: 3,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={isDark ? "#fff" : Colors.brandText}
        />
      </TouchableOpacity>
    </View>
  );
}
