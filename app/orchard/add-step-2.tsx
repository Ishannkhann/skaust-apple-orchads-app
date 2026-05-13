import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

export default function AddStep1() {
  const router = useRouter();

  const isDark =
    useColorScheme() === "dark";

  const [editingId, setEditingId] =
    useState("");

  const [name, setName] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [block, setBlock] =
    useState("");

  const [village, setVillage] =
    useState("");

  useEffect(() => {
    loadEditData();
  }, []);

  const loadEditData = async () => {
    try {

      const editingOrchard =
        await AsyncStorage.getItem(
          "editingOrchard"
        );

      if (editingOrchard) {

        const orchard =
          JSON.parse(editingOrchard);

        setEditingId(
          orchard.id || ""
        );

        setName(
          orchard.name || ""
        );

        setDistrict(
          orchard.district || ""
        );

        setBlock(
          orchard.block || ""
        );

        setVillage(
          orchard.village || ""
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  const validate = () => {

    if (!name.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter orchard name."
      );
      return false;
    }

    if (!district.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter district."
      );
      return false;
    }

    if (!block.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter block."
      );
      return false;
    }

    if (!village.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter village."
      );
      return false;
    }

    return true;
  };

  const saveAndNext = async () => {

    if (!validate()) return;

    try {

      const orchardData = {
        id: editingId,
        name,
        district,
        block,
        village,
      };

      await AsyncStorage.setItem(
        "newOrchard",
        JSON.stringify(orchardData)
      );

      router.push(
        "/orchard/add-step-2"
      );

    } catch (error) {
      console.log(error);
    }
  };

  const inputStyle = `px-5 py-4 rounded-[24px] border text-base ${
    isDark
      ? "bg-slate-800 border-slate-700 text-white"
      : "bg-white border-green-100 text-green-950"
  }`;

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark
          ? "bg-slate-950"
          : "bg-lime-50"
      }`}
    >
      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      >

        {/* HEADER */}
        <View className="mt-10">

          <Text
            className={`text-4xl font-bold tracking-tight ${
              isDark
                ? "text-white"
                : "text-green-950"
            }`}
          >
            {editingId
              ? "Update Orchard"
              : "Add Orchard"}
          </Text>

          <Text
            className={`mt-3 text-[15px] leading-7 ${
              isDark
                ? "text-gray-400"
                : "text-green-700"
            }`}
          >
            Step 1 of 3 • Orchard identity & location
          </Text>

          {/* PROGRESS */}
          <View className="mt-6 h-2 bg-green-100 rounded-full overflow-hidden">
            <View className="w-1/3 h-full bg-green-600 rounded-full" />
          </View>

        </View>

        {/* FORM */}
        <View className="mt-10 gap-y-6">

          <View>
            <Text
              className={`mb-3 font-medium ${
                isDark
                  ? "text-gray-300"
                  : "text-green-900"
              }`}
            >
              Orchard Name *
            </Text>

            <TextInput
              placeholder="Enter orchard name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              className={inputStyle}
            />
          </View>

          <View>
            <Text
              className={`mb-3 font-medium ${
                isDark
                  ? "text-gray-300"
                  : "text-green-900"
              }`}
            >
              District *
            </Text>

            <TextInput
              placeholder="Enter district"
              placeholderTextColor="#888"
              value={district}
              onChangeText={setDistrict}
              className={inputStyle}
            />
          </View>

          <View>
            <Text
              className={`mb-3 font-medium ${
                isDark
                  ? "text-gray-300"
                  : "text-green-900"
              }`}
            >
              Block *
            </Text>

            <TextInput
              placeholder="Enter block"
              placeholderTextColor="#888"
              value={block}
              onChangeText={setBlock}
              className={inputStyle}
            />
          </View>

          <View>
            <Text
              className={`mb-3 font-medium ${
                isDark
                  ? "text-gray-300"
                  : "text-green-900"
              }`}
            >
              Village *
            </Text>

            <TextInput
              placeholder="Enter village"
              placeholderTextColor="#888"
              value={village}
              onChangeText={setVillage}
              className={inputStyle}
            />
          </View>

        </View>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={saveAndNext}
          activeOpacity={0.85}
          className="bg-green-600 py-5 rounded-[24px] mt-12"
        >
          <Text className="text-white text-center font-semibold text-base">
            Continue
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
