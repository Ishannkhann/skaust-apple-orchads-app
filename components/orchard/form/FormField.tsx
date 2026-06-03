import React from "react";

import { View, Text, TextInput, useColorScheme } from "react-native";
import type { TextInputProps } from "react-native";

import { Fonts } from "@/theme/fonts";

/**
 * Labeled text input used across the add-orchard steps.
 * Markup/classes mirror the previous inline inputs; rebranded to home tokens.
 */
export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = "#888",
  keyboardType,
  containerClassName,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: TextInputProps["keyboardType"];
  containerClassName?: string;
}) {
  const isDark = useColorScheme() === "dark";

  const inputBase = "rounded-2xl px-5 py-5 text-lg border";
  const inputStyle = isDark
    ? `${inputBase} bg-slate-800 text-white border-slate-700`
    : `${inputBase} bg-white text-brand-text border-edge-green`;

  return (
    <View className={containerClassName}>
      <Text
        style={{ fontFamily: Fonts.semibold }}
        className={`mb-2 text-base ${
          isDark ? "text-gray-300" : "text-brand-text"
        }`}
      >
        {label}
      </Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        className={inputStyle}
        style={{
          textAlignVertical: "center",
          fontFamily: Fonts.medium,
        }}
      />
    </View>
  );
}
