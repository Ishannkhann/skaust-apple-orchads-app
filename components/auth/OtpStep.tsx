import React from "react";
import type { MutableRefObject } from "react";

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

export default function OtpStep({
  phone,
  otp,
  inputs,
  loading,
  timer,
  canResend,
  onOtpChange,
  onVerify,
  onResend,
}: {
  phone: string;
  otp: string[];
  inputs: MutableRefObject<(TextInput | null)[]>;
  loading: boolean;
  timer: number;
  canResend: boolean;
  onOtpChange: (value: string, index: number) => void;
  onVerify: () => void;
  onResend: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  return (
    <>
      <Text
        style={{ fontFamily: Fonts.medium }}
        className={`text-center mb-8 text-base ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Enter OTP sent to +91 {phone}
      </Text>

      {/* OTP BOXES */}
      <View className="flex-row justify-between mb-8">

        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(value) => onOtpChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
            placeholder="•"
            placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
            style={{ fontFamily: Fonts.bold }}
            className={`w-12 h-14 rounded-2xl border text-center text-xl ${
              isDark
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-gray-200 text-black"
            }`}
          />
        ))}

      </View>

      {/* VERIFY BUTTON */}
      <TouchableOpacity
        onPress={onVerify}
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
            Verify OTP
          </Text>
        )}
      </TouchableOpacity>

      {/* RESEND OTP */}
      <View className="items-center mt-6">

        <TouchableOpacity onPress={onResend} disabled={!canResend}>
          <Text
            style={{ fontFamily: Fonts.medium }}
            className={`text-base ${
              canResend ? "text-brand-green" : "text-gray-400"
            }`}
          >
            {canResend ? "Resend OTP" : `Resend in ${timer}s`}
          </Text>
        </TouchableOpacity>

      </View>
    </>
  );
}
