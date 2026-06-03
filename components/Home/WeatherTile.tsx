import React, { useRef, useEffect } from "react";

import { View, Text, useColorScheme, Animated } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

/**
 * The compact weather tile on the Home screen.
 * Markup/classes copied verbatim from app/home.tsx. Owns its own breathing
 * temperature animation (identical loop to the previous shared `tempAnim`).
 */
export default function WeatherTile() {
  const isDark = useColorScheme() === "dark";

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

          {/* TOP ROW */}
          <View className="flex-row items-center justify-between">

            {/* LEFT WEATHER */}
            <View className="flex-row items-center flex-1">
              <View>

                {/* LOCATION + LIVE DOT */}
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-brand-green mr-2" />
                  <Text
                    style={{ fontFamily: Fonts.semibold }}
                    className={`text-[10px] tracking-[1.2px] ${
                      isDark ? "text-white/60" : "text-brand-text/60"
                    }`}
                  >
                    SRINAGAR • LIVE
                  </Text>
                </View>

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
                      26°C
                    </Animated.Text>

                    <View
                      style={{
                        marginLeft: 26,
                        transform: [{ translateY: -2 }],
                      }}
                    >
                      <Ionicons
                        name="partly-sunny"
                        size={44}
                        color="#facc15"
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
                  Partly Sunny
                </Text>

              </View>
            </View>

            {/* RIGHT STACKED METRICS (NO WIND) */}
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
                  Rain 2mm
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
                  Humidity 68%
                </Text>
              </View>

              {/* 30% BELOW STACK */}
              <Text
                style={{ fontFamily: Fonts.bold }}
                className="text-brand-sage text-[14px] mt-2"
              >
                Rain Probability : 30%
              </Text>

            </View>
          </View>

          {/* SEGMENTED BAR */}
          <View className="flex-row mt-2 items-center">

            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={i}
                className="flex-1 mx-[1px] h-1 rounded-full bg-black/10 overflow-hidden"
              >
                <View
                  className={`h-full ${
                    i < 3 ? "bg-brand-sage" : "bg-transparent"
                  }`}
                />
              </View>
            ))}

          </View>

        </View>
      </View>
    </View>
  );
}
