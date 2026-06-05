import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

/**
 * Home / Orchard Info tab selector on orchard-detail.
 * Markup/classes copied verbatim from the screen.
 */
export default function DetailTabs({
  activeTab,
  onChange,
}: {
  activeTab: "home" | "info";
  onChange: (tab: "home" | "info") => void;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="mt-4 flex-row bg-white/70 dark:bg-slate-800 rounded-2xl p-1">
      <TouchableOpacity
        onPress={() => onChange("home")}
        className="flex-1 py-3 rounded-xl items-center"
        style={{
          backgroundColor: activeTab === "home" ? "#009e4f" : "transparent",
        }}
      >
        <Text
          className={`font-semibold ${
            activeTab === "home"
              ? "text-white"
              : isDark
              ? "text-white"
              : "text-black"
          }`}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("info")}
        className="flex-1 py-3 rounded-xl items-center"
        style={{
          backgroundColor: activeTab === "info" ? "#009e4f" : "transparent",
        }}
      >
        <Text
          className={`font-semibold ${
            activeTab === "info"
              ? "text-white"
              : isDark
              ? "text-white"
              : "text-black"
          }`}
        >
          Orchard Info
        </Text>
      </TouchableOpacity>
    </View>
  );
}
