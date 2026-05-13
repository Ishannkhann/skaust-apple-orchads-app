import { useColorScheme } from "react-native";

export const useTheme = () => {
  const isDark = useColorScheme() === "dark";

  return {
    isDark,

    background: isDark ? "bg-slate-950" : "bg-slate-50",

    card: isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200",

    textPrimary: isDark ? "text-white" : "text-slate-900",

    textSecondary: isDark ? "text-gray-300" : "text-gray-500",

    input: "px-5 py-4 rounded-2xl border",

    buttonPrimary: "bg-green-600 py-4 rounded-2xl",

    buttonText: "text-white text-center font-semibold",
  };
};
