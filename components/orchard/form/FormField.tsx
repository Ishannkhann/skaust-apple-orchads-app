import React from "react";

import { View, TextInput, useColorScheme } from "react-native";
import type { TextInputProps } from "react-native";

import FieldLabel from "@/components/orchard/form/FieldLabel";

/**
 * Labeled text input.
 *
 * NOTE: For numeric/decimal-pad keyboards, `className` + `style`
 * on TextInput can silently block text entry on some Expo SDK 55 /
 * NativeWind v4 setups. We therefore use ONLY inline `style` on the
 * TextInput — never `className`.
 */
export default function FormField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  keyboardType,
  maxLength,
  containerClassName,
}: {
  label: string;
  icon?: any;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: TextInputProps["keyboardType"];
  maxLength?: number;
  containerClassName?: string;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={{ marginBottom: 14 }}>
      <FieldLabel
        icon={icon ?? "create-outline"}
        label={label}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={
          placeholderTextColor ?? (isDark ? "#64748b" : "#94a3b8")
        }
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable
        style={{
          fontFamily: undefined,
          fontSize: 14,
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          borderWidth: 1,
          borderColor: isDark ? "#334155" : "#8BA862",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: isDark ? "#f1f5f9" : "#33422A",
          includeFontPadding: false,
        }}
      />
    </View>
  );
}
