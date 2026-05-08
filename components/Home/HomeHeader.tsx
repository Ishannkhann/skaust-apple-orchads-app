import React, {
  useState,
} from "react";

import {
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import {
  Menu,
} from "lucide-react-native";

import GreetingSection from "./GreetingSection";

import NotificationBell from "./NotificationBell";

import SideDrawer from "./SideDrawer";

export default function HomeHeader() {
  const isDark =
    useColorScheme() === "dark";

  const [drawerVisible,
    setDrawerVisible] =
    useState(false);

  return (
    <>
      <View className="px-5 pt-4 pb-2">

        {/* TOP ROW */}
        <View className="flex-row items-center">

          {/* MENU BUTTON */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              setDrawerVisible(
                true
              )
            }
            className={`w-12 h-12 rounded-2xl items-center justify-center border ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-green-100"
            }`}
          >
            <Menu
              size={24}
              color={
                isDark
                  ? "white"
                  : "#14532d"
              }
            />
          </TouchableOpacity>

          {/* GREETING */}
          <GreetingSection name="Ishhan" />

          {/* NOTIFICATIONS */}
          <NotificationBell />

        </View>

      </View>

      {/* SIDE DRAWER */}
      <SideDrawer
        visible={drawerVisible}
        onClose={() =>
          setDrawerVisible(
            false
          )
        }
      />
    </>
  );
}
