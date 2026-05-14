import React, { useEffect, useState } from "react";
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

export default function AddStep1() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");

  useEffect(() => {
    const loadEditing = async () => {
      const data = await AsyncStorage.getItem("editingOrchard");

      if (data) {
        const orchard = JSON.parse(data);
        setName(orchard.name || "");
        setDistrict(orchard.district || "");
        setBlock(orchard.block || "");
        setVillage(orchard.village || "");
      }
    };

    loadEditing();
  }, []);

  const validate = () => {
    if (!name.trim()) {
      Alert.alert("Missing Field", "Orchard Name is required");
      return false;
    }
    if (!district.trim()) {
      Alert.alert("Missing Field", "District is required");
      return false;
    }
    if (!block.trim()) {
      Alert.alert("Missing Field", "Block is required");
      return false;
    }
    if (!village.trim()) {
      Alert.alert("Missing Field", "Village is required");
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

    const existingEdit = await AsyncStorage.getItem("editingOrchard");

    if (existingEdit) {
      // ✅ EDIT MODE → preserve session
      await AsyncStorage.setItem(
        "editingOrchard",
        JSON.stringify({
          ...JSON.parse(existingEdit),
          ...orchardData,
        })
      );
    } else {
      // 🆕 CREATE MODE
      await AsyncStorage.setItem("newOrchard", JSON.stringify(orchardData));
    }

    router.push("/orchard/add-step-2");
  };

  const inputBase =
    "rounded-2xl px-5 py-5 text-lg border";

  // ✅ FIXED ONLY HERE (SYNTAX FIX)
  const inputStyle = isDark
    ? `${inputBase} bg-slate-800 text-white border-slate-700`
    : `${inputBase} bg-white text-green-950 border-green-100`;

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-lime-50"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-5 pt-5">

          {/* HEADER */}
          <Text
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-green-950"
            }`}
          >
            Add Orchard
          </Text>

          <Text
            className={`mt-2 mb-6 text-base ${
              isDark ? "text-gray-400" : "text-green-700"
            }`}
          >
            Step 1 of 3 • Basic orchard information
          </Text>

          {/* FORM */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
            className="flex-1"
          >
            <View className="gap-6">

              {/* ORCHARD NAME */}
              <View>
                <Text
                  className={`mb-2 text-base font-semibold ${
                    isDark ? "text-gray-300" : "text-green-900"
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
                  style={{ textAlignVertical: "center" }}
                />
              </View>

              {/* DISTRICT */}
              <View>
                <Text
                  className={`mb-2 text-base font-semibold ${
                    isDark ? "text-gray-300" : "text-green-900"
                  }`}
                >
                  District *
                </Text>

                <TextInput
                  placeholder="Select district"
                  placeholderTextColor="#888"
                  value={district}
                  onChangeText={setDistrict}
                  className={inputStyle}
                  style={{ textAlignVertical: "center" }}
                />
              </View>

              {/* BLOCK */}
              <View>
                <Text
                  className={`mb-2 text-base font-semibold ${
                    isDark ? "text-gray-300" : "text-green-900"
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
                  style={{ textAlignVertical: "center" }}
                />
              </View>

              {/* VILLAGE */}
              <View>
                <Text
                  className={`mb-2 text-base font-semibold ${
                    isDark ? "text-gray-300" : "text-green-900"
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
                  style={{ textAlignVertical: "center" }}
                />
              </View>

            </View>
          </ScrollView>

          {/* FOOTER BUTTON */}
          <TouchableOpacity
            onPress={saveAndNext}
            activeOpacity={0.85}
            className="bg-green-600 py-5 rounded-2xl mb-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Next
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
