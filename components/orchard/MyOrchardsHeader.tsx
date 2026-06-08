import React from "react";

import { View, Text, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackButton from "@/components/ui/BackButton";
import { Fonts } from "@/theme/fonts";

/**
 * My Orchards header, updated for consistency with the rest of the app:
 * - Floating circular back button (same as Notifications and detail screens)
 * - Adaptive header bg (dark brand-text in dark mode to match hero style; light surface-light in light mode)
 * - Title block (small label + count + subtitle) centered horizontally + vertically lower
 * - Back button high on left (near status/time), title block lower to clear Dynamic Island/notch
 * - Back button on left, title centered, no right action in this header
 * - Adaptive text colors for light/dark modes
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

  // Title block needs significantly higher top offset (beyond insets.top) to sit below
  // Dynamic Island (which protrudes ~30-40px in center). Back stays high at +12.
  // Multi-line title block is taller, so higher offset + minHeight to contain it fully and clear island.
  // Proper spacing: titleTop +160 / minHeight +260 so the full block ("MY ORCHARDS" + count + subtitle)
  // clears the Dynamic Island with good visual gap before the search bar.
  const titleTop = insets.top + 15;

  return (
    <View
      className={`px-5 pb-5 flex-row items-center ${isDark ? "bg-brand-text" : "bg-surface-light"}`}
      style={{
        paddingTop: insets.top + 12,
        minHeight: insets.top + 90, // extends bg under notch + fully under title block + padding below before search
      }}
    >
      {/* Floating circular back button high on left (near status bar/time level) */}
      {onBack && <BackButton absolute onPress={onBack} />}

      {/* Title block absolutely centered horizontally (left-0/right-0 + justify-center),
          positioned lower independently of back button to clear Dynamic Island.
          Uses absolute to ignore side element widths for true center. */}
      <View
        className="absolute left-0 right-0 flex-row items-center justify-center"
        style={{ top: titleTop }}
      >
        <View className="items-center">
          <Text
            style={{ fontFamily: Fonts.bold }}
            className={`text-sm tracking-widest uppercase mb-1 ${
              isDark ? "text-white/70" : "text-brand-text"
            }`}
          >
            MY ORCHARDS
          </Text>

          <Text
            style={{ fontFamily: Fonts.bold }}
            className={`text-2xl ${isDark ? "text-white" : "text-brand-text"}`}
          >
            {count} {count === 1 ? "Orchard" : "Orchards"}
          </Text>

          <Text
            style={{ fontFamily: Fonts.medium }}
            className={`text-sm mt-0.5 ${isDark ? "text-white/50" : "text-brand-green"}`}
          >
            Last updated today
          </Text>
        </View>
      </View>
    </View>
  );
}
