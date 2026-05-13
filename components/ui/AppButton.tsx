import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../theme/useTheme";

export default function AppButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const { buttonPrimary, buttonText } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} className={buttonPrimary}>
      <Text className={buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
