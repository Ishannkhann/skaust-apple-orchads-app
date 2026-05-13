import React from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { useTheme } from "../../theme/useTheme";

export default function AppScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const { background } =
    useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${background}`}
    >
      {children}
    </SafeAreaView>
  );
}
