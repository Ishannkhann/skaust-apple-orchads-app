import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useOrchardDraft } from "@/hooks/useOrchardDraft";
import {
  VARIETY_OPTIONS,
  ORCHARD_TYPE_OPTIONS,
  SOIL_TYPE_OPTIONS,
} from "@/constants/orchardOptions";
import { Fonts } from "@/theme/fonts";
import StepHeader from "@/components/orchard/form/StepHeader";
import DropdownField from "@/components/orchard/form/DropdownField";
import FieldLabel from "@/components/orchard/form/FieldLabel";
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
          o.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : options;

  useEffect(() => {
    (async () => {
      const { data, editing } = await loadDraft();

      if (editing && data) {
        setVariety(data.variety ?? "");
        setOrchardType(data.orchardType ?? "");
        setSoilType(data.soilType ?? "");
        setAge(data.age ?? "");

        if (data.variety) {
          setSelectedVarieties(
            typeof data.variety === "string"
              ? data.variety.split(", ").filter(Boolean)
              : [],
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
          : [...prev, value],
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
    if (!age) return "years";
    return Number(age) === 1 ? "year" : "years";
  };

  const isOkDisabled =
    activeField === "variety" ? selectedVarieties.length === 0 : !tempValue;

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
            title="Orchard Setup"
            subtitle="Step 2 of 3 • Varieties & details"
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            className="flex-1 mt-4"
            keyboardShouldPersistTaps="handled"
          >
            <DropdownField
              label="Apple Variety"
              icon="git-branch-outline"
              value={variety}
              placeholder="Select Apple Variety"
              onPress={() => openDropdown("variety")}
            />

            <DropdownField
              label="Orchard Type"
              icon="basket-outline"
              value={orchardType}
              placeholder="Select Orchard Type"
              onPress={() => openDropdown("orchardType")}
            />

            <DropdownField
              label="Soil Type"
              icon="water-outline"
              value={soilType}
              placeholder="Select Soil Type"
              onPress={() => openDropdown("soilType")}
            />

            {/* AGE */}
            <View style={{ marginBottom: 14 }}>
              <FieldLabel icon="time-outline" label="Orchard Age" />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  borderWidth: 1,
                  borderColor: isDark ? "#334155" : "#8BA862",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <TextInput
                  value={age}
                  onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  placeholder="Enter orchard age"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  editable
                  style={{
                    flex: 1,
                    fontFamily: undefined,
                    fontSize: 14,
                    color: isDark ? "#f1f5f9" : "#33422A",
                    includeFontPadding: false,
                  }}
                />

                <Text
                  style={{
                    fontFamily: undefined,
                    fontSize: 14,
                    color: isDark ? "#94a3b8" : "#6D8B4F",
                  }}
                >
                  {getAgeSuffix()}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* BUTTON */}
          <PrimaryButton
            label="Continue"
            onPress={next}
            className="mb-4"
          />
        </View>
      </KeyboardAvoidingView>

      {/* MODAL */}
      <SelectModal
        visible={modal}
        onClose={() => setModal(false)}
        title={
          activeField === "variety"
            ? "Select Variety"
            : activeField === "orchardType"
            ? "Select Crop Type"
            : "Select Soil Type"
        }
        searchPlaceholder="Search apple varieties..."
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
