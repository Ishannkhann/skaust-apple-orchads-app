import React, {
  useEffect,
  useRef,
} from "react";

import {
  View,
  Text,
  Animated,
  Easing,
  useColorScheme,
} from "react-native";

interface GreetingSectionProps {
  name: string;
}

export default function GreetingSection({
  name,
}: GreetingSectionProps) {
  const isDark =
    useColorScheme() === "dark";

  const currentHour =
    new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  // WAVE ANIMATION
  const rotateAnim = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          rotateAnim,
          {
            toValue: 1,
            duration: 180,
            easing:
              Easing.linear,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          rotateAnim,
          {
            toValue: -1,
            duration: 180,
            easing:
              Easing.linear,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          rotateAnim,
          {
            toValue: 1,
            duration: 180,
            easing:
              Easing.linear,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          rotateAnim,
          {
            toValue: 0,
            duration: 180,
            easing:
              Easing.linear,
            useNativeDriver: true,
          }
        ),

        Animated.delay(1500),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [
      "-18deg",
      "18deg",
    ],
  });

  return (
    <View className="flex-1 ml-4">
      <Text
        className={`text-sm ${
          isDark
            ? "text-gray-400"
            : "text-green-700"
        }`}
      >
        {greeting}
      </Text>

      <View className="flex-row items-center mt-1">
        <Text
          className={`text-2xl font-bold ${
            isDark
              ? "text-white"
              : "text-green-950"
          }`}
        >
          {name}
        </Text>

        <Animated.Text
          style={{
            transform: [
              { rotate },
            ],
          }}
          className="text-2xl ml-2"
        >
          👋
        </Animated.Text>
      </View>
    </View>
  );
}
