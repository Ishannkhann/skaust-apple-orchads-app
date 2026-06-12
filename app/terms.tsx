import React from "react";
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";

import BackButton from "@/components/ui/BackButton";

export default function TermsScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: "1. Introduction",
      content:
        "Welcome to ERAM (Empirical Risk Assessment Model). These Terms and Conditions govern your use of the ERAM mobile application. By accessing or using the app, you agree to be bound by these terms.",
    },
    {
      title: "2. Use of the Application",
      content:
        "ERAM is designed to assist apple orchard owners with risk assessment, weather insights, and advisory services. You agree to use the app only for lawful purposes and in accordance with these terms.",
    },
    {
      title: "3. Account & Data",
      content:
        "You are responsible for maintaining the confidentiality of your account. We collect location, orchard data, and usage information to provide personalized advisories. Your data is handled as per our Privacy Policy.",
    },
    {
      title: "4. Location & Weather Services",
      content:
        "The app uses your device location to deliver accurate weather and risk data. Disabling location services may limit certain features.",
    },
    {
      title: "5. Intellectual Property",
      content:
        "All content, including maps, advisories, and design elements, remains the property of ERAM and its partners (including SKUAST Kashmir). You may not copy or redistribute any part of the app without permission.",
    },
    {
      title: "6. Limitation of Liability",
      content:
        "ERAM provides advisory services based on available data. We are not liable for any losses or damages resulting from decisions made using the app. Always consult local agricultural experts when needed.",
    },
    {
      title: "7. Changes to Terms",
      content:
        "We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the revised terms.",
    },
    {
      title: "8. Contact",
      content:
        "If you have any questions about these Terms, please reach out via the Contact Us section in the app or email support@eram.app.",
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
          <FileText size={22} color={isDark ? "#fff" : "#052e16"} />
          <Text
            className={`text-[21px] font-bold ml-2.5 ${
              isDark ? "text-white" : "text-green-950"
            }`}
            style={{ fontFamily: "Montserrat_700Bold" }}
          >
            Terms & Conditions
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`text-[13px] mb-6 ${
            isDark ? "text-slate-400" : "text-[#6B7F5E]"
          }`}
          style={{ fontFamily: "Montserrat_500Medium" }}
        >
          Last updated: June 2026
        </Text>

        {sections.map((section, index) => (
          <View key={index} className="mb-6">
            <Text
              className={`text-[16px] mb-2 ${
                isDark ? "text-white" : "text-[#33422A]"
              }`}
              style={{ fontFamily: "Montserrat_600SemiBold" }}
            >
              {section.title}
            </Text>
            <Text
              className={`text-[14px] leading-relaxed ${
                isDark ? "text-slate-300" : "text-[#556B4A]"
              }`}
              style={{ fontFamily: "Montserrat_400Regular" }}
            >
              {section.content}
            </Text>
          </View>
        ))}

        <View className="mt-8 pt-6 border-t border-[#E8F0DC]">
          <Text
            className={`text-center text-xs ${
              isDark ? "text-slate-400" : "text-[#6B7F5E]"
            }`}
            style={{ fontFamily: "Montserrat_400Regular" }}
          >
            © 2026 ERAM • Powered by SKUAST Kashmir
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

