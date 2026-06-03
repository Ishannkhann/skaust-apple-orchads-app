import React, { useCallback, useState, useRef } from "react";

import {
  View,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";

import { useOrchardDraft } from "@/hooks/useOrchardDraft";
import StepHeader from "@/components/orchard/form/StepHeader";
import FormField from "@/components/orchard/form/FormField";
import PrimaryButton from "@/components/orchard/form/PrimaryButton";

export default function AddStep1() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const { loadDraft, saveStep } = useOrchardDraft();

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");

  // ✅ FIX: prevent unnecessary rehydration overwrite
  const hasLoadedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const { data } = await loadDraft();

        // ✅ EDIT MODE / CREATE MODE (draft present)
        if (data) {
          setName(data.name || "");
          setDistrict(data.district || "");
          setBlock(data.block || "");
          setVillage(data.village || "");

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

    await saveStep({
      name: name.trim(),
      district: district.trim(),
      block: block.trim(),
      village: village.trim(),
    });

    router.push("/orchard/add-step-2");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-5 pt-5">

          {/* HEADER */}
          <StepHeader
            title="Add Orchard"
            subtitle="Step 1 of 3 • Basic orchard information"
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
            className="flex-1 mt-6"
          >
            <View className="gap-6">
              <FormField
                label="Orchard Name *"
                placeholder="Enter orchard name"
                value={name}
                onChangeText={setName}
              />

              <FormField
                label="District *"
                placeholder="Select district"
                value={district}
                onChangeText={setDistrict}
              />

              <FormField
                label="Block *"
                placeholder="Enter block"
                value={block}
                onChangeText={setBlock}
              />

              <FormField
                label="Village *"
                placeholder="Enter village"
                value={village}
                onChangeText={setVillage}
              />
            </View>
          </ScrollView>

          {/* BUTTON */}
          <PrimaryButton label="Next" onPress={saveAndNext} className="mb-4" />

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
