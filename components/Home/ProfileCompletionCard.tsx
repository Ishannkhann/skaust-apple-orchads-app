import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { Pencil } from "lucide-react-native";

import ProgressBar from "./ProgressBar";

interface ProfileCompletionCardProps {
  progress: number;
  onEdit?: () => void;
}

export default function ProfileCompletionCard({
  progress,
  onEdit,
}: ProfileCompletionCardProps) {

  const isDark =
    useColorScheme() === "dark";

  return (

    <View
      className={`mt-6 rounded-3xl p-5 border ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-[#DCE8C8]"
      }`}
    >

      {/* TOP ROW */}
      <View className="flex-row items-center justify-between">

        <View>

          {/* TITLE */}
          <Text
            style={{
              fontFamily:
                "Montserrat_700Bold",
            }}
            className={`text-lg ${
              isDark
                ? "text-white"
                : "text-[#33422A]"
            }`}
          >
            Complete Your Profile
          </Text>

          {/* SUBTITLE */}
          <Text
            style={{
              fontFamily:
                "Montserrat_500Medium",
            }}
            className={`mt-1 ${
              isDark
                ? "text-gray-400"
                : "text-[#6D8B4F]"
            }`}
          >
            {progress}% Completed
          </Text>

        </View>

        {/* EDIT BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onEdit}
          className="bg-[#6D8B4F] px-4 py-2 rounded-xl flex-row items-center"
        >

          <Pencil
            size={16}
            color="white"
          />

          <Text
            style={{
              fontFamily:
                "Montserrat_600SemiBold",
            }}
            className="text-white ml-2"
          >
            Update
          </Text>

        </TouchableOpacity>

      </View>

      {/* PROGRESS BAR */}
      <ProgressBar progress={progress} />

      {/* DESCRIPTION */}
      <Text
        style={{
          fontFamily:
            "Montserrat_500Medium",
        }}
        className={`mt-4 leading-6 ${
          isDark
            ? "text-gray-400"
            : "text-[#3D4A30]"
        }`}
      >
        Add orchard details and farm information
        to unlock better advisories and
        recommendations.
      </Text>

    </View>
  );
}
