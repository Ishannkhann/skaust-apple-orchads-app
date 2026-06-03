import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { useOrchardDraft } from "@/hooks/useOrchardDraft";
import {
  VARIETY_OPTIONS,
  ORCHARD_TYPE_OPTIONS,
  SOIL_TYPE_OPTIONS,
} from "@/constants/orchardOptions";
import { Fonts } from "@/theme/fonts";
import StepHeader from "@/components/orchard/form/StepHeader";
import DropdownField from "@/components/orchard/form/DropdownField";
import PrimaryButton from "@/components/orchard/form/PrimaryButton";
import SelectModal from "@/components/orchard/form/SelectModal";

type FieldKey = "variety" | "orchardType" | "soilType";

const DROPDOWN_DATA: Record<FieldKey, string[]> = {
  variety: VARIETY_OPTIONS,
  orchardType: ORCHARD_TYPE_OPTIONS,
  soilType: SOIL_TYPE_OPTIONS,
};

export default function AddStep2() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const { loadDraft, saveStep } = useOrchardDraft();

  const TEXT_PRIMARY = isDark ? "text-white" : "text-brand-text";
  const TEXT_SECONDARY = isDark ? "text-gray-400" : "text-brand-green";
  const INPUT_DARK = "bg-slate-800 text-white border-slate-700";
  const INPUT_LIGHT = "bg-white text-brand-text border-edge-green";

  const [variety, setVariety] = useState("");
  const [orchardType, setOrchardType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [age, setAge] = useState("");

  const [modal, setModal] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<FieldKey | null>(null);
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [tempValue, setTempValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions =
    activeField === "variety"
      ? options.filter((o) =>
          o.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

  useEffect(() => {
    (async () => {
      const { data, editing } = await loadDraft();

      // Only edit-mode hydrates step 2 (matches previous behavior which read
      // exclusively from editingOrchard here).
      if (editing && data) {
        setVariety(data.variety ?? "");
        setOrchardType(data.orchardType ?? "");
        setSoilType(data.soilType ?? "");
        setAge(data.age ?? "");

        if (data.variety) {
          setSelectedVarieties(
            typeof data.variety === "string"
              ? data.variety.split(", ").filter(Boolean)
              : []
          );
        }
      } else {
        setVariety("");
        setOrchardType("");
        setSoilType("");
        setAge("");
        setSelectedVarieties([]);
      }
    })();
  }, []);

  const openDropdown = (field: FieldKey) => {
    setActiveField(field);
    setOptions(DROPDOWN_DATA[field]);
    setTempValue("");
    setSearchQuery("");

    if (field === "variety") {
      setSelectedVarieties([]);
    }

    setModal(true);
  };

  const selectOption = (value: string) => {
    if (activeField === "variety") {
      setSelectedVarieties((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
      return;
    }

    setTempValue(value);
  };

  const confirmSelection = () => {
    if (activeField === "variety") {
      setVariety(selectedVarieties.join(", "));
    }

    if (activeField === "orchardType") {
      setOrchardType(tempValue);
    }

    if (activeField === "soilType") {
      setSoilType(tempValue);
    }

    setModal(false);
    setActiveField(null);
    setTempValue("");
    setSelectedVarieties([]);
    setSearchQuery("");
  };

  const next = async () => {
    const { editing, data } = await loadDraft();

    if (editing && data) {
      await saveStep({
        variety: variety || data.variety,
        orchardType: orchardType || data.orchardType,
        soilType: soilType || data.soilType,
        age: age || data.age,
      });
    } else {
      await saveStep({ variety, orchardType, soilType, age });
    }

    router.push("/orchard/add-step-3");
  };

  const getAgeSuffix = () => {
    if (!age) return "year";
    return Number(age) === 1 ? "year" : "years";
  };

  const isOkDisabled =
    activeField === "variety" ? selectedVarieties.length === 0 : !tempValue;

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
    >
      <ScrollView className="px-5">

        {/* HEADER */}
        <View className="mt-6">
          <StepHeader title="Orchard Setup" subtitle="Step 2 of 3" />
        </View>

        <DropdownField
          label="Apple Variety"
          value={variety}
          placeholder="Select Apple Variety"
          onPress={() => openDropdown("variety")}
        />

        <DropdownField
          label="Orchard Type"
          value={orchardType}
          placeholder="Select Orchard Type"
          onPress={() => openDropdown("orchardType")}
        />

        <DropdownField
          label="Soil Type"
          value={soilType}
          placeholder="Select Soil Type"
          onPress={() => openDropdown("soilType")}
        />

        {/* AGE */}
        <View className="mt-6">
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className={`mb-2 text-base ${TEXT_PRIMARY}`}
          >
            Orchard Age
          </Text>

          <View
            className={`flex-row items-center rounded-2xl border px-5 py-5 ${
              isDark ? INPUT_DARK : INPUT_LIGHT
            }`}
          >
            <TextInput
              value={age}
              onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              placeholder="Enter orchard age"
              placeholderTextColor={isDark ? "#aaa" : "#888"}
              className="flex-1 text-lg"
              style={{ fontFamily: Fonts.medium }}
            />

            <Text
              style={{ fontFamily: Fonts.medium }}
              className={TEXT_SECONDARY}
            >
              {getAgeSuffix()}
            </Text>
          </View>
        </View>

        {/* BUTTON */}
        <PrimaryButton
          label="Continue"
          onPress={next}
          className="mt-10 mb-10"
          textClassName="text-white text-center"
        />

      </ScrollView>

      {/* MODAL */}
      <SelectModal
        visible={modal}
        onClose={() => setModal(false)}
        options={filteredOptions}
        multiSelect={activeField === "variety"}
        searchable={activeField === "variety"}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedValues={selectedVarieties}
        tempValue={tempValue}
        onSelect={selectOption}
        onConfirm={confirmSelection}
        okDisabled={isOkDisabled}
      />
    </SafeAreaView>
  );
}
