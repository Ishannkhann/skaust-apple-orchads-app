import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";

/**
 * The green hero header on My Orchards (back link + count + subtitle).
 * Markup copied from my-orchards.tsx; rebranded to the home palette
 * (green-900 header -> brand-text surface, accents -> brand greens).
 */
export default function MyOrchardsHeader({
  count,
  onBack,
}: {
  count: number;
  onBack: () => void;
}) {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`px-5 pb-5 ${isDark ? "bg-slate-900" : "bg-brand-text"}`}
      style={{ paddingTop: insets.top + 12 }}
    >
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        className="flex-row items-center gap-1 mb-3"
      >
        <Ionicons name="arrow-back" size={16} color={Colors.brandSage} />
        <Text className="text-sm text-brand-sage">Back</Text>
      </TouchableOpacity>

      <Text className="text-xs font-medium tracking-widest text-brand-sage uppercase mb-1">
        My orchards
      </Text>

      <Text className="text-2xl font-bold text-surface-light">
        {count} {count === 1 ? "Orchard" : "Orchards"}
      </Text>

      <Text className="text-sm text-brand-sage mt-0.5">Last updated today</Text>
    </View>
  );
}
