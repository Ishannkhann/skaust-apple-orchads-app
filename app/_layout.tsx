import "../global.css";

import { Stack } from "expo-router";

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: "transparent",
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
  );
}
