import React, { useEffect, useState, useRef } from "react";

import {
  ScrollView,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Dimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import HomeHeader from "../components/Home/HomeHeader";

import ProfileCompletionCard from "../components/Home/ProfileCompletionCard";

import { useFocusEffect } from "@react-navigation/native";

type Orchard = {
  id: string;
  name: string;
  message: string;
  image?: string;
  variety?: string;
  orchardType?: string;
  area?: string;
  landType?: string;
};

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.82;

export default function Home() {
  const router = useRouter();

  const isDark =
    useColorScheme() === "dark";

  const [orchards, setOrchards] =
    useState<Orchard[]>([]);

  // ✅ FIX: prevent double navigation
  const isNavigatingRef = useRef(false);

    useFocusEffect(
      React.useCallback(() => {
        loadOrchards();
      }, [])
    );

  const loadOrchards = async () => {
    try {
      const savedOrchards =
        await AsyncStorage.getItem(
          "orchards"
        );

      if (savedOrchards) {
        setOrchards(
          JSON.parse(savedOrchards)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addNewOrchard = async () => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    await AsyncStorage.removeItem(
      "editingOrchard"
    );

    await AsyncStorage.removeItem(
      "newOrchard"
    );

    router.push(
      "/orchard/add-step-1"
    );

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const editOrchard = async (
    orchard: Orchard
  ) => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    await AsyncStorage.setItem(
      "editingOrchard",
      JSON.stringify(orchard)
    );

    router.push(
      "/orchard/add-step-1"
    );

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const deleteOrchard = async (
    id: string
  ) => {
    Alert.alert(
      "Delete Orchard",
      "Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            const updated =
              orchards.filter(
                (o) => o.id !== id
              );

            setOrchards(updated);

            await AsyncStorage.setItem(
              "orchards",
              JSON.stringify(updated)
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark
          ? "bg-slate-950"
          : "bg-lime-50"
      }`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        <HomeHeader />

        <View className="px-5 mt-4">

          <Text
            className={`text-2xl font-bold ${
              isDark
                ? "text-white"
                : "text-green-950"
            }`}
          >
            Dashboard
          </Text>

          <Text
            className={`mt-2 leading-6 ${
              isDark
                ? "text-gray-400"
                : "text-green-700"
            }`}
          >
            Your agricultural insights,
            orchard advisories,
            field monitoring,
            and recommendations
            will appear here.
          </Text>

        </View>

        {/* ORCHARDS */}
        <View className="mt-6">

          <View className="px-5 flex-row items-center justify-between mb-4">

            <Text
              className={`text-xl font-bold ${
                isDark
                  ? "text-white"
                  : "text-green-950"
              }`}
            >
              My Orchards
            </Text>

            <TouchableOpacity
              onPress={addNewOrchard}
              className="bg-green-600 w-12 h-12 rounded-full items-center justify-center"
            >
              <Ionicons
                name="add"
                size={26}
                color="white"
              />
            </TouchableOpacity>

          </View>

          <FlatList
            data={orchards}
            keyExtractor={(item) => item.id}
            horizontal
            snapToInterval={
              CARD_WIDTH + 14
            }
            decelerationRate="fast"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingLeft: 20,
              paddingRight: 60,
            }}
            renderItem={({
              item,
              index,
            }) => {

              const isLast =
                index ===
                orchards.length - 1;

              return (
                <View
                  style={{
                    width: isLast
                      ? width - 40
                      : CARD_WIDTH,

                    marginRight: 14,
                  }}
                >
                  <View
                    className={`rounded-3xl overflow-hidden border ${
                      isDark
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-green-100"
                    }`}
                  >

                    {item.image ? (
                      <Image
                        source={{
                          uri: item.image,
                        }}
                        className="w-full aspect-[16/9]"
                        resizeMode="cover"
                      />
                    ) : null}

                    <View className="p-5">

                      <Text
                        className={`text-lg font-bold ${
                          isDark
                            ? "text-white"
                            : "text-green-950"
                        }`}
                      >
                        {item.name}
                      </Text>

                      <Text
                        className={`mt-2 ${
                          isDark
                            ? "text-gray-300"
                            : "text-green-700"
                        }`}
                      >
                        {item.variety} •{" "}
                        {item.orchardType}
                      </Text>

                      <Text
                        className={`mt-1 ${
                          isDark
                            ? "text-gray-400"
                            : "text-green-700"
                        }`}
                      >
                        {item.area} Canals •{" "}
                        {item.landType}
                      </Text>

                      <View className="flex-row mt-5 gap-3">

                        <TouchableOpacity
                          onPress={() =>
                            editOrchard(
                              item
                            )
                          }
                          className="bg-green-600 px-5 py-3 rounded-2xl flex-1"
                        >
                          <Text className="text-white text-center font-semibold">
                            Edit
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            deleteOrchard(
                              item.id
                            )
                          }
                          className="bg-red-500 px-5 py-3 rounded-2xl flex-1"
                        >
                          <Text className="text-white text-center font-semibold">
                            Delete
                          </Text>
                        </TouchableOpacity>

                      </View>

                    </View>

                  </View>
                </View>
              );
            }}
          />

        </View>

        <View className="px-5 mt-6">
          <ProfileCompletionCard
            progress={70}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
