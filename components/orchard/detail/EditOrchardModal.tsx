import React from "react";

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

const { height } = Dimensions.get("window");

type EditForm = {
  name: string;
  orchardType: string;
  variety: string;
  area: string;
  location: string;
  message: string;
};

const FIELDS = [
  { key: "name", label: "Orchard Name", icon: "leaf-outline", placeholder: "e.g. Valley Orchard", multiline: false },
  { key: "orchardType", label: "Crop Type", icon: "basket-outline", placeholder: "e.g. Apple Orchard", multiline: false },
  { key: "variety", label: "Variety", icon: "git-branch-outline", placeholder: "e.g. Honeycrisp, Gala", multiline: false },
  { key: "area", label: "Total Area", icon: "resize-outline", placeholder: "e.g. 14.5 Acres", multiline: false },
  { key: "location", label: "Location", icon: "location-outline", placeholder: "e.g. Nishat, Srinagar", multiline: false },
] as const;

/**
 * Bottom-sheet modal to edit orchard specs. Markup/classes copied verbatim
 * from the screen (controlled form via editForm + setEditForm).
 */
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      >
        <View
          className={`rounded-t-[28px] px-5 pt-4 pb-8 ${
            isDark ? "bg-slate-900" : "bg-[#f4fbf0]"
          }`}
          style={{ maxHeight: height * 0.9 }}
        >
          {/* Grabber */}
          <View className="items-center mb-3">
            <View
              className={`w-12 h-1.5 rounded-full ${
                isDark ? "bg-slate-700" : "bg-[#c5d6bb]"
              }`}
            />
          </View>

          {/* Modal Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-3">
                <Ionicons name="create-outline" size={18} color="#469e80" />
              </View>
              <Text
                style={{ fontFamily: Fonts.bold }}
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-[#1b3d2f]"
                }`}
              >
                Edit Orchard Info
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className={`w-9 h-9 rounded-full items-center justify-center ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
            >
              <Ionicons name="close" size={18} color={isDark ? "#fff" : "#243022"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {/* Field renderer */}
            {FIELDS.map((field) => (
              <View key={field.key} className="mb-3.5">
                <View className="flex-row items-center mb-1.5">
                  <View className="w-7 h-7 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-2.5">
                    <Ionicons name={field.icon as any} size={14} color="#469e80" />
                  </View>
                  <Text
                    style={{ fontFamily: Fonts.semibold }}
                    className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {field.label}
                  </Text>
                </View>
                <TextInput
                  value={(editForm as any)[field.key]}
                  onChangeText={(t) =>
                    setEditForm((prev) => ({ ...prev, [field.key]: t }))
                  }
                  placeholder={field.placeholder}
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  multiline={field.multiline}
                  textAlignVertical={field.multiline ? "top" : "center"}
                  style={{ fontFamily: Fonts.medium }}
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    field.multiline ? "min-h-[88px]" : ""
                  } ${
                    isDark
                      ? "bg-slate-800/60 border-slate-700 text-slate-100"
                      : "bg-white border-[#e2f0d9] text-slate-800"
                  }`}
                />
              </View>
            ))}

            {/* Action Buttons */}
            <View className="flex-row mt-2" style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.8}
                className={`flex-1 rounded-2xl py-4 items-center justify-center border ${
                  isDark ? "border-slate-700 bg-slate-800" : "border-[#e2f0d9] bg-white"
                }`}
              >
                <Text
                  style={{ fontFamily: Fonts.semibold }}
                  className={`text-sm ${isDark ? "text-slate-200" : "text-[#1b3d2f]"}`}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSave}
                activeOpacity={0.85}
                className="flex-1 rounded-2xl py-4 items-center justify-center bg-emerald-600"
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
