import React from "react";

import { View, Text, TouchableOpacity, ScrollView, TextInput, useColorScheme } from "react-native";

import Modal from "react-native-modal";

import { Fonts } from "@/theme/fonts";

/**
 * Reusable selection modal for the add-orchard steps.
 *
 * Supports two modes (preserving the previous inline behavior):
 *  - multiSelect=false (default): single-select list; tapping sets `tempValue`
 *    via onSelect, OK confirms. Used for Orchard Type / Soil Type / Land Type.
 *  - multiSelect=true: checkbox multi-select with a search box. Used for the
 *    Apple Variety picker.
 */
export default function SelectModal({
  visible,
  onClose,
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

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{
        justifyContent: "center",
        margin: 20,
      }}
    >
      <View
        className={`${
          isDark ? "bg-slate-900" : "bg-white"
        } border ${
          isDark ? "border-slate-700" : "border-edge-green"
        } rounded-3xl overflow-hidden max-h-[80%]`}
      >
        {/* SEARCH */}
        {searchable && (
          <View className="p-4">
            <TextInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search apple varieties..."
              placeholderTextColor={isDark ? "#aaa" : "#888"}
              className={`px-4 py-3 rounded-xl border ${
                isDark
                  ? "bg-slate-800 text-white border-slate-700"
                  : "bg-white text-brand-text border-edge-green"
              }`}
              style={{ fontFamily: Fonts.medium }}
            />
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((o) => {
            const isSelected = multiSelect
              ? selectedValues.includes(o)
              : tempValue === o;

            return (
              <TouchableOpacity
                key={o}
                onPress={() => onSelect(o)}
                className={`flex-row items-center py-4 px-5 ${
                  isDark
                    ? "border-b border-slate-700"
                    : "border-b border-edge-green"
                }`}
              >
                {multiSelect && (
                  <View
                    className={`w-5 h-5 mr-3 rounded border items-center justify-center ${
                      isSelected
                        ? "bg-brand-green border-brand-green"
                        : isDark
                        ? "border-gray-500"
                        : "border-gray-400"
                    }`}
                  >
                    {isSelected && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                )}

                <Text
                  style={{
                    fontFamily: isSelected ? Fonts.semibold : Fonts.medium,
                  }}
                  className={`text-base ${
                    isSelected
                      ? "text-brand-green"
                      : isDark
                      ? "text-white"
                      : "text-brand-text"
                  }`}
                >
                  {o}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* OK BUTTON */}
        <TouchableOpacity
          onPress={onConfirm}
          disabled={okDisabled}
          className={`py-4 ${
            okDisabled
              ? isDark
                ? "bg-slate-700"
                : "bg-gray-300"
              : "bg-brand-green"
          }`}
        >
          <Text
            style={{ fontFamily: Fonts.semibold }}
            className="text-center text-white"
          >
            OK
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
