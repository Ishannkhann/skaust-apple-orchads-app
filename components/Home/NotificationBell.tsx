import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
  useColorScheme,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Bell } from "lucide-react-native";

import { router } from "expo-router";

interface NotificationBellProps {
  onPress?: () => void;
}

export default function NotificationBell({
  onPress,
}: NotificationBellProps) {
  const isDark =
    useColorScheme() === "dark";

  const [count, setCount] =
    useState<number>(0);

  const rotateAnim = useRef(
    new Animated.Value(0)
  ).current;

  // LOAD SAVED COUNT
  useEffect(() => {
    loadNotificationCount();
  }, []);

  // RING BELL WHEN COUNT CHANGES
  useEffect(() => {
    if (count > 0) {
      ringBell();
    }
  }, [count]);

  // LOAD COUNT
  const loadNotificationCount =
    async () => {
      try {
        const stored =
          await AsyncStorage.getItem(
            "notification_count"
          );

        if (stored) {
          const parsed =
            parseInt(stored);

          setCount(
            isNaN(parsed)
              ? 0
              : parsed
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  // SAVE COUNT
  const saveNotificationCount =
    async (value: number) => {
      try {
        await AsyncStorage.setItem(
          "notification_count",
          value.toString()
        );
      } catch (error) {
        console.log(error);
      }
    };

  // BELL RING ANIMATION
  const ringBell = () => {
    Animated.sequence([
      Animated.timing(
        rotateAnim,
        {
          toValue: 1,
          duration: 100,
          easing:
            Easing.linear,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        rotateAnim,
        {
          toValue: -1,
          duration: 100,
          easing:
            Easing.linear,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        rotateAnim,
        {
          toValue: 1,
          duration: 100,
          easing:
            Easing.linear,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        rotateAnim,
        {
          toValue: 0,
          duration: 100,
          easing:
            Easing.linear,
          useNativeDriver: true,
        }
      ),
    ]).start();
  };

  // HANDLE PRESS
  const handlePress =
    async () => {
      try {
        // CLEAR COUNT
        setCount(0);

        await saveNotificationCount(0);

        // NAVIGATE
        router.push(
          "/notifications"
        );

        // OPTIONAL CALLBACK
        if (onPress) {
          onPress();
        }
      } catch (error) {
        console.log(error);
      }
    };

  const rotate =
    rotateAnim.interpolate({
      inputRange: [-1, 1],
      outputRange: [
        "-15deg",
        "15deg",
      ],
    });

  return (
    <View
      style={{
        zIndex: 999,
        elevation: 999,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        hitSlop={{
          top: 15,
          bottom: 15,
          left: 15,
          right: 15,
        }}
        style={{
          overflow: "visible",
        }}
        className={`w-12 h-12 rounded-2xl items-center justify-center border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-green-100"
        }`}
      >
        <Animated.View
          style={{
            transform: [
              { rotate },
            ],
          }}
        >
          <Bell
            size={22}
            color={
              isDark
                ? "white"
                : "#14532d"
            }
          />
        </Animated.View>

        {count > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 min-w-[20px] h-5 rounded-full items-center justify-center px-1">
            <Text className="text-white text-[10px] font-bold">
              {count > 99
                ? "99+"
                : count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
