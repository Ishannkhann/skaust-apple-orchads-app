import React from "react";

import { View, Text, ActivityIndicator } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";

/**
 * The API error warning + "updating live weather" loading row on
 * orchard-detail. Markup/classes copied verbatim from the screen.
 */
export default function WeatherStatusBanners({
  weatherError,
  loading,
}: {
  weatherError: string | null;
  loading: boolean;
}) {
  return (
    <>
      {/* API Warning/Error overlay */}
      {weatherError && (
        <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 px-3 py-2.5 rounded-xl flex-row items-center">
          <Ionicons name="warning" size={16} color="#d97706" />
          <Text
            style={{ fontFamily: Fonts.medium, fontSize: 10 }}
            className="text-amber-800 dark:text-amber-400 ml-2 flex-1"
          >
            {weatherError}
          </Text>
        </View>
      )}

      {/* Loading Indicator for API updates */}
      {loading && (
        <View className="flex-row items-center justify-center py-4">
          <ActivityIndicator size="small" color="#009e4f" />
          <Text className="ml-2 text-xs text-slate-500">
            Updating live weather...
          </Text>
        </View>
      )}
    </>
  );
}
