import React, { useEffect, useState } from "react";

import {
  ScrollView,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeHeader from "../components/home/HomeHeader";

import ProfileCompletionCard from "../components/home/ProfileCompletionCard";

type Orchard = {
  id: string;
  name: string;
  message: string;
};

export default function Home() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [phone, setPhone] = useState<string>("");

  // 👉 ORCHARD STATE (now dynamic)
  const [orchards, setOrchards] = useState<Orchard[]>([
    {
      id: "1",
      name: "Orchard 1",
      message:
        "Light rainfall expected tomorrow. Recommended to postpone pesticide spraying activities for 24 hours.",
    },
  ]);

  // LOAD USER SESSION
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userPhone = await AsyncStorage.getItem("userPhone");
        if (userPhone) {
          setPhone(userPhone);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadUser();
  }, []);

  // 👉 ADD NEW ORCHARD
  const addOrchard = () => {
    const newOrchard: Orchard = {
      id: Date.now().toString(),
      name: `Orchard ${orchards.length + 1}`,
      message:
        "New orchard added. You can update its details later.",
    };

    setOrchards((prev) => [...prev, newOrchard]);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-slate-950" : "bg-lime-50"
      }`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HOME HEADER */}
        <HomeHeader />

        {/* DASHBOARD */}
        <View className="px-5 mt-4">
          <Text
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-green-950"
            }`}
          >
            Dashboard
          </Text>

          <Text
            className={`mt-2 leading-6 ${
              isDark ? "text-gray-400" : "text-green-700"
            }`}
          >
            Your agricultural insights, advisories, field operations,
            weather information, and recommendations will appear here.
          </Text>
        </View>

        {/* 👉 ORCHARD SLIDER SECTION */}
        <View className="mt-6">

          <FlatList
            data={orchards}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="px-5 w-screen">
                <View
                  className={`rounded-3xl p-5 border ${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-green-100"
                  }`}
                >
                  <Text
                    className={`text-lg font-bold ${
                      isDark ? "text-white" : "text-green-950"
                    }`}
                  >
                    {item.name}
                  </Text>

                  <Text
                    className={`mt-3 leading-6 ${
                      isDark ? "text-gray-400" : "text-green-700"
                    }`}
                  >
                    {item.message}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* 👉 ADD ORCHARD BUTTON */}
          <View className="px-5 mt-4">
            <TouchableOpacity
              onPress={addOrchard}
              className="bg-green-600 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                + Add New Orchard
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* PROFILE COMPLETION CARD */}
        <View className="px-5 mt-6">
          <ProfileCompletionCard progress={70} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
