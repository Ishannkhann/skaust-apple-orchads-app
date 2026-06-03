import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

const CARD_HEIGHT = 200;

/**
 * Empty state shown on Home when there are no orchards yet.
 * Markup/classes copied verbatim from app/home.tsx.
 */
export default function EmptyOrchards({ onPress }: { onPress: () => void }) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="px-5 mt-4 items-center justify-center">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className={`w-full rounded-3xl border border-dashed p-8 items-center justify-center ${
          isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-edge-green-soft"
        }`}
        style={{ minHeight: CARD_HEIGHT }}
      >
        <View
          className={`w-16 h-16 rounded-2xl items-center justify-center ${
            isDark ? "bg-brand-green-dark" : "bg-surface-track"
          }`}
        >
          <Ionicons
            name="add"
            size={32}
            color={isDark ? Colors.surfaceHighlight : Colors.brandGreenDark}
          />
        </View>

        <Text
          style={{ fontFamily: Fonts.bold }}
          className={`text-xl mt-5 ${
            isDark ? "text-white" : "text-brand-text"
          }`}
        >
          Add Your First Orchard
        </Text>

        <Text
          style={{ fontFamily: Fonts.medium }}
          className={`text-center mt-2 leading-6 ${
            isDark ? "text-gray-400" : "text-brand-green"
          }`}
        >
          Start managing your orchards, monitoring fields, and
          viewing agricultural insights.
        </Text>
      </TouchableOpacity>
    </View>
  );
}
