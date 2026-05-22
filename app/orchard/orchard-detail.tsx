import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  useColorScheme,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import HomeHeader from "../../components/Home/HomeHeader";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.32;

export default function OrchardDetailScreen() {
  const router = useRouter();
  const { orchard } = useLocalSearchParams();

  let orchardData = null;

  try {
    if (orchard) {
      orchardData =
        typeof orchard === "string"
          ? JSON.parse(orchard)
          : orchard;
    }
  } catch (e) {
    orchardData = null;
  }

  const isDark = useColorScheme() === "dark";
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // NEW: TAB STATE
  const [activeTab, setActiveTab] = useState<"home" | "info">("home");

  const heroImage = selectedImage || orchardData?.image || null;
  const hasImage = !!heroImage;

  const handleUpload = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow gallery access to upload an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-lime-50"}`}
    >
      <ScrollView
        className={isDark ? "bg-slate-950" : "bg-lime-50"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
      >
        <View
          className={`flex-1 px-5 pt-4 ${
            isDark ? "bg-slate-950" : "bg-lime-50"
          }`}
        >
          {/* HEADER */}
          <HomeHeader />

          {/* BACK BUTTON */}
          <TouchableOpacity
            onPress={() => router.back()}
            className={`self-start mt-4 mb-4 w-11 h-11 rounded-full items-center justify-center ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={isDark ? "#fff" : "#243022"}
            />
          </TouchableOpacity>

          {/* HERO */}
          <View
            style={{ height: HERO_HEIGHT }}
            className={`w-full rounded-[32px] overflow-hidden ${
              isDark ? "bg-slate-900" : "bg-[#dfe7d8]"
            }`}
          >
            {hasImage ? (
              <ImageBackground
                source={{ uri: heroImage }}
                resizeMode="cover"
                className="flex-1"
              >
                <View className="flex-1 bg-black/25 px-5 pt-5 pb-6 justify-end">
                  <View className="flex-row items-end justify-between">
                    <View className="flex-1 pr-4">
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "Montserrat_700Bold" }}
                        className="text-white text-[28px]"
                      >
                        {orchardData?.name || "Orchard Name"}
                      </Text>

                      <View className="flex-row items-center mt-1">
                        <Ionicons
                          name="location-outline"
                          size={15}
                          color="rgba(255,255,255,0.9)"
                        />
                        <Text
                          style={{ fontFamily: "Montserrat_500Medium" }}
                          className="ml-1 text-white/90 text-sm"
                        >
                          {orchardData?.location || "Orchard Location"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleUpload}
                      className="px-4 py-2 rounded-full bg-white/90 border border-white/40"
                    >
                      <Text
                        style={{ fontFamily: "Montserrat_600SemiBold" }}
                        className="text-[#243022] text-sm"
                      >
                        Edit Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            ) : (
              <View className="flex-1 px-5 pt-5 pb-6 justify-between">
                <View className="items-center flex-1 justify-center">
                  <TouchableOpacity
                    onPress={handleUpload}
                    activeOpacity={0.9}
                    className={`w-[82%] h-24 rounded-2xl border-2 border-dashed items-center justify-center ${
                      isDark
                        ? "border-slate-600 bg-slate-800/40"
                        : "border-[#9fb08f] bg-white/30"
                    }`}
                  >
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={isDark ? "#cbd5e1" : "#55624f"}
                    />
                    <Text
                      style={{ fontFamily: "Montserrat_500Medium" }}
                      className={`mt-2 text-sm ${
                        isDark ? "text-slate-300" : "text-[#55624f]"
                      }`}
                    >
                      Upload Cover
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* NEW: TABS */}
          <View className="mt-4 flex-row bg-white/70 dark:bg-slate-800 rounded-2xl p-1">
            <TouchableOpacity
              onPress={() => setActiveTab("home")}
              className={`flex-1 py-2 rounded-xl items-center ${
                activeTab === "home"
                  ? "bg-green-600"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "home"
                    ? "text-white"
                    : isDark
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("info")}
              className={`flex-1 py-2 rounded-xl items-center ${
                activeTab === "info"
                  ? "bg-green-600"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "info"
                    ? "text-white"
                    : isDark
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Orchard Info
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB CONTENT */}
          <View className="mt-4">
            {activeTab === "home" ? (
              <View>
                <Text
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Home Content Here
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Orchard Info
                </Text>

                <Text
                  className={`mt-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Name: {orchardData?.name}
                </Text>

                <Text
                  className={`mt-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Location: {orchardData?.location}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
