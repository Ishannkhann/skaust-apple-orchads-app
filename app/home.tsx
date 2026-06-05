import React, { useRef } from "react";

import {
  ScrollView,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useOrchards } from "@/hooks/useOrchards";
import { Fonts } from "@/theme/fonts";
import type { Orchard } from "@/types/orchard";
import { removeItem, setJSON, StorageKeys } from "@/lib/storage";

import HomeHeader from "../components/Home/HomeHeader";
import ProfileCompletionCard from "../components/Home/ProfileCompletionCard";
import WeatherTile from "../components/Home/WeatherTile";
import OrchardCard from "../components/Home/OrchardCard";
import EmptyOrchards from "../components/Home/EmptyOrchards";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.82;
// Full-width card (used when there is only a single orchard); 20px side padding.
const FULL_CARD_WIDTH = width - 40;

export default function Home() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const { orchards, setOrchards, removeOrchard } = useOrchards();

  const isNavigatingRef = useRef(false);

  const addNewOrchard = async () => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    await removeItem(StorageKeys.editingOrchard);
    await removeItem(StorageKeys.newOrchard);

    router.push("/orchard/add-step-1");

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const editOrchard = async (orchard: Orchard) => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    await setJSON(StorageKeys.editingOrchard, orchard);

    router.push("/orchard/add-step-1");

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const deleteOrchard = async (id: string) => {
    Alert.alert("Delete Orchard", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeOrchard(id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
      >
        <HomeHeader />

        {/* WEATHER TILE */}
        <WeatherTile />

        <View
          className={`mt-6 ${
            orchards.length === 0 ? "flex-1 justify-center" : ""
          }`}
        >
          <View className="px-5 flex-row items-center justify-between mb-4">
            <Text
              style={{ fontFamily: Fonts.bold }}
              className={`text-xl ${
                isDark ? "text-white" : "text-brand-text"
              }`}
            >
              My Orchards
            </Text>

            <TouchableOpacity
              onPress={addNewOrchard}
              className={`px-4 h-10 rounded-2xl flex-row items-center justify-center ${
                isDark ? "bg-brand-green-dark" : "bg-brand-green"
              }`}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text
                style={{ fontFamily: Fonts.semibold }}
                className="text-white ml-2 text-sm"
              >
                Add New Orchard
              </Text>
            </TouchableOpacity>
          </View>

          {orchards.length === 0 ? (
            <EmptyOrchards onPress={addNewOrchard} />
          ) : orchards.length === 1 ? (
            // Single orchard → full-width card (no carousel).
            <View className="px-5">
              <OrchardCard
                item={orchards[0]}
                width={FULL_CARD_WIDTH}
                marginRight={0}
                onPress={() =>
                  router.push({
                    pathname: "/orchard/orchard-detail",
                    params: {
                      orchard: JSON.stringify(orchards[0]),
                    },
                  })
                }
              />
            </View>
          ) : (
            <FlatList
              data={orchards}
              keyExtractor={(item) => item.id}
              horizontal
              snapToInterval={CARD_WIDTH + 14}
              decelerationRate="fast"
              disableIntervalMomentum
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
              renderItem={({ item }) => (
                <OrchardCard
                  item={item}
                  width={CARD_WIDTH}
                  onPress={() =>
                    router.push({
                      pathname: "/orchard/orchard-detail",
                      params: {
                        orchard: JSON.stringify(item),
                      },
                    })
                  }
                />
              )}
            />
          )}
        </View>

        <View className="px-5 mt-6">
          <ProfileCompletionCard progress={70} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
