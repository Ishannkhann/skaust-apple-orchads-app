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
  onDelete,
}: {
  orchardData: any;
  resolvedCity: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="flex-1 space-y-4">

      {/* Section Header: Orchard Specifications */}
      <View className="flex-row items-center mb-1">
        <View className="w-1.5 h-1.5 rounded-full bg-brand-green mr-2" />
        <Text
          style={{ fontFamily: Fonts.bold }}
          className={`text-[10px] tracking-[1.2px] uppercase ${
            isDark ? "text-white/60" : "text-brand-text/60"
          }`}
        >
          ORCHARD SPECIFICATIONS
        </Text>
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

      {/* Bottom Actions: dashboard-style buttons */}
      <View className="flex-row mt-2">
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Edit orchard information"
          className={`flex-1 h-12 rounded-2xl flex-row items-center justify-center mr-3 ${
            isDark ? "bg-brand-green-dark" : "bg-brand-green"
          }`}
        >
          <Ionicons name="create-outline" size={18} color="white" />
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className="text-white ml-2 text-sm"
          >
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Delete orchard"
          className={`flex-1 h-12 rounded-2xl flex-row items-center justify-center ${
            isDark ? "bg-red-600" : "bg-red-500"
          }`}
        >
          <Ionicons name="trash-outline" size={18} color="white" />
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className="text-white ml-2 text-sm"
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
