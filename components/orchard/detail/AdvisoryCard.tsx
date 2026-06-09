import React from "react";

import { View, Text, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";

/**
 * Minimalist spray-nozzle + droplet icon used by the advisory card.
 * Moved verbatim from orchard-detail.tsx (one-off neutral colors kept inline).
 */
function AdvisoryIcon() {
  const isDark = useColorScheme() === "dark";
  return (
    <View
      className={`w-14 h-14 rounded-full border items-center justify-center ${
        isDark ? "border-slate-800 bg-slate-900" : "border-edge-green bg-surface-light"
      }`}
    >
      <View className="items-center justify-center relative w-10 h-10">
        <View className="w-5 h-1 bg-[#8fa499] rounded-full absolute top-[5px]" />
        <View className="w-[2px] h-3.5 bg-[#8fa499] absolute top-[6px]" />
        <View
          className={`w-6 h-6 rounded-full border absolute bottom-[3px] items-center justify-center ${
            isDark ? "border-slate-700 bg-slate-950" : "border-edge-green-soft bg-white"
          }`}
        >
          <View className="w-2.5 h-2.5 rounded-full bg-[#ca6a24] shadow-sm" />
        </View>
      </View>
    </View>
  );
}

/**
 * Orchard Advisory card on orchard-detail (static content).
 * Markup/classes copied verbatim from the screen.
 */
export default function AdvisoryCard() {
  const isDark = useColorScheme() === "dark";

  return (
    <View>
      <View className="flex-row items-center mb-2">
        <View className="w-1.5 h-1.5 rounded-full bg-brand-green mr-2" />
        <Text
          style={{ fontFamily: Fonts.bold }}
          className={`text-[10px] tracking-[1.2px] uppercase ${
            isDark ? "text-white/60" : "text-brand-text/60"
          }`}
        >
          ORCHARD ADVISORY
        </Text>
      </View>
      <View
        className={`rounded-xl border p-3 flex-row items-start ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-edge-green"
        }`}
      >
        <View className="mr-3 justify-start items-center pt-1">
          <AdvisoryIcon />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between pb-1.5">
            <Text
              style={{ fontFamily: Fonts.bold }}
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-brand-text"
              }`}
            >
              Calcium Spray
            </Text>
            <View className="flex-row items-center bg-[#fffbeb] dark:bg-amber-950/20 border border-[#fde68a] dark:border-amber-900/30 px-2.5 py-0.5 rounded-full">
              <Ionicons name="time-outline" size={11} color="#ca6a24" />
              <Text
                style={{ fontFamily: Fonts.semibold, fontSize: 10 }}
                className="ml-1 text-[#ca6a24] dark:text-amber-400 font-semibold"
              >
                Pending
              </Text>
            </View>
          </View>
          <View className="mt-1">
            <View
              className={`flex-row items-center py-2 border-t ${
                isDark ? "border-slate-800" : "border-edge-green/60"
              }`}
            >
              <Ionicons name="rainy-outline" size={15} color="#3b82f6" />
              <Text
                style={{ fontFamily: Fonts.medium }}
                className={`ml-2.5 text-xs ${
                  isDark ? "text-white/70" : "text-slate-600"
                }`}
              >
                Rains On 16th & 17th
              </Text>
            </View>
            <View
              className={`flex-row items-center py-2 border-t ${
                isDark ? "border-slate-800" : "border-edge-green/60"
              }`}
            >
              <Ionicons name="bug-outline" size={15} color="#ef4444" />
              <Text
                style={{ fontFamily: Fonts.medium }}
                className={`ml-2.5 text-xs ${
                  isDark ? "text-white/70" : "text-slate-600"
                }`}
              >
                Scout For Aphids & Mites
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
