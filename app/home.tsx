import React, { useState, useRef } from "react";

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
  ImageBackground,
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
  location?: string;
};

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.82;
const CARD_HEIGHT = 200;

export default function Home() {
  const router = useRouter();

  const isDark = useColorScheme() === "dark";

  const [orchards, setOrchards] = useState<Orchard[]>([]);

  const isNavigatingRef = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      loadOrchards();
    }, [])
  );

  const loadOrchards = async () => {
    try {
      const savedOrchards = await AsyncStorage.getItem("orchards");

      if (savedOrchards) {
        setOrchards(JSON.parse(savedOrchards));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addNewOrchard = async () => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    await AsyncStorage.removeItem("editingOrchard");
    await AsyncStorage.removeItem("newOrchard");

    router.push("/orchard/add-step-1");

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const editOrchard = async (orchard: Orchard) => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    await AsyncStorage.setItem(
      "editingOrchard",
      JSON.stringify(orchard)
    );

    router.push("/orchard/add-step-1");

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const deleteOrchard = async (id: string) => {
    Alert.alert("Delete Orchard", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = orchards.filter((o) => o.id !== id);

          setOrchards(updated);

          await AsyncStorage.setItem("orchards", JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-slate-950" : "bg-lime-50"
      }`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
      >
        <HomeHeader />

        <View className="px-5 mt-4">
          <Text
            style={{
              fontFamily: "Montserrat_700Bold",
            }}
            className={`text-2xl ${
              isDark ? "text-white" : "text-green-950"
            }`}
          >
            Dashboard
          </Text>

          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
            className={`mt-2 leading-6 ${
              isDark ? "text-gray-400" : "text-green-700"
            }`}
          >
            Your agricultural insights, orchard advisories,
            field monitoring, and recommendations will appear
            here.
          </Text>
        </View>

        {/* ORCHARDS */}
        <View
          className={`mt-6 ${
            orchards.length === 0 ? "flex-1 justify-center" : ""
          }`}
        >
          <View className="px-5 flex-row items-center justify-between mb-4">
            <Text
              style={{
                fontFamily: "Montserrat_700Bold",
              }}
              className={`text-xl ${
                isDark ? "text-white" : "text-green-950"
              }`}
            >
              My Orchards
            </Text>

            <TouchableOpacity
              onPress={addNewOrchard}
              className={`px-4 h-10 rounded-2xl flex-row items-center justify-center ${
                isDark ? "bg-green-700" : "bg-green-600"
              }`}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                }}
                className="text-white ml-2 text-sm"
              >
                Add New Orchard
              </Text>
            </TouchableOpacity>
          </View>

          {orchards.length === 0 ? (
            <View className="px-5 mt-4 items-center justify-center">
              <TouchableOpacity
                onPress={addNewOrchard}
                activeOpacity={0.9}
                className={`w-full rounded-3xl border border-dashed p-8 items-center justify-center ${
                  isDark
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-green-200"
                }`}
                style={{
                  minHeight: CARD_HEIGHT,
                }}
              >
                <View
                  className={`w-16 h-16 rounded-2xl items-center justify-center ${
                    isDark ? "bg-green-800" : "bg-green-100"
                  }`}
                >
                  <Ionicons
                    name="add"
                    size={32}
                    color={isDark ? "#86efac" : "#166534"}
                  />
                </View>

                <Text
                  style={{
                    fontFamily: "Montserrat_700Bold",
                  }}
                  className={`text-xl mt-5 ${
                    isDark ? "text-white" : "text-green-950"
                  }`}
                >
                  Add Your First Orchard
                </Text>

                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className={`text-center mt-2 leading-6 ${
                    isDark ? "text-gray-400" : "text-green-700"
                  }`}
                >
                  Start managing your orchards, monitoring fields,
                  and viewing agricultural insights.
                </Text>
              </TouchableOpacity>
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
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.92}
                    onPress={() => editOrchard(item)}
                    style={{
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT,
                      marginRight: 14,
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
                        source={require("../assets/images/orchard-gradient-bg.png")}
                        className="flex-1"
                        resizeMode="cover"
                      >
                        <View className="flex-1 bg-black/40 px-4 py-3 justify-between">
                          {/* TOP */}
                          <View className="flex-row items-start justify-between">
                            <View className="flex-row flex-1 pr-3">
                              <Image
                                source={{
                                  uri:
                                    item.image ||
                                    "https://via.placeholder.com/100",
                                }}
                                className="w-10 h-10 rounded-full border-2 border-white"
                              />

                              <View className="ml-3 flex-1">
                                <Text
                                  style={{
                                    fontFamily: "Montserrat_700Bold",
                                  }}
                                  numberOfLines={1}
                                  className="text-white text-[15px]"
                                >
                                  {item.name}
                                </Text>

                                <Text
                                  style={{
                                    fontFamily: "Montserrat_500Medium",
                                  }}
                                  numberOfLines={1}
                                  className="text-white text-[11px] mt-0.5"
                                >
                                  Srinagar, India
                                </Text>
                              </View>
                            </View>

                            <View className="items-end">
                              <Text
                                style={{
                                  fontFamily: "Montserrat_700Bold",
                                  textShadowColor: "rgba(0,0,0,0.45)",
                                  textShadowOffset: {
                                    width: 0,
                                    height: 2,
                                  },
                                  textShadowRadius: 4,
                                }}
                                className="text-white text-[28px] leading-none"
                              >
                                24°
                              </Text>

                              <Text
                                style={{
                                  fontFamily: "Montserrat_600SemiBold",
                                }}
                                className="text-white text-[10px] mt-1"
                              >
                                Cloudy
                              </Text>
                            </View>
                          </View>

                          {/* ADVISORY */}
                          <View className="mt-2">
                            <View
                              className="mb-2 px-3 py-1 rounded-full bg-white/30 border border-white/30"
                              style={{ alignSelf: "flex-start" }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Montserrat_700Bold",
                                }}
                                className="text-white text-[10px] tracking-[2px]"
                              >
                                ADVISORY
                              </Text>
                            </View>

                            <View
                              className="bg-white/30 rounded-2xl border border-white/30"
                              style={{
                                paddingHorizontal: 14,
                                paddingVertical: 12,
                              }}
                            >
                              {/* ✅ FIX: vertical alignment */}
                              <View className="flex-row items-center justify-between">
                                <Text
                                  style={{
                                    fontFamily: "Montserrat_700Bold",
                                  }}
                                  className="text-white text-[12px] flex-1 pr-3"
                                >
                                  Irrigation Advisory
                                </Text>

                                <Text
                                  style={{
                                    fontFamily: "Montserrat_600SemiBold",
                                  }}
                                  className="text-white text-[9px]"
                                >
                                  Dated : 19 May 2026
                                </Text>
                              </View>

                              <Text
                                style={{
                                  fontFamily: "Montserrat_500Medium",
                                }}
                                numberOfLines={2}
                                className="text-white text-[11px] leading-5 mt-2"
                              >
                                Irrigation recommended during early morning
                                hours for better moisture retention and
                                healthier root absorption.
                              </Text>
                            </View>
                          </View>
                        </View>
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                );
              }}
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
