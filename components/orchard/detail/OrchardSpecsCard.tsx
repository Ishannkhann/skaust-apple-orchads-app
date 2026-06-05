import React from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";

/**
 * A single spec row (icon + label + value) inside the specifications card.
 * Extracted from the repeated rows in the original Orchard Info tab.
 */
function SpecRow({
  icon,
  label,
  value,
  className = "",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <View className={`flex-row items-center ${className}`}>
      <View className="w-9 h-9 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-3.5">
        <Ionicons name={icon} size={16} color="#469e80" />
      </View>
      <View className="flex-1">
        <Text
          style={{ fontFamily: Fonts.medium }}
          className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold"
        >
          {label}
        </Text>
        <Text
          style={{ fontFamily: Fonts.semibold }}
          className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5"
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/**
 * Orchard Info tab content: the specifications card + optional setup-notes card.
 * Markup/classes copied verbatim from the screen.
 */
export default function OrchardSpecsCard({
  orchardData,
  resolvedCity,
  onEdit,
}: {
  orchardData: any;
  resolvedCity: string;
  onEdit: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="flex-1 space-y-4">

      {/* Section Header: Orchard Specifications (with Edit button) */}
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
          <Text
            style={{ fontFamily: Fonts.bold }}
            className={`text-[10px] tracking-[1.2px] uppercase ${
              isDark ? "text-white/60" : "text-green-900/60"
            }`}
          >
            ORCHARD SPECIFICATIONS
          </Text>
        </View>

        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Edit orchard information"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className={`flex-row items-center rounded-full px-3 py-1.5 ${
            isDark ? "bg-emerald-950/40" : "bg-[#e8f5e9]"
          }`}
        >
          <Ionicons name="create-outline" size={13} color="#469e80" />
          <Text
            style={{ fontFamily: Fonts.semibold, color: "#469e80" }}
            className="text-[10px] tracking-[0.5px] uppercase ml-1"
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Primary Specifications Card (Stacked layout) */}
      <View
        className={`rounded-[24px] border p-5 ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-[#e2f0d9]"
        }`}
      >
        <SpecRow
          icon="leaf-outline"
          label="Orchard Name"
          value={orchardData?.name || "Valley Orchard"}
          className="pb-3 border-b border-[#f1f5f9] dark:border-slate-800/60"
        />
        <SpecRow
          icon="basket-outline"
          label="Crop Type"
          value={orchardData?.orchardType || "Apple Orchard"}
          className="py-3 border-b border-[#f1f5f9] dark:border-slate-800/60"
        />
        <SpecRow
          icon="git-branch-outline"
          label="Variety"
          value={orchardData?.variety || "Honeycrisp, Gala"}
          className="py-3 border-b border-[#f1f5f9] dark:border-slate-800/60"
        />
        <SpecRow
          icon="resize-outline"
          label="Total Area"
          value={orchardData?.area || "14.5 Acres"}
          className="py-3 border-b border-[#f1f5f9] dark:border-slate-800/60"
        />
        <SpecRow
          icon="location-outline"
          label="Location"
          value={orchardData?.location || resolvedCity}
          className="pt-3"
        />
      </View>

      {/* Optional Note / Message Card from Orchard Setup */}
      {orchardData?.message && (
        <View>
          <View className="bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-amber-400 p-4 rounded-r-2xl border border-t-amber-100/30 border-r-amber-100/30 border-b-amber-100/30">
            <View className="flex-row items-center mb-1">
              <Ionicons name="bookmark" size={13} color="#d97706" />
              <Text
                style={{ fontFamily: Fonts.bold }}
                className="text-[#b45309] dark:text-amber-400 text-xs font-bold ml-1.5 uppercase tracking-wide"
              >
                Setup Notes
              </Text>
            </View>
            <Text
              style={{ fontFamily: Fonts.medium }}
              className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed mt-1"
            >
              {orchardData.message}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
