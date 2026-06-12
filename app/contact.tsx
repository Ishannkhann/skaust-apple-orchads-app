import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react-native";
import MapView, { Marker } from "react-native-maps";

import BackButton from "@/components/ui/BackButton";

export default function ContactScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const contactOptions = [
    {
      id: "email",
      title: "Email Support",
      subtitle: "support@eram.app",
      icon: Mail,
      color: "#6D8B4F",
      onPress: () => {
        Linking.openURL("mailto:support@eram.app").catch(() =>
          Alert.alert("Error", "Could not open email app")
        );
      },
    },
    {
      id: "phone",
      title: "Call Us",
      subtitle: "+91 98765 43210",
      icon: Phone,
      color: "#6D8B4F",
      onPress: () => {
        Linking.openURL("tel:+919876543210").catch(() =>
          Alert.alert("Error", "Could not open phone app")
        );
      },
    },
    {
      id: "whatsapp",
      title: "WhatsApp Support",
      subtitle: "Chat with us on WhatsApp",
      icon: Phone,
      color: "#25D366",
      onPress: () => {
        const message = encodeURIComponent(
          "Hello! I need help with the ERAM app."
        );
        Linking.openURL(
          `https://wa.me/919876543210?text=${message}`
        ).catch(() =>
          Alert.alert("Error", "Could not open WhatsApp")
        );
      },
    },
  ];

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
    >
      {/* Header */}
      <View
        className="px-5 flex-row items-center"
        style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
      >
        <BackButton onPress={() => router.back()} />
        
        <View className="flex-1 flex-row items-center justify-center -ml-10">
          <Mail size={22} color={isDark ? "#fff" : "#052e16"} />
          <Text
            className={`text-[21px] font-bold ml-2.5 ${
              isDark ? "text-white" : "text-green-950"
            }`}
            style={{ fontFamily: "Montserrat_700Bold" }}
          >
            Contact Us
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro text - reduced spacing */}
        <Text
          className={`text-[14px] mb-5 leading-relaxed ${
            isDark ? "text-slate-300" : "text-[#556B4A]"
          }`}
          style={{ fontFamily: "Montserrat_500Medium" }}
        >
          We're here to help with your orchard management needs.
        </Text>

        {/* Contact Options - tighter spacing */}
        {contactOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={option.onPress}
              activeOpacity={0.85}
              className={`flex-row items-center p-4 rounded-3xl mb-3 ${
                isDark ? "bg-slate-900" : "bg-white"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                className="w-11 h-11 rounded-2xl items-center justify-center"
                style={{ backgroundColor: option.color }}
              >
                <Icon size={20} color="#fff" />
              </View>

              <View className="ml-3.5 flex-1">
                <Text
                  className={`text-[16px] ${
                    isDark ? "text-white" : "text-[#33422A]"
                  }`}
                  style={{ fontFamily: "Montserrat_600SemiBold" }}
                >
                  {option.title}
                </Text>
                <Text
                  className="text-[13px] mt-0.5"
                  style={{
                    color: option.color,
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  {option.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Response time - reduced top margin */}
        <View className="mt-4 mb-6 items-center">
          <Text
            className={`text-[11px] text-center ${
              isDark ? "text-slate-400" : "text-[#6B7F5E]"
            }`}
            style={{ fontFamily: "Montserrat_400Regular" }}
          >
            Response time: Usually within 2–4 hours
          </Text>
        </View>

        {/* ==================== SKUAST KASHMIR MAP SECTION ==================== */}
        <View className="mb-8">
          <View className="flex-row items-center mb-2.5 px-1">
            <MapPin size={18} color={isDark ? "#fff" : "#33422A"} />
            <Text
              className={`text-lg ml-2 ${
                isDark ? "text-white" : "text-[#33422A]"
              }`}
              style={{ fontFamily: "Montserrat_700Bold" }}
            >
              Visit SKUAST Kashmir
            </Text>
          </View>

          <Text
            className={`text-[13px] mb-3 leading-relaxed px-1 ${
              isDark ? "text-slate-300" : "text-[#556B4A]"
            }`}
            style={{ fontFamily: "Montserrat_500Medium" }}
          >
            Our parent institution and research partner
          </Text>

          {/* Address Card - tighter map height */}
          <TouchableOpacity
            onPress={() => {
              const address = encodeURIComponent(
                "SKUAST Kashmir, Shalimar Campus, Srinagar, Jammu and Kashmir 191123"
              );
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${address}`
              ).catch(() =>
                Alert.alert("Error", "Could not open maps")
              );
            }}
            activeOpacity={0.9}
            className={`rounded-3xl overflow-hidden border ${
              isDark ? "border-slate-800 bg-slate-900" : "border-[#E8F0DC] bg-white"
            }`}
          >
            {/* Map - reduced height */}
            <View className="h-[180px] w-full">
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: 34.1467,
                  longitude: 74.8791,
                  latitudeDelta: 0.012,
                  longitudeDelta: 0.012,
                }}
                showsUserLocation={false}
                showsMyLocationButton={false}
                zoomEnabled={true}
                scrollEnabled={true}
              >
                <Marker
                  coordinate={{
                    latitude: 34.1467,
                    longitude: 74.8791,
                  }}
                  title="SKUAST Kashmir"
                  description="Shalimar Campus, Srinagar"
                />
              </MapView>
            </View>

            {/* Address Info - reduced padding */}
            <View className="p-4 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className={`text-[15px] ${
                    isDark ? "text-white" : "text-[#33422A]"
                  }`}
                  style={{ fontFamily: "Montserrat_600SemiBold" }}
                >
                  SKUAST Kashmir
                </Text>
                <Text
                  className={`text-xs mt-1 leading-snug ${
                    isDark ? "text-slate-400" : "text-[#6B7F5E]"
                  }`}
                  style={{ fontFamily: "Montserrat_500Medium" }}
                >
                  Shalimar Campus, Rainawari{"\n"}Srinagar, J&K 191123
                </Text>
              </View>

              <View className="items-end">
                <View className="bg-[#6D8B4F] px-2.5 py-1 rounded-full flex-row items-center">
                  <ExternalLink size={12} color="#fff" />
                  <Text
                    className="text-white text-[10px] ml-1"
                    style={{ fontFamily: "Montserrat_600SemiBold" }}
                  >
                    Open Maps
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
