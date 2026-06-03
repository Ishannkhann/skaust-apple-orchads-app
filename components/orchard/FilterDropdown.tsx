import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";

/**
 * Orchard-type filter dropdown for My Orchards.
 * Markup copied from my-orchards.tsx; rebranded to the home palette
 * (green accents -> brand greens).
 */
export default function FilterDropdown({
  options,
  active,
  onSelect,
}: {
  options: string[];
  active: string;
  onSelect: (val: string) => void;
}) {
  const isDark = useColorScheme() === "dark";
  const [open, setOpen] = React.useState(false);

  return (
    <View style={{ position: "relative", zIndex: 10 }}>
      <TouchableOpacity
        onPress={() => setOpen((o) => !o)}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        className={`rounded-2xl px-4 py-2.5 border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-edge-green"
        }`}
      >
        <Ionicons
          name="options-outline"
          size={15}
          color={isDark ? "#9ca3af" : Colors.brandGreen}
        />
        <Text
          numberOfLines={1}
          style={{ maxWidth: 180 }}
          className={`text-sm font-medium ${
            active !== "All"
              ? isDark
                ? "text-brand-sage"
                : "text-brand-green"
              : isDark
              ? "text-gray-400"
              : "text-brand-text"
          }`}
        >
          {active === "All" ? "All types" : active}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={14}
          color={isDark ? "#9ca3af" : Colors.brandGreen}
        />
      </TouchableOpacity>

      {open && (
        <View
          style={{ position: "absolute", top: 46, left: 0, right: 0, minWidth: 220, zIndex: 999 }}
          className={`rounded-2xl border overflow-hidden ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-edge-green"
          }`}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => { onSelect(opt); setOpen(false); }}
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 }}
              className={opt !== options[options.length - 1]
                ? isDark ? "border-b border-slate-700" : "border-b border-edge-green"
                : ""}
            >
              <Text
                numberOfLines={1}
                style={{ flex: 1 }}
                className={`text-sm ${
                  active === opt
                    ? isDark
                      ? "text-brand-sage font-semibold"
                      : "text-brand-green font-semibold"
                    : isDark
                    ? "text-gray-300"
                    : "text-brand-text"
                }`}
              >
                {opt === "All" ? "All types" : opt}
              </Text>
              {active === opt && (
                <Ionicons name="checkmark" size={16} color={isDark ? Colors.brandSage : Colors.brandGreen} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
