import React from "react";

import { View, Text, useColorScheme } from "react-native";

import { Fonts } from "@/theme/fonts";

export default function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="mb-14">

      <Text
        style={{ fontFamily: Fonts.bold }}
        className={`text-4xl text-center mb-3 ${
          isDark ? "text-white" : "text-brand-text"
        }`}
      >
        {title}
      </Text>

      <Text
        style={{ fontFamily: Fonts.medium }}
        className={`text-center text-base leading-6 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {subtitle}
      </Text>

    </View>
  );
}
