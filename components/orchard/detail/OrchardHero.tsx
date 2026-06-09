import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";

const HERO_HEIGHT = 200;

/**
 * Hero header for orchard-detail: cover image (or upload prompt) with the
 * orchard name + location overlay. Markup copied verbatim from the screen;
 * rebranded where it maps to home tokens (brand text), one-off neutral shades
 * kept inline.
 */
export default function OrchardHero({
  name,
  location,
  heroImage,
  onUpload,
}: {
  name?: string;
  location?: string;
  heroImage: string | null;
  onUpload: () => void;
}) {
  const isDark = useColorScheme() === "dark";
  const hasImage = !!heroImage;

  return (
    <View
      style={{ height: HERO_HEIGHT }}
      className={`w-full rounded-[32px] overflow-hidden relative ${
        isDark ? "bg-slate-900" : "bg-surface-highlight"
      }`}
    >
      {hasImage ? (
        <ImageBackground
          source={{ uri: heroImage! }}
          resizeMode="cover"
          className="flex-1"
        >
          <View className="flex-1 bg-black/25 px-5 pt-5 pb-6 justify-end relative">
            <View className="flex-row items-end justify-between">
              <View className="flex-1 pr-4">
                <Text
                  numberOfLines={1}
                  style={{ fontFamily: Fonts.bold }}
                  className="text-white text-[24px]"
                >
                  {name || "Orchard Name"}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons
                    name="location-outline"
                    size={15}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text
                    style={{ fontFamily: Fonts.medium }}
                    className="ml-1 text-white/90 text-sm"
                  >
                    {location || "Orchard Location"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onUpload}
                className="px-4 py-2 rounded-full bg-white/95 border border-white/40"
              >
                <Text
                  style={{ fontFamily: Fonts.semibold, color: "#33422A" }}
                  className="text-sm"
                >
                  Edit Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View className="flex-1 px-5 pt-5 pb-6 justify-between relative">
          <View className="items-center flex-1 justify-center">
            <TouchableOpacity
              onPress={onUpload}
              activeOpacity={0.9}
              className="w-[82%] h-24 rounded-2xl border-2 border-dashed items-center justify-center"
              style={{
                borderColor: isDark ? "#475569" : "#C8D9AC",
                backgroundColor: isDark
                  ? "rgba(30, 41, 59, 0.4)"
                  : "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Ionicons
                name="image-outline"
                size={24}
                color={isDark ? "#cbd5e1" : "#33422A"}
              />
              <Text
                style={{ fontFamily: Fonts.medium }}
                className={`mt-2 text-sm ${
                  isDark ? "text-slate-300" : "text-brand-text"
                }`}
              >
                Upload Cover
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
