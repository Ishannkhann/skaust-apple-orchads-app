import React, {
  useCallback,
  useState,
  useRef,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";

export default function AddStep1() {

  const router = useRouter();

  const isDark =
    useColorScheme() === "dark";

  const [name, setName] = useState("");
  const [district, setDistrict] =
    useState("");

  const [block, setBlock] =
    useState("");

  const [village, setVillage] =
    useState("");

  // ✅ FIX: prevent unnecessary rehydration overwrite
  const hasLoadedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {

      const loadData = async () => {

        const editing =
          await AsyncStorage.getItem(
            "editingOrchard"
          );

        const newOrchard =
          await AsyncStorage.getItem(
            "newOrchard"
          );

        // ✅ EDIT MODE (highest priority)
        if (editing) {

          const orchard =
            JSON.parse(editing);

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

          hasLoadedRef.current = true;

          return;
        }

        // ✅ CREATE MODE
        if (newOrchard) {

          const orchard =
            JSON.parse(newOrchard);

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

          hasLoadedRef.current = true;

          return;
        }

        // 🆕 TRUE FRESH START
        if (!hasLoadedRef.current) {

          setName("");
          setDistrict("");
          setBlock("");
          setVillage("");

          hasLoadedRef.current = true;
        }
      };

      loadData();

    }, [])
  );

  const validate = () => {

    if (!name.trim()) {
      Alert.alert(
        "Missing Field",
        "Orchard Name is required"
      );
      return false;
    }

    if (!district.trim()) {
      Alert.alert(
        "Missing Field",
        "District is required"
      );
      return false;
    }

    if (!block.trim()) {
      Alert.alert(
        "Missing Field",
        "Block is required"
      );
      return false;
    }

    if (!village.trim()) {
      Alert.alert(
        "Missing Field",
        "Village is required"
      );
      return false;
    }

    return true;
  };

  const saveAndNext = async () => {

    if (!validate()) return;

    const orchardData = {
      name: name.trim(),
      district: district.trim(),
      block: block.trim(),
      village: village.trim(),
    };

    const existingEdit =
      await AsyncStorage.getItem(
        "editingOrchard"
      );

    if (existingEdit) {

      await AsyncStorage.setItem(
        "editingOrchard",
        JSON.stringify({
          ...JSON.parse(
            existingEdit
          ),
          ...orchardData,
        })
      );

    } else {

      const existingNew =
        await AsyncStorage.getItem(
          "newOrchard"
        );

      await AsyncStorage.setItem(
        "newOrchard",
        JSON.stringify({
          ...(existingNew
            ? JSON.parse(
                existingNew
              )
            : {}),
          ...orchardData,
        })
      );
    }

    router.push(
      "/orchard/add-step-2"
    );
  };

  const inputBase =
    "rounded-2xl px-5 py-5 text-lg border";

  const inputStyle = isDark
    ? `${inputBase} bg-slate-800 text-white border-slate-700`
    : `${inputBase} bg-white text-green-950 border-green-100`;

  return (

    <SafeAreaView
      className={`flex-1 ${
        isDark
          ? "bg-slate-950"
          : "bg-lime-50"
      }`}
    >

      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        className="flex-1"
      >

        <View className="flex-1 px-5 pt-5">

          {/* HEADER */}
          <Text
            style={{
              fontFamily:
                "Montserrat_700Bold",
            }}
            className={`text-3xl ${
              isDark
                ? "text-white"
                : "text-green-950"
            }`}
          >
            Add Orchard
          </Text>

          <Text
            style={{
              fontFamily:
                "Montserrat_500Medium",
            }}
            className={`mt-2 mb-6 text-base ${
              isDark
                ? "text-gray-400"
                : "text-green-700"
            }`}
          >
            Step 1 of 3 • Basic orchard information
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 50,
            }}
            className="flex-1"
          >

            <View className="gap-6">

              {/* ORCHARD NAME */}
              <View>

                <Text
                  style={{
                    fontFamily:
                      "Montserrat_600SemiBold",
                  }}
                  className={`mb-2 text-base ${
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
                  style={{
                    textAlignVertical:
                      "center",

                    fontFamily:
                      "Montserrat_500Medium",
                  }}
                />

              </View>

              {/* DISTRICT */}
              <View>

                <Text
                  style={{
                    fontFamily:
                      "Montserrat_600SemiBold",
                  }}
                  className={`mb-2 text-base ${
                    isDark
                      ? "text-gray-300"
                      : "text-green-900"
                  }`}
                >
                  District *
                </Text>

                <TextInput
                  placeholder="Select district"
                  placeholderTextColor="#888"
                  value={district}
                  onChangeText={
                    setDistrict
                  }
                  className={inputStyle}
                  style={{
                    textAlignVertical:
                      "center",

                    fontFamily:
                      "Montserrat_500Medium",
                  }}
                />

              </View>

              {/* BLOCK */}
              <View>

                <Text
                  style={{
                    fontFamily:
                      "Montserrat_600SemiBold",
                  }}
                  className={`mb-2 text-base ${
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
                  style={{
                    textAlignVertical:
                      "center",

                    fontFamily:
                      "Montserrat_500Medium",
                  }}
                />

              </View>

              {/* VILLAGE */}
              <View>

                <Text
                  style={{
                    fontFamily:
                      "Montserrat_600SemiBold",
                  }}
                  className={`mb-2 text-base ${
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
                  onChangeText={
                    setVillage
                  }
                  className={inputStyle}
                  style={{
                    textAlignVertical:
                      "center",

                    fontFamily:
                      "Montserrat_500Medium",
                  }}
                />

              </View>

            </View>

          </ScrollView>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={saveAndNext}
            activeOpacity={0.85}
            className="bg-green-600 py-5 rounded-2xl mb-4"
          >

            <Text
              style={{
                fontFamily:
                  "Montserrat_600SemiBold",
              }}
              className="text-white text-center text-lg"
            >
              Next
            </Text>

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}
