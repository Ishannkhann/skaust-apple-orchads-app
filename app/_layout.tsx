import "../global.css";

import { Stack } from "expo-router";

export default function Layout() {
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
