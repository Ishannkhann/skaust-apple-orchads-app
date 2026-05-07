import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]">
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />

      <View className="flex-1 px-6 py-5 justify-between">
        {/* Header */}
        <View className="items-center mt-5">
          <Text className="text-[34px] font-bold text-center text-gray-900 leading-[42px]">
            Welcome to{"\n"}
            <Text className="text-blue-600 font-extrabold">
              {"<APP NAME>"}
            </Text>
          </Text>

          <Text className="mt-4 text-base leading-6 text-center text-gray-500 px-2">
            Your smart platform for seamless experiences, better productivity,
            and everything you need in one place.
          </Text>
        </View>

        {/* Logos */}
        <View className="flex-1 justify-center items-center gap-7">
          <View className="w-[220px] h-[130px] bg-white rounded-3xl justify-center items-center shadow-lg">
            <Image
              source={require("../assets/skaust-logo.png")}
              className="w-[150px] h-[90px]"
              resizeMode="contain"
            />
          </View>

          <View className="w-[220px] h-[130px] bg-white rounded-3xl justify-center items-center shadow-lg">
            <Image
              source={require("../assets/hadp-logo.png")}
              className="w-[150px] h-[90px]"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Footer */}
        <View className="items-end mb-2">
          <TouchableOpacity
            className="bg-blue-600 px-7 py-4 rounded-2xl"
            activeOpacity={0.85}
            onPress={() => router.push("/home")}
          >
            <Text className="text-white text-[17px] font-bold">
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
