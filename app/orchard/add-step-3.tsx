import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import Modal from "react-native-modal";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

type FieldKey = "landType";

export default function AddStep3() {
  const router = useRouter();

  const isDark =
    useColorScheme() === "dark";

  const BG =
    isDark
      ? "bg-slate-950"
      : "bg-lime-50";

  const [area, setArea] =
    useState("");

  const [landType, setLandType] =
    useState("");

  const [image, setImage] =
    useState("");

  const [modal, setModal] =
    useState(false);

  const [options, setOptions] =
    useState<string[]>([]);

  const [activeField, setActiveField] =
    useState<FieldKey | null>(
      null
    );

  useEffect(() => {
    (async () => {

      const d =
        await AsyncStorage.getItem(
          "editingOrchard"
        );

      if (!d) return;

      const o = JSON.parse(d);

      setArea(o.area || "");

      setLandType(
        o.landType || ""
      );

      setImage(o.image || "");

    })();
  }, []);

  const openDropdown = (
    field: FieldKey,
    list: string[]
  ) => {
    setActiveField(field);
    setOptions(list);
    setModal(true);
  };

  const selectOption = (
    value: string
  ) => {

    if (
      activeField === "landType"
    ) {
      setLandType(value);
    }

    setActiveField(null);

    setModal(false);
  };

  const pickImage = async () => {

    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {

      Alert.alert(
        "Permission required",
        "Please allow gallery access to upload orchard images"
      );

      return;
    }

    const res =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality: 0.8,
      });

    if (!res.canceled) {
      setImage(
        res.assets[0].uri
      );
    }
  };

  const save = async () => {

    if (
      !area ||
      isNaN(Number(area))
    ) {
      return Alert.alert(
        "Error",
        "Enter valid area"
      );
    }

    if (!landType) {
      return Alert.alert(
        "Error",
        "Select land type"
      );
    }

    if (!image) {
      return Alert.alert(
        "Error",
        "Upload orchard image"
      );
    }

    const base =
      await AsyncStorage.getItem(
        "newOrchard"
      );

    const parsed = base
      ? JSON.parse(base)
      : {};

    const final = {
      ...parsed,
      area,
      landType,
      image,

      id:
        parsed.id ||
        Date.now().toString(),
    };

    const list =
      await AsyncStorage.getItem(
        "orchards"
      );

    const arr = list
      ? JSON.parse(list)
      : [];

    const existingIndex =
      arr.findIndex(
        (o: any) =>
          o.id === final.id
      );

    if (existingIndex >= 0) {

      arr[existingIndex] = final;

      await AsyncStorage.setItem(
        "orchards",
        JSON.stringify(arr)
      );

    } else {

      await AsyncStorage.setItem(
        "orchards",
        JSON.stringify([
          ...arr,
          final,
        ])
      );
    }

    await AsyncStorage.removeItem(
      "newOrchard"
    );

    await AsyncStorage.removeItem(
      "editingOrchard"
    );

    router.replace("/home");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${BG}`}
    >
      <ScrollView
        className="px-6"
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      >

        {/* HEADER */}
        <Text
          className={`text-3xl font-bold mt-10 ${
            isDark
              ? "text-white"
              : "text-green-950"
          }`}
        >
          Finish Setup
        </Text>

        <Text className="text-gray-500 mt-1">
          Step 3 of 3
        </Text>

        {/* AREA */}
        <View className="mt-8">

          <Text className="mb-2 text-green-950 dark:text-white">
            Area in Canals
          </Text>

          <TextInput
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
            className="px-5 py-4 rounded-2xl border bg-white dark:bg-slate-900"
          />

        </View>

        {/* LAND TYPE */}
        <View className="mt-6">

          <Text className="mb-2 text-green-950 dark:text-white">
            Land Type
          </Text>

          <TouchableOpacity
            onPress={() =>
              openDropdown(
                "landType",
                [
                  "Irrigated",
                  "Krewa",
                  "Rainfed",
                  "Plains",
                  "Others",
                ]
              )
            }
            className="px-5 py-4 rounded-2xl border bg-white dark:bg-slate-900"
          >
            <Text
              className={
                landType
                  ? "text-black dark:text-white"
                  : "text-gray-400"
              }
            >
              {landType ||
                "Select Land Type"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* IMAGE */}
        <TouchableOpacity
          onPress={pickImage}
          className="mt-8 h-64 rounded-3xl border bg-white dark:bg-slate-900 overflow-hidden items-center justify-center"
        >

          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full"
            />
          ) : (
            <>
              <Ionicons
                name="camera-outline"
                size={42}
                color="#6B7280"
              />

              <Text className="text-gray-400 mt-3">
                Tap to upload orchard image
              </Text>
            </>
          )}

        </TouchableOpacity>

        {/* SAVE */}
        <TouchableOpacity
          onPress={save}
          className="bg-green-600 py-5 rounded-2xl mt-10"
        >
          <Text className="text-white text-center font-semibold">
            Save Orchard
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL */}
      <Modal
        isVisible={modal}
        onBackdropPress={() =>
          setModal(false)
        }
      >

        <View className="bg-white dark:bg-slate-900 rounded-2xl p-4">

          {options.map((o) => (
            <TouchableOpacity
              key={o}
              onPress={() =>
                selectOption(o)
              }
              className="py-4"
            >
              <Text className="text-green-950 dark:text-white">
                {o}
              </Text>
            </TouchableOpacity>
          ))}

        </View>

      </Modal>
    </SafeAreaView>
  );
}
