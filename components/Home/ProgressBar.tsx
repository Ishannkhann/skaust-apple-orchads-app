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
          ? "bg-surface-track-warn"
          : "bg-surface-track"
      }`}
    >

      <View
        className={`h-full rounded-full ${
          isIncomplete
            ? "bg-accent-amber"
            : "bg-brand-green"
        }`}
        style={{
          width: `${progress}%`,
        }}
      />

    </View>
  );
}

