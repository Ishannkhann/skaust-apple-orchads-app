import React from "react";

import { Text, useColorScheme } from "react-native";

import { Fonts } from "@/theme/fonts";

/**
 * Title + step subtitle used at the top of each add-orchard step.
 * Rebranded to the home palette.
 */
export default function StepHeader({
  title,
  subtitle,
  titleClassName = "text-3xl",
}: {
  title: string;
  subtitle: string;
  titleClassName?: string;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <>
      <Text
        style={{ fontFamily: Fonts.bold }}
        className={`${titleClassName} ${
          isDark ? "text-white" : "text-brand-text"
        }`}
      >
        {title}
      </Text>

      <Text
        style={{ fontFamily: Fonts.medium }}
        className={`text-base ${
          isDark ? "text-gray-400" : "text-brand-green"
        }`}
      >
        {subtitle}
      </Text>
    </>
  );
}
