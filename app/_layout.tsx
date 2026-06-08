import "../global.css";

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

export default function Layout() {

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const isDark = useColorScheme() === "dark";
  const backgroundColor = isDark ? "#020617" : "#F2F8E8";

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor,
          },
        }}
      >
      {/* HOME */}
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />

      {/* MY ORCHARDS */}
      <Stack.Screen
        name="orchard/my-orchards"
        options={{
          headerShown: false,
          animation: "slide_from_left",
        }}
      />

      {/* ORCHARD FLOW */}
      <Stack.Screen
        name="orchard/add-step-1"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="orchard/add-step-2"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="orchard/add-step-3"
        options={{
          headerShown: false,
        }}
      />
      </Stack>
    </>
  );
}
