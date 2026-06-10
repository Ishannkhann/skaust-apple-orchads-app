import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/theme/fonts";
import FieldLabel from "@/components/orchard/form/FieldLabel";

/**
 * Labeled, tappable selector row — styled to match EditOrchardModal dropdowns.
 *
 * - Compact icon label
 * - `rounded-2xl border px-4 py-3.5` with chevron
 * - Dark:  bg-slate-800 border-slate-700
 * - Light: bg-white border-edge-green
 */
export default function DropdownField({
  label,
  icon,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  icon?: any;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  const cardClasses = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-edge-green";

  return (
    <View className="mb-3.5">
      <FieldLabel
        icon={icon ?? "chevron-down-circle-outline"}
        label={label}
      />
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${cardClasses}`}
      >
        <Text
          style={{ fontFamily: Fonts.medium }}
          numberOfLines={2}
          className={`text-sm flex-1 pr-3 ${
            value
              ? isDark
                ? "text-white"
                : "text-brand-text"
              : "text-slate-400"
          }`}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={isDark ? "#cbd5e1" : "#6D8B4F"}
        />
      </TouchableOpacity>
    </View>
  );
}
    