import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

import { Fonts } from "@/theme/fonts";

/**
 * Reusable selection modal — styled identically to the EditOrchardModal picker.
 *
 * - Header with back button + title
 * - Optional search bar
 * - Rounded option cards with checkboxes (single- or multi-select)
 * - Cancel / OK action row
 */
export default function SelectModal({
  visible,
  onClose,
  title = "Select",
  searchPlaceholder = "Search...",
  options,
  multiSelect = false,
  searchable = false,
  searchQuery = "",
  onSearchChange,
  selectedValues = [],
  tempValue = "",
  onSelect,
  onConfirm,
  okDisabled,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  searchPlaceholder?: string;
  options: string[];
  multiSelect?: boolean;
  searchable?: boolean;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  selectedValues?: string[];
  tempValue?: string;
  onSelect: (value: string) => void;
  onConfirm: () => void;
  okDisabled: boolean;
}) {
  const isDark = useColorScheme() === "dark";

  const bgCls = isDark ? "bg-slate-900" : "bg-surface-light";
  const borderCls = isDark ? "border-slate-700" : "border-edge-green";

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View
        className={`${bgCls} rounded-t-[28px] px-5 pt-4 pb-8`}
      >
        {/* ── Grabber ── */}
        <View className="items-center mb-3">
          <View
            className={`w-12 h-1.5 rounded-full ${
              isDark ? "bg-slate-700" : "bg-edge-green-soft"
            }`}
          />
        </View>

        {/* ── Header ── */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={onClose}
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
            {title}
          </Text>

          <View className="w-9" />
        </View>

        {/* ── Search ── */}
        {searchable && (
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={isDark ? "#94a3b8" : "#8BA862"}
            style={{ fontFamily: Fonts.medium }}
            className={`mb-3 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-edge-green text-brand-text"
            }`}
          />
        )}

        {/* ── Options ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          style={{ maxHeight: 400 }}
        >
          {options.map((option) => {
            const selected = multiSelect
              ? selectedValues.includes(option)
              : tempValue === option;

            return (
              <TouchableOpacity
                key={option}
                onPress={() => onSelect(option)}
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
                {/* Checkbox */}
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

                {/* Label */}
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

        {/* ── Action row ── */}
        <View className="flex-row mt-2">
          <TouchableOpacity
            onPress={onClose}
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
            onPress={onConfirm}
            disabled={okDisabled}
            activeOpacity={0.85}
            className={`flex-1 rounded-2xl py-4 items-center justify-center ${
              okDisabled
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
    </Modal>
  );
}
