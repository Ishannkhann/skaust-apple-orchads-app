import React from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Text,
  useColorScheme,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useOtpLogin } from "@/hooks/useOtpLogin";
import AuthHeader from "@/components/auth/AuthHeader";
import BackButton from "@/components/auth/BackButton";
import OtpStep from "@/components/auth/OtpStep";
import PhoneStep from "@/components/auth/PhoneStep";

export default function Login() {
  const isDark = useColorScheme() === "dark";

  const {
    phone,
    setPhone,
    step,
    otp,
    inputs,
    loading,
    error,
    timer,
    canResend,
    goBack,
    sendOtp,
    verifyOtp,
    resendOtp,
    handleOtpChange,
  } = useOtpLogin();

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
    >

      {/* BACK BUTTON */}
      <BackButton onPress={goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >

        {/* HEADER */}
        <AuthHeader
          title="Welcome Back"
          subtitle="Login with your mobile number"
        />

        {/* ERROR */}
        {error ? (
          <Text className="text-red-500 text-center mb-5">
            {error}
          </Text>
        ) : null}

        {/* PHONE STEP */}
        {step === "phone" && (
          <PhoneStep
            phone={phone}
            onChangePhone={setPhone}
            loading={loading}
            onSubmit={sendOtp}
          />
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <OtpStep
            phone={phone}
            otp={otp}
            inputs={inputs}
            loading={loading}
            timer={timer}
            canResend={canResend}
            onOtpChange={handleOtpChange}
            onVerify={verifyOtp}
            onResend={resendOtp}
          />
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
