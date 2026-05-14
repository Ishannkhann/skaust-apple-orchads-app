import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddStep3() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const BG = isDark ? "bg-slate-950" : "bg-lime-50";

  // ✅ Step 1 style input base (CONSISTENCY FIX)
  const inputBase =
    "rounded-2xl px-5 py-5 text-lg border";

  const inputStyle = isDark
    ? `${inputBase} bg-slate-800 text-white border-slate-700`
    : `${inputBase} bg-white text-green-950 border-green-100`;

  const [area, setArea] = useState("");
  const [landType, setLandType] = useState("");
  const [image, setImage] = useState("");

  const [modal, setModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const options = [
    "Irrigated",
    "Krewa",
    "Rainfed",
    "Plains",
    "Others",
  ];

  useEffect(() => {
    (async () => {
      const d = await AsyncStorage.getItem("editingOrchard");
      if (!d) {
        setLoaded(true);
        return;
      }

      const o = JSON.parse(d);

      setArea(o.area ?? "");
      setLandType(o.landType ?? "");
      setImage(o.image ?? "");

      setLoaded(true);
    })();
  }, []);

  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      return Alert.alert("Permission required");
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  const save = async () => {
    const editRaw = await AsyncStorage.getItem("editingOrchard");

    if (editRaw) {
      await AsyncStorage.setItem(
        "editingOrchard",
        JSON.stringify({
          ...JSON.parse(editRaw),
          area,
          landType,
          image,
        })
      );
    } else {
      await AsyncStorage.setItem(
        "newOrchard",
        JSON.stringify({
          area,
          landType,
          image,
        })
      );
    }

    router.replace("/home");
  };

  return (
    <SafeAreaView className={`flex-1 ${BG}`}>
      <ScrollView className="px-6">

        <Text className={`text-3xl font-bold mt-10 ${isDark ? "text-white" : "text-green-950"}`}>
          Finish Setup
        </Text>

        <Text className="text-gray-500 mt-1">Step 3 of 3</Text>

        {/* AREA */}
        <View className="mt-8">
          <Text className={`mb-2 text-base font-semibold ${isDark ? "text-white" : "text-green-950"}`}>
            Area in Canals
          </Text>

          <TextInput
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
            placeholder="Enter area"
            placeholderTextColor="#888"
            className={inputStyle}
            style={{ textAlignVertical: "center" }}
          />
        </View>

        {/* LAND TYPE */}
        <View className="mt-6">
          <Text className={`mb-2 text-base font-semibold ${isDark ? "text-white" : "text-green-950"}`}>
            Land Type
          </Text>

          <TouchableOpacity
            onPress={() => setModal(true)}
            className={inputStyle}
          >
            <Text className={landType ? inputStyle : "text-gray-400"}>
              {loaded ? landType || "Select Land Type" : "Loading..."}
            </Text>
          </TouchableOpacity>
        </View>

        {/* IMAGE */}
        <TouchableOpacity
          onPress={pickImage}
          className="mt-8 h-64 rounded-3xl border bg-white dark:bg-slate-900 overflow-hidden items-center justify-center"
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" />
          ) : (
            <>
              <Ionicons name="camera-outline" size={42} color="#6B7280" />
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
      <Modal isVisible={modal} onBackdropPress={() => setModal(false)}>
        <View className={`${inputStyle} rounded-2xl p-4`}>
          {options.map((o) => (
            <TouchableOpacity
              key={o}
              onPress={() => {
                setLandType(o);
                setModal(false);
              }}
              className="py-4"
            >
              <Text className={isDark ? "text-white" : "text-green-950"}>
                {o}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
