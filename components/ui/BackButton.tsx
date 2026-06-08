import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface BackButtonProps {
  onPress: () => void;
  /** When true, positions the button absolutely in the top-left with safe area insets */
  absolute?: boolean;
  /** Additional styles */
  style?: any;
  /** Optional size override (default 44) */
  size?: number;
}

export default function BackButton({
  onPress,
  absolute = false,
  style,
  size = 44,
}: BackButtonProps) {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  const buttonSize = size;
  const iconSize = size * 0.45;

  const absoluteStyles = absolute
    ? {
        position: "absolute" as const,
        top: insets.top + 12,
        left: 20,
        zIndex: 50,
      }
    : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`rounded-full items-center justify-center ${
        isDark ? "bg-slate-800" : "bg-white"
      }`}
      style={[
        {
          width: buttonSize,
          height: buttonSize,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        },
        absoluteStyles,
        style,
      ]}
    >
      <Ionicons
        name="arrow-back"
        size={iconSize}
        color={isDark ? "#fff" : "#243022"}
      />
    </TouchableOpacity>
  );
}
