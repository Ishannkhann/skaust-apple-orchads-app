import React, { useRef, useEffect } from "react";

import { View, Text, useColorScheme, Animated, ActivityIndicator } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { useOrchardWeather } from "@/hooks/useOrchardWeather";

/** Map an OpenWeather icon key to an Ionicons name (same mapping as the detail screen). */
function ionIcon(icon?: string): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case "sunny":
      return "sunny";
    case "rainy":
      return "rainy";
    case "thunderstorm":
      return "thunderstorm";
    case "cloudy":
      return "cloudy";
    default:
      return "partly-sunny";
  }
}

/** Icon tint — on-brand palette; amber for sun, green for everything else. */
function iconColor(icon?: string): string {
  switch (icon) {
    case "sunny":
    case "partly-sunny":
      return Colors.accentAmber; // warm amber accent (on-palette) for clear skies
    default:
      return Colors.brandGreen; // cloudy / rainy / storm → brand green
  }
}

/**
 * The compact weather tile on the Home screen.
 *
 * Fully data-driven: fetches LIVE weather via the shared OpenWeather pipeline
 * (useOrchardWeather), preferring the device's GPS coordinates. While the first
 * fetch is in flight it shows a small loader instead of placeholder numbers.
 * The hook supplies mock data only when there's no key/location configured.
 */
export default function WeatherTile() {
  const isDark = useColorScheme() === "dark";

  // Live weather, preferring device GPS coordinates.
  const { coords } = useDeviceLocation();
  const { weatherData, resolvedCity, loading } = useOrchardWeather(
    undefined,
    coords
  );

  const today = weatherData.daily?.[0];

  const tempAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(tempAnim, {
          toValue: 1.08,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(tempAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, []);

  return (
    <View className="px-5 mt-4">
      <View
        className={`rounded-[24px] overflow-hidden border ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-edge-green"
        }`}
      >
        <View className="px-4 py-3">

          {/* LOCATION + LIVE DOT */}
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-brand-green mr-2" />
            <Text
              style={{ fontFamily: Fonts.semibold }}
              className={`text-[10px] tracking-[1.2px] ${
                isDark ? "text-white/60" : "text-brand-text/60"
              }`}
            >
              {resolvedCity.toUpperCase()} • LIVE
            </Text>
          </View>

          {/* While the first forecast loads, show a loader instead of stale numbers. */}
          {loading && !today ? (
            <View className="flex-row items-center" style={{ height: 70 }}>
              <ActivityIndicator size="small" color={Colors.brandGreen} />
              <Text
                style={{ fontFamily: Fonts.medium }}
                className={`ml-2 text-[12px] ${
                  isDark ? "text-white/70" : "text-brand-text/70"
                }`}
              >
                Fetching live weather…
              </Text>
            </View>
          ) : (
            <>
              {/* TOP ROW */}
              <View className="flex-row items-center justify-between">

                {/* LEFT WEATHER */}
                <View className="flex-row items-center flex-1">
                  <View>

                    {/* TEMP + ICON */}
                    <View className="flex-row items-center mt-0.5">
                      <View
                        style={{
                          height: 48,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Animated.Text
                          style={{
                            fontFamily: Fonts.bold,
                            fontSize: 38,
                            lineHeight: 48,
                            transform: [{ scale: tempAnim }],
                          }}
                          className={isDark ? "text-white" : "text-brand-text"}
                        >
                          {today?.maxTemp}°C
                        </Animated.Text>

                        <View
                          style={{
                            marginLeft: 26,
                            transform: [{ translateY: -2 }],
                          }}
                        >
                          <Ionicons
                            name={ionIcon(today?.icon)}
                            size={44}
                            color={iconColor(today?.icon)}
                          />
                        </View>
                      </View>
                    </View>

                    <Text
                      style={{ fontFamily: Fonts.medium }}
                      className={`text-[11px] mt-0.5 ${
                        isDark ? "text-white/70" : "text-brand-text/70"
                      }`}
                    >
                      {today?.desc}
                    </Text>

                  </View>
                </View>

                {/* RIGHT STACKED METRICS */}
                <View className="items-end">

                  {/* RAIN */}
                  <View className="flex-row items-center">
                    <Ionicons name="rainy-outline" size={13} color={Colors.brandSage} />
                    <Text
                      style={{ fontFamily: Fonts.medium }}
                      className={`ml-1 text-[10px] ${
                        isDark ? "text-white" : "text-brand-text"
                      }`}
                    >
                      Rain {today?.rainVol}
                    </Text>
                  </View>

                  <Text className="text-[9px] text-gray-400 my-0.5">───</Text>

                  {/* HUMIDITY */}
                  <View className="flex-row items-center">
                    <Ionicons name="water-outline" size={13} color={Colors.brandSage} />
                    <Text
                      style={{ fontFamily: Fonts.medium }}
                      className={`ml-1 text-[10px] ${
                        isDark ? "text-white" : "text-brand-text"
                      }`}
                    >
                      Humidity {today?.humidity}%
                    </Text>
                  </View>

                  {/* RAIN PROBABILITY */}
                  <Text
                    style={{ fontFamily: Fonts.bold }}
                    className="text-brand-sage text-[14px] mt-2"
                  >
                    Rain Probability : {today?.rainProb}%
                  </Text>

                </View>
              </View>

              {/* SEGMENTED BAR — fill scales with rain probability (0–100 → 0–10) */}
              <View className="flex-row mt-2 items-center">
                {Array.from({ length: 10 }).map((_, i) => {
                  const filled = i < Math.round(((today?.rainProb ?? 0) / 100) * 10);
                  return (
                    <View
                      key={i}
                      className="flex-1 mx-[1px] h-1 rounded-full bg-black/10 overflow-hidden"
                    >
                      <View
                        className={`h-full ${
                          filled ? "bg-brand-sage" : "bg-transparent"
                        }`}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}

        </View>
      </View>
    </View>
  );
}
