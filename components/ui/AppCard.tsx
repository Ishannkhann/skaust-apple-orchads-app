import React from "react";

import {
  View,
} from "react-native";

import { useTheme } from "../../theme/useTheme";

export default function AppCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { card } =
    useTheme();

  return (
    <View
      className={`rounded-3xl p-5 border ${card}`}
    >
      {children}
    </View>
  );
}
