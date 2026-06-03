import React from "react";

import { View, TextInput, TouchableOpacity, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";

/**
 * Search input for My Orchards.
 * Markup copied from my-orchards.tsx; rebranded to the home palette.
 */
export default function OrchardSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="px-5 mt-4">
      <View
        className={`flex-row items-center gap-2 rounded-2xl px-4 py-2.5 border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-edge-green"
        }`}
      >
        <Ionicons
          name="search-outline"
          size={16}
          color={isDark ? "#9ca3af" : Colors.brandGreen}
        />
        <TextInput
          className={`flex-1 text-sm ${
            isDark ? "text-white" : "text-brand-text"
          }`}
          placeholder="Search orchards..."
          placeholderTextColor={isDark ? "#6b7280" : Colors.brandSage}
          value={value}
          onChangeText={onChange}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")}>
            <Ionicons
              name="close-circle"
              size={16}
              color={isDark ? "#6b7280" : Colors.brandSage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
