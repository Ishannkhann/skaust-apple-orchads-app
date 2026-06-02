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
          ? "bg-[#F2E3BE]"
          : "bg-[#E3EDD0]"
      }`}
    >

      <View
        className={`h-full rounded-full ${
          isIncomplete
            ? "bg-[#D9A441]"
            : "bg-[#6D8B4F]"
        }`}
        style={{
          width: `${progress}%`,
        }}
      />

    </View>
  );
}
