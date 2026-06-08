import React from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { Orchard } from "@/types/orchard";

const { width } = Dimensions.get("window");
// 2 columns, 20px side padding, 12px gap
const CARD_WIDTH = (width - 20 * 2 - 12) / 2;

/**
 * Placeholder colors for the card's image fallback + crop badge.
 *
 * NOTE: the previous `CROP_COLORS` lookup keyed off fruit types (Apple, Mango,
 * ...) but `item.variety` only ever holds apple cultivars (Red Delicious, Fuji,
 * ...), so it never matched and always fell back to this default. Inlining the
 * default keeps the rendered result identical without the unreachable map.
 */
const CARD_STYLE = { bg: "#EAF3DE", text: "#3B6D11" };

/**
 * A single orchard card on the My Orchards grid.
 * Markup copied from my-orchards.tsx; rebranded to the home palette
 * (green-100 border -> edge-green, green-950 text -> brand-text, etc.).
 */
const MyOrchardCard = React.memo(
  ({ item, onPress }: { item: Orchard; onPress: () => void }) => {
    const isDark = useColorScheme() === "dark";

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{ width: CARD_WIDTH }}
        className={`rounded-3xl overflow-hidden border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-edge-green"
        }`}
      >
        {/* Image or placeholder */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 96 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-full items-center justify-center"
            style={{ height: 96, backgroundColor: CARD_STYLE.bg }}
          >
            <Ionicons name="leaf-outline" size={36} color={CARD_STYLE.text} />
          </View>
        )}

        {/* Card content */}
        <View className="p-3">
          <Text
            numberOfLines={1}
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-brand-text"
            }`}
          >
            {item.name}
          </Text>

          {(item.variety || item.orchardType) && (
            <Text
              numberOfLines={1}
              className={`text-xs mt-0.5 ${
                isDark ? "text-gray-400" : "text-brand-green"
              }`}
            >
              {[item.variety, item.orchardType].filter(Boolean).join(" • ")}
            </Text>
          )}

          {item.area && (
            <Text
              numberOfLines={1}
              className={`text-xs mt-0.5 ${
                isDark ? "text-gray-500" : "text-brand-green"
              }`}
            >
              {item.area} Kanals{item.landType ? ` • ${item.landType}` : ""}
            </Text>
          )}

          {/* Crop badge — shows first variety only to avoid overflow */}
          {item.variety && (
            <View
              className="self-start mt-2 rounded-full px-2 py-0.5"
              style={{ backgroundColor: CARD_STYLE.bg, maxWidth: "100%" }}
            >
              <Text
                numberOfLines={1}
                className="text-xs font-medium"
                style={{ color: CARD_STYLE.text }}
              >
                {item.variety.split(",")[0].trim()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

MyOrchardCard.displayName = "MyOrchardCard";

export default MyOrchardCard;
