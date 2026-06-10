import React from "react";

import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/theme/fonts";

/**
 * Compact icon + uppercase label row used above form inputs.
 * Mirrors the FieldLabel component in EditOrchardModal.
 */
export default function FieldLabel({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View className="flex-row items-center mb-1.5">
      <View className="w-7 h-7 rounded-full bg-surface-track dark:bg-slate-800 items-center justify-center mr-2.5">
        <Ionicons name={icon} size={14} color="#6D8B4F" />
      </View>
      <Text
        style={{ fontFamily: Fonts.semibold }}
        className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {label}
      </Text>
    </View>
  );
}
