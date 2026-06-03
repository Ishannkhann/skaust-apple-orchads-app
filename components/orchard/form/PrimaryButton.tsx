import React from "react";

import { TouchableOpacity, Text } from "react-native";

import { Fonts } from "@/theme/fonts";

/**
 * The green primary action button used at the bottom of each add-orchard step.
 * Rebranded to the home palette (green-600 -> brand-green).
 */
export default function PrimaryButton({
  label,
  onPress,
  className = "",
  textClassName = "text-white text-center text-lg",
}: {
  label: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`bg-brand-green py-5 rounded-2xl ${className}`}
    >
      <Text style={{ fontFamily: Fonts.semibold }} className={textClassName}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
