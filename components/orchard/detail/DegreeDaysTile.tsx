import React from "react";

import { View, Text, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";

/**
 * "Growing Degree Days" summary tile on orchard-detail.
 * Markup/classes copied verbatim from the screen (static content).
 */
export default function DegreeDaysTile() {
  const isDark = useColorScheme() === "dark";

  return (
    <View
      className={`mt-4 rounded-2xl border px-5 py-4 flex-row items-center justify-between ${
        isDark
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-[#e2f0d9]"
      }`}
      style={{
        shadowColor: isDark ? "#000" : "#6b8f71",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3.5 ${
            isDark ? "bg-amber-950/40" : "bg-amber-50"
          }`}
        >
          <Ionicons
            name="thermometer-outline"
            size={20}
            color={isDark ? "#fbbf24" : "#d97706"}
          />
        </View>
        <View>
          <Text
            style={{ fontFamily: Fonts.medium }}
            className={`text-[10px] uppercase tracking-[1.2px] ${
              isDark ? "text-slate-400" : "text-green-900/50"
            }`}
          >
            Growing Degree Days
          </Text>
          <Text
            style={{ fontFamily: Fonts.bold }}
            className={`text-2xl font-bold mt-0.5 ${
              isDark ? "text-white" : "text-[#1b3d2f]"
            }`}
          >
            222.2
            <Text
              style={{ fontFamily: Fonts.medium }}
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-[#6b8f71]"
              }`}
            >
              {" "}°C
            </Text>
          </Text>
        </View>
      </View>
      <View
        className={`rounded-full px-3 py-1.5 ${
          isDark ? "bg-emerald-950/30" : "bg-[#e8f5e9]"
        }`}
      >
        <View className="flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          <Text
            style={{ fontFamily: Fonts.semibold, fontSize: 10 }}
            className={isDark ? "text-emerald-400" : "text-[#2d8a56]"}
          >
            Active Growing
          </Text>
        </View>
      </View>
    </View>
  );
}
