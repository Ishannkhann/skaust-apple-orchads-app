import React from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

export default function PhoneStep({
  phone,
  onChangePhone,
  loading,
  onSubmit,
}: {
  phone: string;
  onChangePhone: (value: string) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <>
      {/* PHONE INPUT */}
      <View
        className={`flex-row items-center rounded-2xl border px-5 h-[68px] mb-8 ${
          isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          elevation: 3,
        }}
      >

        {/* COUNTRY CODE */}
        <View className="justify-center items-center pr-4">
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className={`text-base ${
              isDark ? "text-white" : "text-brand-text"
            }`}
          >
            +91
          </Text>
        </View>

        {/* DIVIDER */}
        <View
          className={`w-[1px] h-7 mr-4 ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        />

        {/* INPUT */}
        <TextInput
          placeholder="Enter mobile number"
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={onChangePhone}
          style={{
            paddingVertical: 0,
            textAlignVertical: "center",
            fontFamily: Fonts.medium,
          }}
          className={`flex-1 text-[17px] ${
            isDark ? "text-white" : "text-brand-text"
          }`}
        />

      </View>

      {/* SEND OTP BUTTON */}
      <TouchableOpacity
        onPress={onSubmit}
        className="bg-brand-green h-[60px] rounded-2xl items-center justify-center"
        activeOpacity={0.85}
        style={{
          shadowColor: Colors.brandGreen,
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          elevation: 4,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className="text-white text-base"
          >
            Send OTP
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
}
