import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import { Fonts } from "@/theme/fonts";
import { Colors } from "@/theme/colors";

/**
 * Home / Orchard Info tab selector on orchard-detail.
 * Rebranded to match the dashboard/home button palette.
 */
export default function DetailTabs({
  activeTab,
  onChange,
}: {
  activeTab: "home" | "info";
  onChange: (tab: "home" | "info") => void;
}) {
  const isDark = useColorScheme() === "dark";
  const activeColor = isDark ? Colors.brandGreenDark : Colors.brandGreen;

  const tabTextClass = (active: boolean) =>
    active
      ? "text-white"
      : isDark
      ? "text-gray-300"
      : "text-brand-text";

  return (
    <View
      className={`mt-4 flex-row rounded-2xl p-1 border ${
        isDark
          ? "bg-slate-900 border-slate-800"
          : "bg-white/80 border-edge-green"
      }`}
    >
      <TouchableOpacity
        onPress={() => onChange("home")}
        activeOpacity={0.85}
        className="flex-1 py-3 rounded-xl items-center"
        style={{
          backgroundColor: activeTab === "home" ? activeColor : "transparent",
        }}
      >
        <Text
          style={{ fontFamily: Fonts.semibold }}
          className={tabTextClass(activeTab === "home")}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("info")}
        activeOpacity={0.85}
        className="flex-1 py-3 rounded-xl items-center"
        style={{
          backgroundColor: activeTab === "info" ? activeColor : "transparent",
        }}
      >
        <Text
          style={{ fontFamily: Fonts.semibold }}
          className={tabTextClass(activeTab === "info")}
        >
          Orchard Info
        </Text>
      </TouchableOpacity>
    </View>
  );
}
