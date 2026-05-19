import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
} from "react-native";

import Modal from "react-native-modal";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

type FieldKey =
  | "variety"
  | "orchardType"
  | "soilType";

export default function AddStep2() {

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

  const INPUT_DARK =
    "bg-slate-800 text-white border-slate-700";

  const INPUT_LIGHT =
    "bg-white text-green-950 border-green-200";

  const [variety, setVariety] =
    useState("");

  const [
    orchardType,
    setOrchardType,
  ] = useState("");

  const [soilType, setSoilType] =
    useState("");

  const [age, setAge] =
    useState("");

  const [modal, setModal] =
    useState(false);

  const [options, setOptions] =
    useState<string[]>([]);

  const [activeField, setActiveField] =
    useState<FieldKey | null>(null);

  const [
    selectedVarieties,
    setSelectedVarieties,
  ] = useState<string[]>([]);

  const [tempValue, setTempValue] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  // ✅ FIX: stable dropdown source
  const DROPDOWN_DATA: Record<
    FieldKey,
    string[]
  > = {
    variety: [
      "Red Delicious",
      "Royal Delicious",
      "Rich-a-Red",
      "Scarlet Spur",
      "Red Chief",
      "Golden Delicious",
      "Maharaji",
      "American Trel",
      "Ambri",
      "Gala strains",
      "Fuji",
      "Honeycrisp",
      "Granny Smith",
      "Jonagold",
      "Oregon Spur",
      "Early Shanburry",
      "Spartan",
      "McIntosh",
      "Others",
    ],

    orchardType: [
      "Traditional Orchard",
      "Medium Density Orchard",
      "High Density Orchard",
      "Ultra High Density Orchard",
    ],

    soilType: [
      "Clayey",
      "Loamy",
      "Sandy",
      "Clay Loam",
      "Sandy Loam",
      "Silty",
      "Silty Loam",
      "Gravelly",
      "Organic Rich Soil",
    ],
  };

  const filteredOptions =
    activeField === "variety"
      ? options.filter((o) =>
          o
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
        )
      : options;

  useEffect(() => {

    (async () => {

      const d =
        await AsyncStorage.getItem(
          "editingOrchard"
        );

      if (d) {

        const o = JSON.parse(d);

        setVariety(
          o.variety ?? ""
        );

        setOrchardType(
          o.orchardType ?? ""
        );

        setSoilType(
          o.soilType ?? ""
        );

        setAge(o.age ?? "");

        if (o.variety) {

          setSelectedVarieties(
            typeof o.variety ===
              "string"
              ? o.variety
                  .split(", ")
                  .filter(Boolean)
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

  const openDropdown = (
    field: FieldKey
  ) => {

    setActiveField(field);

    setOptions(
      DROPDOWN_DATA[field]
    );

    setTempValue("");

    setSearchQuery("");

    if (field === "variety") {
      setSelectedVarieties([]);
    }

    setModal(true);
  };

  const selectOption = (
    value: string
  ) => {

    if (activeField === "variety") {

      setSelectedVarieties(
        (prev) =>
          prev.includes(value)
            ? prev.filter(
                (v) => v !== value
              )
            : [...prev, value]
      );

      return;
    }

    setTempValue(value);
  };

  const confirmSelection = () => {

    if (activeField === "variety") {
      setVariety(
        selectedVarieties.join(", ")
      );
    }

    if (
      activeField ===
      "orchardType"
    ) {
      setOrchardType(tempValue);
    }

    if (
      activeField === "soilType"
    ) {
      setSoilType(tempValue);
    }

    setModal(false);

    setActiveField(null);

    setTempValue("");

    setSelectedVarieties([]);

    setSearchQuery("");
  };

  const next = async () => {

    const editRaw =
      await AsyncStorage.getItem(
        "editingOrchard"
      );

    if (editRaw) {

      const existing =
        JSON.parse(editRaw);

      await AsyncStorage.setItem(
        "editingOrchard",
        JSON.stringify({
          ...existing,
          variety:
            variety ||
            existing.variety,
          orchardType:
            orchardType ||
            existing.orchardType,
          soilType:
            soilType ||
            existing.soilType,
          age:
            age || existing.age,
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
          variety,
          orchardType,
          soilType,
          age,
        })
      );
    }

    router.push(
      "/orchard/add-step-3"
    );
  };

  const getAgeSuffix = () => {

    if (!age) return "year";

    return Number(age) === 1
      ? "year"
      : "years";
  };

  const Dropdown = (
    label: string,
    value: string,
    field: FieldKey,
    _list: string[]
  ) => (

    <View className="mt-6">

      <Text
        style={{
          fontFamily:
            "Montserrat_600SemiBold",
        }}
        className={`mb-2 text-base ${TEXT_PRIMARY}`}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={() =>
          openDropdown(field)
        }
        className={`px-5 py-5 rounded-2xl border ${CARD}`}
      >

        <Text
          style={{
            fontFamily:
              "Montserrat_500Medium",
          }}
          className={
            value
              ? TEXT_PRIMARY
              : TEXT_SECONDARY
          }
        >
          {value ||
            `Select ${label}`}
        </Text>

      </TouchableOpacity>

    </View>
  );

  const isOkDisabled =
    activeField === "variety"
      ? selectedVarieties.length === 0
      : !tempValue;

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
          Orchard Setup
        </Text>

        <Text
          style={{
            fontFamily:
              "Montserrat_500Medium",
          }}
          className={TEXT_SECONDARY}
        >
          Step 2 of 3
        </Text>

        {Dropdown(
          "Apple Variety",
          variety,
          "variety",
          DROPDOWN_DATA.variety
        )}

        {Dropdown(
          "Orchard Type",
          orchardType,
          "orchardType",
          DROPDOWN_DATA.orchardType
        )}

        {Dropdown(
          "Soil Type",
          soilType,
          "soilType",
          DROPDOWN_DATA.soilType
        )}

        {/* AGE */}
        <View className="mt-6">

          <Text
            style={{
              fontFamily:
                "Montserrat_600SemiBold",
            }}
            className={`mb-2 text-base ${TEXT_PRIMARY}`}
          >
            Orchard Age
          </Text>

          <View
            className={`flex-row items-center rounded-2xl border px-5 py-5 ${
              isDark
                ? INPUT_DARK
                : INPUT_LIGHT
            }`}
          >

            <TextInput
              value={age}
              onChangeText={(text) =>
                setAge(
                  text.replace(
                    /[^0-9]/g,
                    ""
                  )
                )
              }
              keyboardType="numeric"
              placeholder="Enter orchard age"
              placeholderTextColor={
                isDark
                  ? "#aaa"
                  : "#888"
              }
              className="flex-1 text-lg"
              style={{
                fontFamily:
                  "Montserrat_500Medium",
              }}
            />

            <Text
              style={{
                fontFamily:
                  "Montserrat_500Medium",
              }}
              className={TEXT_SECONDARY}
            >
              {getAgeSuffix()}
            </Text>

          </View>

        </View>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={next}
          className="bg-green-600 py-5 rounded-2xl mt-10 mb-10"
        >

          <Text
            style={{
              fontFamily:
                "Montserrat_600SemiBold",
            }}
            className="text-white text-center"
          >
            Continue
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
          className={`${
            isDark
              ? "bg-slate-900"
              : "bg-white"
          } border ${
            isDark
              ? "border-slate-700"
              : "border-green-100"
          } rounded-3xl overflow-hidden max-h-[80%]`}
        >

          {/* SEARCH */}
          {activeField ===
            "variety" && (

            <View className="p-4">

              <TextInput
                value={searchQuery}
                onChangeText={
                  setSearchQuery
                }
                placeholder="Search apple varieties..."
                placeholderTextColor={
                  isDark
                    ? "#aaa"
                    : "#888"
                }
                className={`px-4 py-3 rounded-xl border ${
                  isDark
                    ? "bg-slate-800 text-white border-slate-700"
                    : "bg-white text-green-950 border-green-200"
                }`}
                style={{
                  fontFamily:
                    "Montserrat_500Medium",
                }}
              />

            </View>
          )}

          <ScrollView>

            {filteredOptions.map(
              (o) => {

                const isSelected =
                  activeField ===
                  "variety"
                    ? selectedVarieties.includes(
                        o
                      )
                    : tempValue === o;

                return (

                  <TouchableOpacity
                    key={o}
                    onPress={() =>
                      selectOption(o)
                    }
                    className={`flex-row items-center py-4 px-5 ${
                      isDark
                        ? "border-b border-slate-700"
                        : "border-b border-green-100"
                    }`}
                  >

                    {activeField ===
                      "variety" && (

                      <View
                        className={`w-5 h-5 mr-3 rounded border items-center justify-center ${
                          isSelected
                            ? "bg-green-600 border-green-600"
                            : isDark
                            ? "border-gray-500"
                            : "border-gray-400"
                        }`}
                      >

                        {isSelected && (
                          <Text className="text-white text-xs">
                            ✓
                          </Text>
                        )}

                      </View>
                    )}

                    <Text
                      style={{
                        fontFamily:
                          isSelected
                            ? "Montserrat_600SemiBold"
                            : "Montserrat_500Medium",
                      }}
                      className={`text-base ${
                        isSelected
                          ? "text-green-500"
                          : isDark
                          ? "text-white"
                          : "text-green-950"
                      }`}
                    >
                      {o}
                    </Text>

                  </TouchableOpacity>
                );
              }
            )}

          </ScrollView>

          {/* OK BUTTON */}
          <TouchableOpacity
            onPress={
              confirmSelection
            }
            disabled={isOkDisabled}
            className={`py-4 ${
              isOkDisabled
                ? isDark
                  ? "bg-slate-700"
                  : "bg-gray-300"
                : "bg-green-600"
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
