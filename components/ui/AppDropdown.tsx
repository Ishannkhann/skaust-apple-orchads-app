import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Modal from "react-native-modal";

type Props = {
  label: string;

  value: string;

  placeholder: string;

  options: string[];

  visible: boolean;

  isDark: boolean;

  onOpen: () => void;

  onClose: () => void;

  onSelect: (value: string) => void;
};

export default function AppDropdown({
  label,
  value,
  placeholder,
  options,
  visible,
  isDark,
  onOpen,
  onClose,
  onSelect,
}: Props) {
  return (
    <View className="mt-6">

      <Text
        className={`mb-2 font-medium ${
          isDark
            ? "text-white"
            : "text-green-950"
        }`}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={onOpen}
        activeOpacity={0.85}
        className={`px-5 py-4 rounded-2xl border ${
          isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-green-100"
        }`}
      >
        <Text
          className={
            value
              ? isDark
                ? "text-white"
                : "text-black"
              : "text-gray-400"
          }
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
      >
        <View
          className={`rounded-3xl p-4 max-h-[70%] ${
            isDark
              ? "bg-slate-900"
              : "bg-white"
          }`}
        >

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >

            {options.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() =>
                  onSelect(item)
                }
                className="py-4 border-b border-gray-100 dark:border-slate-700"
              >
                <Text
                  className={`text-base ${
                    isDark
                      ? "text-white"
                      : "text-green-950"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

          </ScrollView>

        </View>
      </Modal>

    </View>
  );
}
