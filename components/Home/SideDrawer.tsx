import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from "react-native";

import {
  X,
  House,
  Bell,
  User,
  LogOut,
  Sprout,
  Mail,
  Phone,
  FileText,
} from "lucide-react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideDrawer({
  visible,
  onClose,
}: SideDrawerProps) {

  const isDark =
    useColorScheme() === "dark";

  const logout = async () => {

    try {

      await AsyncStorage.removeItem(
        "isLoggedIn"
      );

      await AsyncStorage.removeItem(
        "userPhone"
      );

      router.replace("/");

    } catch (error) {

      console.log(error);
    }
  };

  const menuItems = [

    {
      title: "Home",
      icon: House,

      onPress: () => {
        onClose();

        router.push("/home");
      },
    },

    {
      title: "My Orchards",
      icon: Sprout,

      onPress: () => {
        onClose();

        router.push(
          "/orchard/my-orchards"
        );
      },
    },

    {
      title: "Notifications",
      icon: Bell,

      onPress: () => {
        onClose();

        router.push(
          "/notifications"
        );
      },
    },

    {
      title: "Profile",
      icon: User,

      onPress: () => {
        onClose();
      },
    },

    {
      title: "Contact Us",
      icon: Mail,

      onPress: () => {
        onClose();
        router.push("/contact");
      },
    },

    {
      title: "Terms & Conditions",
      icon: FileText,

      onPress: () => {
        onClose();
        router.push("/terms");
      },
    },
  ];

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      {/* OVERLAY */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/40 flex-row"
      >

        {/* DRAWER */}
        <TouchableOpacity
          activeOpacity={1}
          className={`w-[78%] h-full pt-16 px-5 ${
            isDark
              ? "bg-slate-900"
              : "bg-white"
          }`}
        >

          {/* TOP */}
          <View className="flex-row items-center justify-between">

            <Text
              style={{
                fontFamily:
                  "Montserrat_700Bold",
              }}
              className={`text-2xl ${
                isDark
                  ? "text-white"
                  : "text-[#33422A]"
              }`}
            >
              Menu
            </Text>

            <TouchableOpacity
              onPress={onClose}
            >

              <X
                size={24}
                color={
                  isDark
                    ? "white"
                    : "#33422A"
                }
              />

            </TouchableOpacity>

          </View>

          {/* MENU ITEMS */}
          <View className="mt-10">

            {menuItems.map(
              (item, index) => {

                const Icon =
                  item.icon;

                return (

                  <TouchableOpacity
                    key={index}
                    onPress={
                      item.onPress
                    }
                    activeOpacity={0.8}
                    className={`flex-row items-center py-4 px-4 rounded-2xl mb-3 ${
                      isDark
                        ? "bg-slate-800"
                        : "bg-[#F2F8E8]"
                    }`}
                  >

                    <Icon
                      size={22}
                      color={
                        isDark
                          ? "white"
                          : "#6D8B4F"
                      }
                    />

                    <Text
                      style={{
                        fontFamily:
                          "Montserrat_600SemiBold",
                      }}
                      className={`ml-4 text-base ${
                        isDark
                          ? "text-white"
                          : "text-[#33422A]"
                      }`}
                    >
                      {item.title}
                    </Text>

                  </TouchableOpacity>
                );
              }
            )}

          </View>

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.85}
            className="mt-auto mb-10 flex-row items-center bg-red-500 py-4 rounded-2xl justify-center"
          >

            <LogOut
              size={20}
              color="white"
            />

            <Text
              style={{
                fontFamily:
                  "Montserrat_700Bold",
              }}
              className="text-white ml-3"
            >
              Logout
            </Text>

          </TouchableOpacity>

        </TouchableOpacity>

      </TouchableOpacity>

    </Modal>
  );
}
