import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useOrchardDraft } from "@/hooks/useOrchardDraft";
import { LAND_TYPE_OPTIONS } from "@/constants/orchardOptions";
import { Fonts } from "@/theme/fonts";
import StepHeader from "@/components/orchard/form/StepHeader";
import FormField from "@/components/orchard/form/FormField";
import DropdownField from "@/components/orchard/form/DropdownField";
import PrimaryButton from "@/components/orchard/form/PrimaryButton";
import SelectModal from "@/components/orchard/form/SelectModal";

export default function AddStep3() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const { loadDraft, commitOrchard } = useOrchardDraft();

  const CARD = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-edge-green";

  const [area, setArea] = useState("");
  const [landType, setLandType] = useState("");
  const [image, setImage] = useState("");

  const [modal, setModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [editingOrchard, setEditingOrchard] = useState<any>(null);
  const [tempLandType, setTempLandType] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data, editing } = await loadDraft();

      if (editing && data) {
        setEditingOrchard(data);
        setArea(data.area ?? "");
        setLandType(data.landType ?? "");
        setImage(data.image ?? "");
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
    try {
      await commitOrchard({ area, landType, image }, editingOrchard);
      router.replace("/home");
    } catch (err) {
      console.log(err);
      Alert.alert("Error saving orchard");
    }
  };

  const openModal = () => {
    setTempLandType("");
    setModal(true);
  };

  const confirmSelection = () => {
    setLandType(tempLandType);
    setModal(false);
    setTempLandType("");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
    >
      <ScrollView className="px-5">

        {/* HEADER */}
        <View className="mt-6">
          <StepHeader title="Finish Setup" subtitle="Step 3 of 3" />
        </View>

        {/* AREA */}
        <FormField
          label="Area in Kanals"
          value={area}
          onChangeText={setArea}
          keyboardType="numeric"
          placeholder="Enter orchard area"
          containerClassName="mt-6"
        />

        {/* LAND TYPE */}
        <DropdownField
          label="Land Type"
          value={landType}
          placeholder={loaded ? "Select Land Type" : "Loading..."}
          onPress={openModal}
        />

        {/* IMAGE */}
        <TouchableOpacity
          onPress={pickImage}
          className={`mt-8 h-64 rounded-3xl border overflow-hidden items-center justify-center ${CARD}`}
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" />
          ) : (
            <>
              <Ionicons name="camera-outline" size={42} color="#6B7280" />

              <Text
                style={{ fontFamily: Fonts.medium }}
                className="text-gray-400 mt-3"
              >
                Tap to upload orchard image
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* SAVE */}
        <PrimaryButton
          label="Save Orchard"
          onPress={save}
          className="mt-10 mb-6"
        />

      </ScrollView>

      {/* MODAL */}
      <SelectModal
        visible={modal}
        onClose={() => setModal(false)}
        options={LAND_TYPE_OPTIONS}
        tempValue={tempLandType}
        onSelect={setTempLandType}
        onConfirm={confirmSelection}
        okDisabled={!tempLandType}
      />
    </SafeAreaView>
  );
}
