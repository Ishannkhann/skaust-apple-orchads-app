import { useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";

import { useRouter } from "expo-router";

import { saveSession } from "@/lib/session";

type Step = "phone" | "otp";

const OTP_LENGTH = 6;
const PHONE_LENGTH = 10;
const RESEND_SECONDS = 60;

/**
 * OTP login flow + session handling.
 * Behavior identical to the previous inline logic in app/login.tsx.
 * SECURITY: removed the console.log calls that leaked the phone number and
 * OTP code. No other logic changed.
 */
export function useOtpLogin() {
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [step, setStep] = useState<Step>("phone");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const inputs = useRef<(TextInput | null)[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [timer, setTimer] = useState<number>(RESEND_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);

  // ⏱ OTP Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, step]);

  const goBack = () => {
    router.replace("/");
  };

  const sendOtp = async () => {
    if (phone.length !== PHONE_LENGTH) {
      setError("Enter valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setTimeout(() => {
        setStep("otp");
        setLoading(false);

        setTimer(RESEND_SECONDS);
        setCanResend(false);
      }, 1000);
    } catch (err) {
      setError("Failed to send OTP");
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setTimeout(async () => {
        await saveSession(phone);

        setLoading(false);

        router.replace("/home");
      }, 1200);
    } catch (err) {
      setError("Invalid OTP");
      setLoading(false);
    }
  };

  const resendOtp = () => {
    if (!canResend) return;

    setTimer(RESEND_SECONDS);
    setCanResend(false);

    sendOtp();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return {
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
  };
}
