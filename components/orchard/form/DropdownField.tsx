import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import { Fonts } from "@/theme/fonts";

/**
 * A labeled, tappable selector that opens a modal picker.
 * Mirrors the previous inline `Dropdown` helper in add-step-2/3; rebranded.
 */
export default function DropdownField({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  const cardClass = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-edge-green";

  const textPrimary = isDark ? "text-white" : "text-brand-text";
  const textSecondary = isDark ? "text-gray-400" : "text-brand-green";

  return (
    <View className="mt-6">
      <Text
        style={{ fontFamily: Fonts.semibold }}
        className={`mb-2 text-base ${textPrimary}`}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={onPress}
        className={`px-5 py-5 rounded-2xl border ${cardClass}`}
      >
        <Text
          style={{ fontFamily: Fonts.medium }}
          className={value ? textPrimary : textSecondary}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
