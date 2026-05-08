import React from "react";

import { View } from "react-native";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({
  progress,
}: ProgressBarProps) {

  const isIncomplete =
    progress < 80;

  return (
    <View
      className={`w-full h-3 rounded-full overflow-hidden mt-3 ${
        isIncomplete
          ? "bg-red-100"
          : "bg-green-100"
      }`}
    >

      <View
        className={`h-full rounded-full ${
          isIncomplete
            ? "bg-red-500"
            : "bg-green-700"
        }`}
        style={{
          width: `${progress}%`,
        }}
      />

    </View>
  );
}
