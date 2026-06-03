import React from "react";

import { View, Text, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

/**
 * Empty state for the My Orchards grid.
 * Markup copied from my-orchards.tsx; rebranded to the home palette.
 */
export default function EmptyOrchardsList({
  isFiltered,
}: {
  isFiltered: boolean;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="items-center pt-16 px-8">
      <Ionicons
        name="leaf-outline"
        size={52}
        color={isDark ? "#374151" : "#bbf7d0"}
      />
      <Text
        className={`text-lg font-bold mt-4 text-center ${
          isDark ? "text-white" : "text-brand-text"
        }`}
      >
        No orchards found
      </Text>
      <Text
        className={`text-sm text-center mt-2 leading-6 ${
          isDark ? "text-gray-400" : "text-brand-green"
        }`}
      >
        {isFiltered
          ? "Try adjusting your search or filter."
          : "Add your first orchard to get started."}
      </Text>
    </View>
  );
}
