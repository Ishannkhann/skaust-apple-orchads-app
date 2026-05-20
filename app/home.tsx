import React, { useState, useRef, useEffect } from "react";

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
  Animated,
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

const formatOrchardName = (name: string) => {
  if (!name) return "";
  return name.length > 10 ? name.slice(0, 10) + "..." : name;
};

export default function Home() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const [orchards, setOrchards] = useState<Orchard[]>([]);
  const isNavigatingRef = useRef(false);

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

  useFocusEffect(
    React.useCallback(() => {
      loadOrchards();
    }, [])
  );

  const loadOrchards = async () => {
    try {
      const savedOrchards = await AsyncStorage.getItem("orchards");
      if (savedOrchards) setOrchards(JSON.parse(savedOrchards));
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

    await AsyncStorage.setItem("editingOrchard", JSON.stringify(orchard));

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
          const updated = orchards.filter((o) => o.id !== id);
          setOrchards(updated);
          await AsyncStorage.setItem("orchards", JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-lime-50"}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
      >
        <HomeHeader />

        {/* COMPACT INLINE WEATHER TILE */}
        <View className="px-5 mt-4">
          <View
            className={`rounded-[24px] overflow-hidden border ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-green-100"
            }`}
          >
            <View className="px-4 py-4">
              <View className="flex-row items-center justify-between">
                
                {/* LEFT WEATHER */}
                <View className="flex-row items-center flex-1">
                  <View>
                    <Text
                      style={{ fontFamily: "Montserrat_600SemiBold" }}
                      className={`text-[10px] tracking-[1.5px] ${
                        isDark ? "text-white/60" : "text-green-900/60"
                      }`}
                    >
                      SRINAGAR • LIVE
                    </Text>

                    <View className="flex-row items-center mt-1">
                      <Animated.Text
                        style={{
                          fontFamily: "Montserrat_700Bold",
                          transform: [{ scale: tempAnim }],
                        }}
                        className={`text-[38px] leading-none ${
                          isDark ? "text-white" : "text-green-950"
                        }`}
                      >
                        26°
                      </Animated.Text>

                      <Ionicons
                        name="partly-sunny"
                        size={20}
                        color="#facc15"
                        style={{ marginLeft: 8 }}
                      />
                    </View>

                    <Text
                      style={{ fontFamily: "Montserrat_500Medium" }}
                      className={`text-[12px] mt-0.5 ${
                        isDark ? "text-white/70" : "text-green-900/70"
                      }`}
                    >
                      Partly Sunny
                    </Text>
                  </View>
                </View>

                {/* CENTER RAIN */}
                <View className="mx-3 px-3 py-2 rounded-2xl bg-black/5 border border-black/5 flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-blue-500/10 items-center justify-center">
                    <Ionicons name="rainy-outline" size={14} color="#60a5fa" />
                  </View>

                  <View className="ml-2">
                    <Text
                      style={{ fontFamily: "Montserrat_700Bold" }}
                      className={isDark ? "text-white text-[12px]" : "text-green-950 text-[12px]"}
                    >
                      Rain
                    </Text>

                    <Text
                      style={{ fontFamily: "Montserrat_500Medium" }}
                      className={isDark ? "text-white/60 text-[10px]" : "text-green-900/60 text-[10px]"}
                    >
                      8 PM • 2mm
                    </Text>
                  </View>
                </View>

                {/* RIGHT PERCENT */}
                <View className="items-end">
                  <Text
                    style={{ fontFamily: "Montserrat_700Bold" }}
                    className="text-blue-500 text-[24px]"
                  >
                    30%
                  </Text>

                  <Text
                    style={{ fontFamily: "Montserrat_500Medium" }}
                    className={isDark ? "text-white/60 text-[10px]" : "text-green-900/60 text-[10px]"}
                  >
                    shower chance
                  </Text>
                </View>
              </View>

              {/* INLINE METRICS */}
              <View className="flex-row mt-3">
                
                <View className="px-3 py-1.5 rounded-full bg-black/5 mr-2 flex-row items-center border border-black/5">
                  <Ionicons name="water-outline" size={12} color={isDark ? "white" : "#14532d"} />
                  <Text
                    style={{ fontFamily: "Montserrat_500Medium" }}
                    className={isDark ? "text-white text-[10px] ml-1.5" : "text-green-900 text-[10px] ml-1.5"}
                  >
                    68%
                  </Text>
                </View>

                <View className="px-3 py-1.5 rounded-full bg-black/5 mr-2 flex-row items-center border border-black/5">
                  <Ionicons name="leaf-outline" size={12} color={isDark ? "white" : "#14532d"} />
                  <Text
                    style={{ fontFamily: "Montserrat_500Medium" }}
                    className={isDark ? "text-white text-[10px] ml-1.5" : "text-green-900 text-[10px] ml-1.5"}
                  >
                    3 km/h
                  </Text>
                </View>

                <View className="flex-1 justify-center ml-1">
                  <View className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <View className="w-[30%] h-full rounded-full bg-blue-500" />
                  </View>
                </View>

              </View>
            </View>
          </View>
        </View>

        {/* REST OF YOUR FILE UNCHANGED */}
        <View
          className={`mt-6 ${
            orchards.length === 0 ? "flex-1 justify-center" : ""
          }`}
        >
          <View className="px-5 flex-row items-center justify-between mb-4">
            <Text
              style={{ fontFamily: "Montserrat_700Bold" }}
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
                style={{ fontFamily: "Montserrat_600SemiBold" }}
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
                style={{ minHeight: CARD_HEIGHT }}
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
                  style={{ fontFamily: "Montserrat_700Bold" }}
                  className={`text-xl mt-5 ${
                    isDark ? "text-white" : "text-green-950"
                  }`}
                >
                  Add Your First Orchard
                </Text>

                <Text
                  style={{ fontFamily: "Montserrat_500Medium" }}
                  className={`text-center mt-2 leading-6 ${
                    isDark ? "text-gray-400" : "text-green-700"
                  }`}
                >
                  Start managing your orchards, monitoring fields, and
                  viewing agricultural insights.
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
                        <View className="flex-1 bg-black/30 p-4">
                          {/* unchanged orchard card content */}
                        
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
                                  {formatOrchardName(item.name)}
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
                              <Animated.Text
                                style={{
                                  fontFamily: "Montserrat_700Bold",
                                  transform: [{ scale: tempAnim }],
                                }}
                                className="text-white text-[32px] leading-none"
                              >
                                24°
                              </Animated.Text>

                              <View className="flex-row items-center mt-1">
                                <Ionicons
                                  name="partly-sunny-outline"
                                  size={14}
                                  color="white"
                                />
                                <Text
                                  style={{
                                    fontFamily: "Montserrat_600SemiBold",
                                  }}
                                  className="text-white text-[12px] ml-1"
                                >
                                  Partly Cloudy
                                </Text>
                              </View>

                              <View className="flex-row mt-2">
                                <View className="px-3 py-1 rounded-full bg-white/20 mr-2 flex-row items-center">
                                  <Ionicons
                                    name="rainy-outline"
                                    size={12}
                                    color="white"
                                  />
                                  <Text
                                    style={{
                                      fontFamily:
                                        "Montserrat_500Medium",
                                    }}
                                    className="text-white text-[11px] ml-1"
                                  >
                                    2mm
                                  </Text>
                                </View>

                                <View className="px-3 py-1 rounded-full bg-white/20 flex-row items-center">
                                  <Ionicons
                                    name="thermometer-outline"
                                    size={12}
                                    color="white"
                                  />
                                  <Text
                                    style={{
                                      fontFamily:
                                        "Montserrat_500Medium",
                                    }}
                                    className="text-white text-[11px] ml-1"
                                  >
                                    24°
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
                                  fontFamily: "Montserrat_700Bold",
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
                                    fontFamily: "Montserrat_700Bold",
                                  }}
                                  className="text-white text-[12px] flex-1 pr-3"
                                >
                                  Irrigation Advisory
                                </Text>

                                <Text
                                  style={{
                                    fontFamily:
                                      "Montserrat_500Medium",
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
                                  fontFamily:
                                    "Montserrat_500Medium",
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
