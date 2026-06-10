import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  useColorScheme,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";
import {
  ORCHARD_TYPE_OPTIONS,
  VARIETY_OPTIONS,
  SOIL_TYPE_OPTIONS,
  LAND_TYPE_OPTIONS,
} from "@/constants/orchardOptions";
import {
  DISTRICT_OPTIONS,
  getBlockOptions,
  getVillageOptions,
} from "@/constants/locationOptions";

const { height } = Dimensions.get("window");

// ─── Types ───────────────────────────────────────────────────────────────────

export type EditForm = {
  name: string;
  district: string;
  block: string;
  village: string;
  orchardType: string;
  variety: string;
  soilType: string;
  age: string;
  area: string;
  landType: string;
  image: string;
};

type DropdownFieldKey =
  | "orchardType"
  | "variety"
  | "soilType"
  | "landType"
  | "district"
  | "block"
  | "village";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATIC_DROPDOWN_OPTIONS: Record<string, string[]> = {
  orchardType: ORCHARD_TYPE_OPTIONS,
  variety: VARIETY_OPTIONS,
  soilType: SOIL_TYPE_OPTIONS,
  landType: LAND_TYPE_OPTIONS,
  district: DISTRICT_OPTIONS,
};

function getOptionsForField(
  field: DropdownFieldKey,
  form: EditForm,
): string[] {
  if (field === "block") return getBlockOptions(form.district);
  if (field === "village") return getVillageOptions(form.district, form.block);
  return STATIC_DROPDOWN_OPTIONS[field] ?? [];
}

function sanitizeDecimal(value: string) {
  let s = value.replace(/[^0-9.]/g, "");
  const i = s.indexOf(".");
  if (i !== -1) {
    s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, "");
  }
  return s.slice(0, 6);
}

function FieldLabel({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View className="flex-row items-center mb-1.5">
      <View className="w-7 h-7 rounded-full bg-surface-track dark:bg-slate-800 items-center justify-center mr-2.5">
        <Ionicons name={icon} size={14} color="#6D8B4F" />
      </View>
      <Text
        style={{ fontFamily: Fonts.semibold }}
        className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {label}
      </Text>
    </View>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EditOrchardModal({
  visible,
  editForm,
  setEditForm,
  onClose,
  onSave,
}: {
  visible: boolean;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  onClose: () => void;
  onSave: () => void;
}) {
  const isDark = useColorScheme() === "dark";

  const [activeDropdown, setActiveDropdown] =
    useState<DropdownFieldKey | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isVarietyPicker = activeDropdown === "variety";
  const dropdownOptions = activeDropdown
    ? getOptionsForField(activeDropdown, editForm)
    : [];
  const filteredOptions = isVarietyPicker
    ? dropdownOptions.filter((o) =>
        o.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : dropdownOptions;

  // ─── Dropdown lifecycle ─────────────────────────────────────────────

  const closeDropdown = () => {
    setActiveDropdown(null);
    setTempValue("");
    setSelectedVarieties([]);
    setSearchQuery("");
  };

  const openDropdown = (field: DropdownFieldKey) => {
    // Gate dependent fields
    if (field === "block" && !editForm.district) {
      Alert.alert("Select District", "Please select a district first.");
      return;
    }
    if (field === "village" && !editForm.block) {
      Alert.alert("Select Block", "Please select a block first.");
      return;
    }

    setActiveDropdown(field);
    setSearchQuery("");

    if (field === "variety") {
      setTempValue("");
      setSelectedVarieties(
        editForm.variety
          ? editForm.variety
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      );
      return;
    }

    // For location fields, pre-set tempValue
    if (field === "district") setTempValue(editForm.district || "");
    else if (field === "block") setTempValue(editForm.block || "");
    else if (field === "village") setTempValue(editForm.village || "");
    else if (field === "orchardType")
      setTempValue(editForm.orchardType || "");
    else if (field === "soilType") setTempValue(editForm.soilType || "");
    else if (field === "landType") setTempValue(editForm.landType || "");
    else setTempValue("");

    setSelectedVarieties([]);
  };

  const selectDropdownOption = (value: string) => {
    if (isVarietyPicker) {
      setSelectedVarieties((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
      return;
    }
    setTempValue(value);
  };

  const confirmDropdownSelection = () => {
    if (!activeDropdown) return;

    if (activeDropdown === "variety") {
      setEditForm((prev) => ({
        ...prev,
        variety: selectedVarieties.join(", "),
      }));
    } else if (activeDropdown === "district") {
      setEditForm((prev) => ({
        ...prev,
        district: tempValue,
        block: "",
        village: "",
      }));
    } else if (activeDropdown === "block") {
      setEditForm((prev) => ({
        ...prev,
        block: tempValue,
        village: "",
      }));
    } else if (activeDropdown === "village") {
      setEditForm((prev) => ({ ...prev, village: tempValue }));
    } else if (activeDropdown === "orchardType") {
      setEditForm((prev) => ({ ...prev, orchardType: tempValue }));
    } else if (activeDropdown === "soilType") {
      setEditForm((prev) => ({ ...prev, soilType: tempValue }));
    } else if (activeDropdown === "landType") {
      setEditForm((prev) => ({ ...prev, landType: tempValue }));
    }

    closeDropdown();
  };

  const closeAll = () => {
    closeDropdown();
    onClose();
  };

  const saveAndCloseDropdown = () => {
    closeDropdown();
    onSave();
  };

  const isDropdownOkDisabled = isVarietyPicker
    ? selectedVarieties.length === 0
    : !tempValue;

  // ─── Image picker ───────────────────────────────────────────────────

  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!res.canceled && res.assets?.length > 0) {
      setEditForm((prev) => ({ ...prev, image: res.assets[0].uri }));
    }
  };

  // ─── Themed styles ──────────────────────────────────────────────────

  const inputCls = isDark
    ? "bg-slate-800 border-slate-700 text-white"
    : "bg-white border-edge-green text-brand-text";

  const dropdownCls = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-edge-green";

  const pickerTitle = (() => {
    if (!activeDropdown) return "";
    const titles: Record<string, string> = {
      orchardType: "Select Crop Type",
      variety: "Select Variety",
      soilType: "Select Soil Type",
      landType: "Select Land Type",
      district: "Select District",
      block: "Select Block",
      village: "Select Village",
    };
    return titles[activeDropdown] ?? "";
  })();

  // ─── Picker view ────────────────────────────────────────────────────

  const renderPicker = () => {
    if (!activeDropdown) return null;

    return (
      <View style={{ maxHeight: height * 0.72 }}>
        {/* Picker header */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={closeDropdown}
            activeOpacity={0.85}
            className={`w-9 h-9 rounded-full items-center justify-center ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={isDark ? "#fff" : "#33422A"}
            />
          </TouchableOpacity>

          <Text
            style={{ fontFamily: Fonts.bold }}
            className={`text-lg ${isDark ? "text-white" : "text-brand-text"}`}
          >
            {pickerTitle}
          </Text>

          <View className="w-9" />
        </View>

        {/* Search (variety only) */}
        {isVarietyPicker && (
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search apple varieties..."
            placeholderTextColor={isDark ? "#94a3b8" : "#8BA862"}
            style={{ fontFamily: Fonts.medium }}
            className={`mb-3 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-edge-green text-brand-text"
            }`}
          />
        )}

        {/* Options list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {filteredOptions.map((option) => {
            const selected = isVarietyPicker
              ? selectedVarieties.includes(option)
              : tempValue === option;

            return (
              <TouchableOpacity
                key={option}
                onPress={() => selectDropdownOption(option)}
                activeOpacity={0.85}
                className={`flex-row items-center rounded-2xl border px-4 py-3 mb-2 ${
                  selected
                    ? isDark
                      ? "bg-slate-800 border-brand-green-dark"
                      : "bg-surface-track border-brand-green"
                    : isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-edge-green"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-md border items-center justify-center mr-3 ${
                    selected
                      ? "bg-brand-green border-brand-green"
                      : isDark
                      ? "border-slate-500"
                      : "border-edge-green-soft"
                  }`}
                >
                  {selected && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>

                <Text
                  style={{
                    fontFamily: selected ? Fonts.semibold : Fonts.medium,
                  }}
                  className={`flex-1 text-sm ${
                    isDark ? "text-white" : "text-brand-text"
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Action row */}
        <View className="flex-row mt-2">
          <TouchableOpacity
            onPress={closeDropdown}
            activeOpacity={0.85}
            className={`flex-1 rounded-2xl py-4 items-center justify-center border mr-3 ${
              isDark
                ? "border-slate-700 bg-slate-800"
                : "border-edge-green bg-white"
            }`}
          >
            <Text
              style={{ fontFamily: Fonts.semibold }}
              className={`text-sm ${
                isDark ? "text-slate-200" : "text-brand-text"
              }`}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={confirmDropdownSelection}
            disabled={isDropdownOkDisabled}
            activeOpacity={0.85}
            className={`flex-1 rounded-2xl py-4 items-center justify-center ${
              isDropdownOkDisabled
                ? isDark
                  ? "bg-slate-700"
                  : "bg-gray-300"
                : isDark
                ? "bg-brand-green-dark"
                : "bg-brand-green"
            }`}
          >
            <Text
              style={{ fontFamily: Fonts.bold }}
              className="text-white text-sm tracking-wide"
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ─── Form view ──────────────────────────────────────────────────────

  const renderEditForm = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 8 }}
    >
      {/* ── Section: Basic Info ─────────────────────────────────── */}

      {/* Orchard Name */}
      <View className="mb-3.5">
        <FieldLabel icon="leaf-outline" label="Orchard Name" />
        <TextInput
          value={editForm.name}
          onChangeText={(text) =>
            setEditForm((prev) => ({ ...prev, name: text }))
          }
          placeholder="e.g. Valley Orchard"
          placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
          style={{ fontFamily: Fonts.medium }}
          className={`rounded-2xl border px-4 py-3.5 text-sm ${inputCls}`}
        />
      </View>

      {/* District */}
      <View className="mb-3.5">
        <FieldLabel icon="location-outline" label="District" />
        <TouchableOpacity
          onPress={() => openDropdown("district")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${dropdownCls}`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={1}
            className={`text-sm flex-1 pr-3 ${
              editForm.district
                ? isDark
                  ? "text-white"
                  : "text-brand-text"
                : "text-slate-400"
            }`}
          >
            {editForm.district || "Select District"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={isDark ? "#cbd5e1" : "#6D8B4F"}
          />
        </TouchableOpacity>
      </View>

      {/* Block */}
      <View className="mb-3.5">
        <FieldLabel icon="map-outline" label="Block" />
        <TouchableOpacity
          onPress={() => openDropdown("block")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${dropdownCls}`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={1}
            className={`text-sm flex-1 pr-3 ${
              editForm.block
                ? isDark
                  ? "text-white"
                  : "text-brand-text"
                : "text-slate-400"
            }`}
          >
            {editForm.block || "Select Block"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={isDark ? "#cbd5e1" : "#6D8B4F"}
          />
        </TouchableOpacity>
      </View>

      {/* Village */}
      <View className="mb-3.5">
        <FieldLabel icon="home-outline" label="Village" />
        <TouchableOpacity
          onPress={() => openDropdown("village")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${dropdownCls}`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={1}
            className={`text-sm flex-1 pr-3 ${
              editForm.village
                ? isDark
                  ? "text-white"
                  : "text-brand-text"
                : "text-slate-400"
            }`}
          >
            {editForm.village || "Select Village"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={isDark ? "#cbd5e1" : "#6D8B4F"}
          />
        </TouchableOpacity>
      </View>

      {/* ── Section: Orchard Details ────────────────────────────── */}

      {/* Crop Type */}
      <View className="mb-3.5">
        <FieldLabel icon="basket-outline" label="Crop Type" />
        <TouchableOpacity
          onPress={() => openDropdown("orchardType")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${dropdownCls}`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={1}
            className={`text-sm flex-1 pr-3 ${
              editForm.orchardType
                ? isDark
                  ? "text-white"
                  : "text-brand-text"
                : "text-slate-400"
            }`}
          >
            {editForm.orchardType || "Select Crop Type"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={isDark ? "#cbd5e1" : "#6D8B4F"}
          />
        </TouchableOpacity>
      </View>

      {/* Variety */}
      <View className="mb-3.5">
        <FieldLabel icon="git-branch-outline" label="Variety" />
        <TouchableOpacity
          onPress={() => openDropdown("variety")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${dropdownCls}`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={2}
            className={`text-sm flex-1 pr-3 ${
              editForm.variety
                ? isDark
                  ? "text-white"
                  : "text-brand-text"
                : "text-slate-400"
            }`}
          >
            {editForm.variety || "Select Apple Variety"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={isDark ? "#cbd5e1" : "#6D8B4F"}
          />
        </TouchableOpacity>
      </View>

      {/* Soil Type */}
      <View className="mb-3.5">
        <FieldLabel icon="water-outline" label="Soil Type" />
        <TouchableOpacity
          onPress={() => openDropdown("soilType")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${dropdownCls}`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={1}
            className={`text-sm flex-1 pr-3 ${
              editForm.soilType
                ? isDark
                  ? "text-white"
                  : "text-brand-text"
                : "text-slate-400"
            }`}
          >
            {editForm.soilType || "Select Soil Type"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={isDark ? "#cbd5e1" : "#6D8B4F"}
          />
        </TouchableOpacity>
      </View>

      {/* Age */}
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
            value={editForm.age}
            onChangeText={(text) =>
              setEditForm((prev) => ({
                ...prev,
                age: text.replace(/[^0-9]/g, "").slice(0, 3),
              }))
            }
            placeholder="Enter orchard age"
            placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
            keyboardType="numeric"
            maxLength={3}
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
            {editForm.age && Number(editForm.age) === 1 ? "year" : "years"}
          </Text>
        </View>
      </View>

      {/* ── Section: Area & Photo ───────────────────────────────── */}

      {/* Area */}
      <View style={{ marginBottom: 14 }}>
        <FieldLabel icon="resize-outline" label="Area in Kanals" />
        <TextInput
          value={editForm.area}
          onChangeText={(text) =>
            setEditForm((prev) => ({
              ...prev,
              area: sanitizeDecimal(text),
            }))
          }
          placeholder="e.g. 2.22"
          placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
          keyboardType="decimal-pad"
          maxLength={6}
          editable
          style={{
            fontFamily: undefined,
            fontSize: 14,
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderWidth: 1,
            borderColor: isDark ? "#334155" : "#8BA862",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: isDark ? "#f1f5f9" : "#33422A",
            includeFontPadding: false,
          }}
        />
      </View>

      {/* Land Type */}
      <View className="mb-3.5">
        <FieldLabel icon="terrain-outline" label="Land Type" />
        <TouchableOpacity
          onPress={() => openDropdown("landType")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3.5 flex-row items-center justify-between ${dropdownCls}`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={1}
            className={`text-sm flex-1 pr-3 ${
              editForm.landType
                ? isDark
                  ? "text-white"
                  : "text-brand-text"
                : "text-slate-400"
            }`}
          >
            {editForm.landType || "Select Land Type"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={isDark ? "#cbd5e1" : "#6D8B4F"}
          />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <View className="mb-3.5">
        <FieldLabel icon="camera-outline" label="Orchard Photo" />
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.85}
          className={`h-40 rounded-2xl border overflow-hidden items-center justify-center ${dropdownCls}`}
        >
          {editForm.image ? (
            <Image source={{ uri: editForm.image }} className="w-full h-full" />
          ) : (
            <>
              <Ionicons name="camera-outline" size={32} color="#94a3b8" />
              <Text
                style={{ fontFamily: Fonts.medium }}
                className="text-slate-400 text-sm mt-2"
              >
                Tap to upload orchard image
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Action Buttons ──────────────────────────────────────── */}

      <View className="flex-row mt-2">
        <TouchableOpacity
          onPress={closeAll}
          activeOpacity={0.8}
          className={`flex-1 rounded-2xl py-4 items-center justify-center border mr-3 ${
            isDark
              ? "border-slate-700 bg-slate-800"
              : "border-edge-green bg-white"
          }`}
        >
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className={`text-sm ${
              isDark ? "text-slate-200" : "text-brand-text"
            }`}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveAndCloseDropdown}
          activeOpacity={0.85}
          className={`flex-1 rounded-2xl py-4 items-center justify-center ${
            isDark ? "bg-brand-green-dark" : "bg-brand-green"
          }`}
        >
          <Text
            style={{ fontFamily: Fonts.bold }}
            className="text-white text-sm tracking-wide"
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={closeAll}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      >
        <View
          className={`rounded-t-[28px] px-5 pt-4 pb-8 ${
            isDark ? "bg-slate-900" : "bg-surface-light"
          }`}
          style={{ maxHeight: height * 0.9 }}
        >
          {/* Grabber */}
          <View className="items-center mb-3">
            <View
              className={`w-12 h-1.5 rounded-full ${
                isDark ? "bg-slate-700" : "bg-edge-green-soft"
              }`}
            />
          </View>

          {!activeDropdown && (
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-full bg-surface-track dark:bg-slate-800 items-center justify-center mr-3">
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color="#6D8B4F"
                  />
                </View>
                <Text
                  style={{ fontFamily: Fonts.bold }}
                  className={`text-lg ${
                    isDark ? "text-white" : "text-brand-text"
                  }`}
                >
                  Edit Orchard Info
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeAll}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  isDark ? "bg-slate-800" : "bg-white"
                }`}
              >
                <Ionicons
                  name="close"
                  size={18}
                  color={isDark ? "#fff" : "#33422A"}
                />
              </TouchableOpacity>
            </View>
          )}

          {activeDropdown ? renderPicker() : renderEditForm()}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
