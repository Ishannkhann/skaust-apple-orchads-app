import React, { useRef, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  useColorScheme,
  Animated,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";
import type { Orchard } from "@/types/orchard";

const CARD_HEIGHT = 200;

const DEFAULT_ORCHARD_IMAGE = require("../../assets/images/fall_back_apple_icon.jpg");

const formatOrchardName = (name: string) => {
  if (!name) return "";
  return name.length > 10 ? name.slice(0, 10) + "..." : name;
};

/**
 * A single orchard card in the Home carousel.
 * Markup/classes copied verbatim from app/home.tsx. Owns its own breathing
 * temperature animation (identical loop to the previous shared `tempAnim`).
 * Sizing is provided by the parent via `width` so the FlatList paging math
 * stays identical.
 */
export default function OrchardCard({
  item,
  width,
  onPress,
  marginRight = 14,
}: {
  item: Orchard;
  width: number;
  onPress: () => void;
  marginRight?: number;
}) {
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
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={{
        width,
        height: CARD_HEIGHT,
        marginRight,
      }}
    >
      <View
        style={{ height: CARD_HEIGHT }}
        className={`rounded-3xl overflow-hidden border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-green-100"
        }`}
      >
        <ImageBackground
          source={require("../../assets/images/orchard-gradient-bg.png")}
          className="flex-1"
          resizeMode="cover"
        >
          <View className="flex-1 bg-black/30 p-4">
            {/* unchanged orchard card content */}

            {/* TOP */}
            <View className="flex-row items-start justify-between">
              <View className="flex-row flex-1 pr-3">
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : DEFAULT_ORCHARD_IMAGE
                  }
                  className="w-10 h-10 rounded-full border-2 border-white"
                  resizeMode="cover"
                />

                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      fontFamily: Fonts.bold,
                    }}
                    numberOfLines={1}
                    className="text-white text-[15px]"
                  >
                    {formatOrchardName(item.name)}
                  </Text>

                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                    }}
                    numberOfLines={1}
                    className="text-white text-[11px] mt-0.5"
                  >
                    Srinagar, India
                  </Text>
                </View>
              </View>

              {/* RIGHT WEATHER STACK */}
              <View className="items-end">
                {/* TEMP ROW */}
                <View className="flex-row items-center">
                  <Text
                    style={{ fontFamily: Fonts.semibold }}
                    className="text-white text-[9px] mr-2 opacity-80"
                  >
                    TEMP :
                  </Text>

                  <Ionicons
                    name="thermometer-outline"
                    size={14}
                    color="white"
                    style={{ marginRight: 4 }}
                  />

                  <Animated.Text
                    style={{
                      fontFamily: Fonts.bold,
                      transform: [{ scale: tempAnim }],
                    }}
                    className="text-white text-[20px] leading-none"
                  >
                    24°C
                  </Animated.Text>
                </View>

                {/* PILL STACK — wrapper sizes to widest pill */}
                <View className="mt-1" style={{ alignSelf: 'flex-end' }}>

                  {/* PARTLY CLOUDY */}
                  <View className="flex-row items-center w-full px-3 py-1 rounded-full bg-white/20">
                    <Ionicons name="partly-sunny-outline" size={12} color="white" style={{ marginRight: 4 }} />
                    <Text
                      style={{ fontFamily: Fonts.semibold, includeFontPadding: false, textAlignVertical: "center" }}
                      className="text-white text-[11px] leading-none"
                    >
                      Partly Cloudy
                    </Text>
                  </View>

                  <View className="h-1" />

                  {/* RAIN */}
                  <View className="flex-row items-center w-full px-3 py-1 rounded-full bg-white/20">
                    <Ionicons name="rainy-outline" size={12} color="white" style={{ marginRight: 4 }} />
                    <Text
                      style={{ fontFamily: Fonts.medium, includeFontPadding: false, textAlignVertical: "center" }}
                      className="text-white text-[11px] leading-none"
                    >
                      Rain : 144mm
                    </Text>
                  </View>

                </View>
              </View>

            </View>

            <View className="flex-1" />

            {/* ADVISORY */}
            <View>
              <View className="mb-2 px-3 py-1 rounded-full bg-white/20 self-start">
                <Text
                  style={{
                    fontFamily: Fonts.bold,
                  }}
                  className="text-white text-[10px] tracking-[2px]"
                >
                  ADVISORY
                </Text>
              </View>

              <View
                className="bg-white/20 rounded-2xl border border-white/25"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                }}
              >
                <View className="flex-row justify-between items-center">
                  <Text
                    style={{
                      fontFamily: Fonts.bold,
                    }}
                    className="text-white text-[12px] flex-1 pr-3"
                  >
                    Irrigation Advisory
                  </Text>

                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                    }}
                    className="text-white text-[9px]"
                  >
                    Dated : 19 May 2026
                  </Text>
                </View>

                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: Fonts.medium,
                    lineHeight: 14,
                  }}
                  className="text-white text-[11px] mt-2"
                >
                  Irrigation recommended during early
                  morning hours for better moisture
                  retention and healthier root absorption.
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}
