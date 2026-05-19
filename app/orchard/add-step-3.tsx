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

  const isDark =
    useColorScheme() === "dark";

  const BG = isDark
    ? "bg-slate-950"
    : "bg-lime-50";

  const CARD = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-green-100";

  const TEXT_PRIMARY = isDark
    ? "text-white"
    : "text-green-950";

  const TEXT_SECONDARY = isDark
    ? "text-gray-400"
    : "text-green-700";

  const inputBase =
    "rounded-2xl px-5 py-5 text-lg border";

  const inputStyle = isDark
    ? `${inputBase} bg-slate-800 text-white border-slate-700`
    : `${inputBase} bg-white text-green-950 border-green-100`;

  const [area, setArea] =
    useState("");

  const [landType, setLandType] =
    useState("");

  const [image, setImage] =
    useState("");

  const [modal, setModal] =
    useState(false);

  const [loaded, setLoaded] =
    useState(false);

  const [
    editingOrchard,
    setEditingOrchard,
  ] = useState<any>(null);

  const [
    tempLandType,
    setTempLandType,
  ] = useState("");

  const options = [
    "Irrigated",
    "Rainfed",
    "Karewa",
    "Plains",
    "Hilly",
    "Terraced",
    "Others",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const editRaw =
        await AsyncStorage.getItem(
          "editingOrchard"
        );

      if (editRaw) {

        const orchard =
          JSON.parse(editRaw);

        setEditingOrchard(
          orchard
        );

        setArea(
          orchard.area ?? ""
        );

        setLandType(
          orchard.landType ?? ""
        );

        setImage(
          orchard.image ?? ""
        );

      } else {

        setEditingOrchard(null);

        setArea("");

        setLandType("");

        setImage("");
      }

      setLoaded(true);

    } catch (err) {

      console.log(err);
    }
  };

  const pickImage = async () => {

    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      return Alert.alert(
        "Permission required"
      );
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

    try {

      const orchardsRaw =
        await AsyncStorage.getItem(
          "orchards"
        );

      const orchards =
        orchardsRaw
          ? JSON.parse(
              orchardsRaw
            )
          : [];

      if (editingOrchard) {

        const updatedOrchard = {
          ...editingOrchard,
          area:
            area ||
            editingOrchard.area,
          landType:
            landType ||
            editingOrchard.landType,
          image:
            image ||
            editingOrchard.image,
        };

        const filtered =
          orchards.filter(
            (o: any) =>
              o.id !==
              editingOrchard.id
          );

        const updated = [
          updatedOrchard,
          ...filtered,
        ];

        await AsyncStorage.setItem(
          "orchards",
          JSON.stringify(updated)
        );

        await AsyncStorage.removeItem(
          "editingOrchard"
        );

      } else {

        const existingNew =
          await AsyncStorage.getItem(
            "newOrchard"
          );

        const newData =
          existingNew
            ? JSON.parse(
                existingNew
              )
            : {};

        const newOrchard = {
          id: Date.now().toString(),
          ...newData,
          area,
          landType,
          image,
        };

        const updated = [
          newOrchard,
          ...orchards,
        ];

        await AsyncStorage.setItem(
          "orchards",
          JSON.stringify(updated)
        );

        await AsyncStorage.removeItem(
          "newOrchard"
        );
      }

      router.replace("/home");

    } catch (err) {

      console.log(err);

      Alert.alert(
        "Error saving orchard"
      );
    }
  };

  const openModal = () => {

    setTempLandType("");

    setModal(true);
  };

  const confirmSelection = () => {

    setLandType(
      tempLandType
    );

    setModal(false);

    setTempLandType("");
  };

  return (

    <SafeAreaView
      className={`flex-1 ${BG}`}
    >

      <ScrollView className="px-5">

        {/* HEADER */}
        <Text
          style={{
            fontFamily:
              "Montserrat_700Bold",
          }}
          className={`text-3xl mt-6 ${TEXT_PRIMARY}`}
        >
          Finish Setup
        </Text>

        <Text
          style={{
            fontFamily:
              "Montserrat_500Medium",
          }}
          className={`mt-2 text-base ${TEXT_SECONDARY}`}
        >
          Step 3 of 3
        </Text>

        {/* AREA */}
        <View className="mt-6">

          <Text
            style={{
              fontFamily:
                "Montserrat_600SemiBold",
            }}
            className={`mb-2 text-base ${TEXT_PRIMARY}`}
          >
            Area in Canals
          </Text>

          <TextInput
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
            placeholder="Enter orchard area"
            placeholderTextColor="#888"
            className={inputStyle}
            style={{
              fontFamily:
                "Montserrat_500Medium",
            }}
          />

        </View>

        {/* LAND TYPE */}
        <View className="mt-6">

          <Text
            style={{
              fontFamily:
                "Montserrat_600SemiBold",
            }}
            className={`mb-2 text-base ${TEXT_PRIMARY}`}
          >
            Land Type
          </Text>

          <TouchableOpacity
            onPress={openModal}
            className={`px-5 py-5 rounded-2xl border ${CARD}`}
          >

            <Text
              style={{
                fontFamily:
                  "Montserrat_500Medium",
              }}
              className={
                landType
                  ? TEXT_PRIMARY
                  : TEXT_SECONDARY
              }
            >
              {loaded
                ? landType ||
                  "Select Land Type"
                : "Loading..."}
            </Text>

          </TouchableOpacity>

        </View>

        {/* IMAGE */}
        <TouchableOpacity
          onPress={pickImage}
          className={`mt-8 h-64 rounded-3xl border overflow-hidden items-center justify-center ${CARD}`}
        >

          {image ? (

            <Image
              source={{
                uri: image,
              }}
              className="w-full h-full"
            />

          ) : (

            <>

              <Ionicons
                name="camera-outline"
                size={42}
                color="#6B7280"
              />

              <Text
                style={{
                  fontFamily:
                    "Montserrat_500Medium",
                }}
                className="text-gray-400 mt-3"
              >
                Tap to upload orchard image
              </Text>

            </>
          )}

        </TouchableOpacity>

        {/* SAVE */}
        <TouchableOpacity
          onPress={save}
          className="bg-green-600 py-5 rounded-2xl mt-10 mb-6"
        >

          <Text
            style={{
              fontFamily:
                "Montserrat_600SemiBold",
            }}
            className="text-white text-center text-lg"
          >
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
        style={{
          justifyContent:
            "center",
          margin: 20,
        }}
      >

        <View
          className={`${CARD} rounded-2xl overflow-hidden max-h-[70%]`}
        >

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >

            {options.map((o) => (

              <TouchableOpacity
                key={o}
                onPress={() =>
                  setTempLandType(o)
                }
                className={`py-4 px-5 ${
                  isDark
                    ? "border-b border-slate-700"
                    : "border-b border-green-100"
                }`}
              >

                <Text
                  style={{
                    fontFamily:
                      "Montserrat_500Medium",
                  }}
                  className={`text-base ${
                    isDark
                      ? "text-white"
                      : "text-green-950"
                  }`}
                >
                  {o}
                </Text>

              </TouchableOpacity>
            ))}

          </ScrollView>

          {/* OK BUTTON */}
          <TouchableOpacity
            onPress={
              confirmSelection
            }
            disabled={!tempLandType}
            className={`py-4 ${
              tempLandType
                ? "bg-green-600"
                : "bg-gray-400"
            }`}
          >

            <Text
              style={{
                fontFamily:
                  "Montserrat_600SemiBold",
              }}
              className="text-center text-white"
            >
              OK
            </Text>

          </TouchableOpacity>

        </View>

      </Modal>

    </SafeAreaView>
  );
}
