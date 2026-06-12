import React from "react";

import { View, Text, useColorScheme, ActivityIndicator } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";

interface DegreeDaysTileProps {
  gdd: number;
  hasData: boolean;
  status: string;
  statusColor: string;
  loading?: boolean;
  missingCoordinates?: boolean;
}

/**
 * Functional Growing Degree Days tile.
 * Supports both forecast-based and historical (One Call 3.0) GDD.
 * Shows loading state while fetching historical data.
 */
export default function DegreeDaysTile({
  gdd,
  hasData,
  status,
  statusColor,
  loading = false,
  missingCoordinates = false,
}: DegreeDaysTileProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <View
      className={`mt-4 rounded-2xl border px-5 py-4 flex-row items-center justify-between ${
        isDark
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-edge-green"
      }`}
      style={{
        shadowColor: isDark ? "#000" : "#6D8B4F",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3.5 ${
            isDark ? "bg-amber-950/40" : "bg-amber-50"
          }`}
        >
          <Ionicons
            name="thermometer-outline"
            size={20}
            color={isDark ? "#fbbf24" : "#d97706"}
          />
        </View>

        <View>
          <Text
            style={{ fontFamily: Fonts.medium }}
            className={`text-[10px] uppercase tracking-[1.2px] ${
              isDark ? "text-slate-400" : "text-brand-text/50"
            }`}
          >
            Growing Degree Days
          </Text>

          {loading ? (
            <View className="flex-row items-center mt-1">
              <ActivityIndicator
                size="small"
                color={isDark ? "#fbbf24" : "#d97706"}
              />
              <Text
                style={{ fontFamily: Fonts.medium }}
                className="ml-2 text-sm text-brand-green"
              >
                Calculating...
              </Text>
            </View>
          ) : (
            <Text
              style={{ fontFamily: Fonts.bold }}
              className={`text-2xl font-bold mt-0.5 ${
                isDark ? "text-white" : "text-brand-text"
              }`}
            >
              {hasData ? gdd.toFixed(1) : "—"}
              <Text
                style={{ fontFamily: Fonts.medium }}
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-brand-green"
                }`}
              >
                {" "}°C
              </Text>
            </Text>
          )}

          {!loading && !hasData && (
            <Text className="text-[10px] text-red-500 mt-0.5">
              {missingCoordinates
                ? "Location coordinates required"
                : "No weather data"}
            </Text>
          )}
        </View>
      </View>

      {!loading && (
        <View
          className={`rounded-full px-3 py-1.5 ${
            isDark ? "bg-slate-800" : "bg-surface-track"
          }`}
        >
          <View className="flex-row items-center">
            <View
              className="w-1.5 h-1.5 rounded-full mr-1.5"
              style={{ backgroundColor: statusColor }}
            />
            <Text
              style={{ fontFamily: Fonts.semibold, fontSize: 10 }}
              className={isDark ? "text-brand-sage" : "text-brand-green"}
            >
              {status}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
