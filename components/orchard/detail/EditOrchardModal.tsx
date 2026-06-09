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
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Fonts } from "@/theme/fonts";
import { ORCHARD_TYPE_OPTIONS, VARIETY_OPTIONS } from "@/constants/orchardOptions";

const { height } = Dimensions.get("window");

type EditForm = {
  name: string;
  orchardType: string;
  variety: string;
  area: string;
  location: string;
  message: string;
};

type DropdownFieldKey = "orchardType" | "variety";

const DROPDOWN_OPTIONS: Record<DropdownFieldKey, string[]> = {
  orchardType: ORCHARD_TYPE_OPTIONS,
  variety: VARIETY_OPTIONS,
};

const TEXT_FIELDS = [
  {
    key: "area",
    label: "Total Area",
    icon: "resize-outline",
    placeholder: "e.g. 2.22",
  },
  {
    key: "location",
    label: "Location",
    icon: "location-outline",
    placeholder: "e.g. Nishat, Srinagar",
  },
] as const;

const sanitizeAreaValue = (value: string) => {
  let sanitized = value.replace(/[^0-9.]/g, "");
  const firstDotIndex = sanitized.indexOf(".");

  if (firstDotIndex !== -1) {
    sanitized =
      sanitized.slice(0, firstDotIndex + 1) +
      sanitized.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  return sanitized.slice(0, 4);
};

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

  const [activeDropdown, setActiveDropdown] = useState<DropdownFieldKey | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isVarietyPicker = activeDropdown === "variety";
  const dropdownOptions = activeDropdown ? DROPDOWN_OPTIONS[activeDropdown] : [];
  const filteredOptions = isVarietyPicker
    ? dropdownOptions.filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dropdownOptions;

  const closeDropdown = () => {
    setActiveDropdown(null);
    setTempValue("");
    setSelectedVarieties([]);
    setSearchQuery("");
  };

  const openDropdown = (field: DropdownFieldKey) => {
    setActiveDropdown(field);
    setSearchQuery("");

    if (field === "variety") {
      setTempValue("");
      setSelectedVarieties(
        editForm.variety
          ? editForm.variety
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : []
      );
      return;
    }

    setTempValue(editForm.orchardType || "");
    setSelectedVarieties([]);
  };

  const selectDropdownOption = (value: string) => {
    if (isVarietyPicker) {
      setSelectedVarieties((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
      return;
    }

    setTempValue(value);
  };

  const confirmDropdownSelection = () => {
    if (activeDropdown === "variety") {
      setEditForm((prev) => ({
        ...prev,
        variety: selectedVarieties.join(", "),
      }));
    }

    if (activeDropdown === "orchardType") {
      setEditForm((prev) => ({ ...prev, orchardType: tempValue }));
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

  const renderPicker = () => {
    if (!activeDropdown) return null;

    return (
      <View style={{ maxHeight: height * 0.72 }}>
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
            {isVarietyPicker ? "Select Variety" : "Select Crop Type"}
          </Text>

          <View className="w-9" />
        </View>

        {isVarietyPicker && (
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search apple varieties..."
            placeholderTextColor={isDark ? "#94a3b8" : "#8BA862"}
            style={{ fontFamily: Fonts.medium }}
            className={`mb-3 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "bg-slate-800/60 border-slate-700 text-slate-100"
                : "bg-white border-edge-green text-brand-text"
            }`}
          />
        )}

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
                    ? "bg-slate-800/60 border-slate-700"
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

        <View className="flex-row mt-2">
          <TouchableOpacity
            onPress={closeDropdown}
            activeOpacity={0.85}
            className={`flex-1 rounded-2xl py-4 items-center justify-center border mr-3 ${
              isDark ? "border-slate-700 bg-slate-800" : "border-edge-green bg-white"
            }`}
          >
            <Text
              style={{ fontFamily: Fonts.semibold }}
              className={`text-sm ${isDark ? "text-slate-200" : "text-brand-text"}`}
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

  const renderEditForm = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 8 }}
    >
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
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isDark
              ? "bg-slate-800/60 border-slate-700 text-slate-100"
              : "bg-white border-edge-green text-brand-text"
          }`}
        />
      </View>

      {/* Crop Type Dropdown */}
      <View className="mb-3.5">
        <FieldLabel icon="basket-outline" label="Crop Type" />
        <TouchableOpacity
          onPress={() => openDropdown("orchardType")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3 flex-row items-center justify-between ${
            isDark
              ? "bg-slate-800/60 border-slate-700"
              : "bg-white border-edge-green"
          }`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            className={`text-sm flex-1 pr-3 ${
              editForm.orchardType
                ? isDark
                  ? "text-slate-100"
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

      {/* Variety Dropdown */}
      <View className="mb-3.5">
        <FieldLabel icon="git-branch-outline" label="Variety" />
        <TouchableOpacity
          onPress={() => openDropdown("variety")}
          activeOpacity={0.85}
          className={`rounded-2xl border px-4 py-3 flex-row items-center justify-between ${
            isDark
              ? "bg-slate-800/60 border-slate-700"
              : "bg-white border-edge-green"
          }`}
        >
          <Text
            style={{ fontFamily: Fonts.medium }}
            numberOfLines={2}
            className={`text-sm flex-1 pr-3 ${
              editForm.variety
                ? isDark
                  ? "text-slate-100"
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

      {/* Area + Location */}
      {TEXT_FIELDS.map((field) => (
        <View key={field.key} className="mb-3.5">
          <FieldLabel icon={field.icon} label={field.label} />
          <TextInput
            value={editForm[field.key]}
            onChangeText={(text) =>
              setEditForm((prev) => ({
                ...prev,
                [field.key]:
                  field.key === "area" ? sanitizeAreaValue(text) : text,
              }))
            }
            placeholder={field.placeholder}
            placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
            keyboardType={field.key === "area" ? "decimal-pad" : "default"}
            maxLength={field.key === "area" ? 4 : undefined}
            style={{ fontFamily: Fonts.medium }}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "bg-slate-800/60 border-slate-700 text-slate-100"
                : "bg-white border-edge-green text-brand-text"
            }`}
          />
        </View>
      ))}

      {/* Action Buttons */}
      <View className="flex-row mt-2">
        <TouchableOpacity
          onPress={closeAll}
          activeOpacity={0.8}
          className={`flex-1 rounded-2xl py-4 items-center justify-center border mr-3 ${
            isDark ? "border-slate-700 bg-slate-800" : "border-edge-green bg-white"
          }`}
        >
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className={`text-sm ${isDark ? "text-slate-200" : "text-brand-text"}`}
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
                  <Ionicons name="create-outline" size={18} color="#6D8B4F" />
                </View>
                <Text
                  style={{ fontFamily: Fonts.bold }}
                  className={`text-lg font-bold ${
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
