import React, { useRef, useState } from "react";

import { View, FlatList, TouchableOpacity, Text, useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useOrchards } from "@/hooks/useOrchards";
import { removeItem, StorageKeys } from "@/lib/storage";

import MyOrchardsHeader from "@/components/orchard/MyOrchardsHeader";
import OrchardSearchBar from "@/components/orchard/OrchardSearchBar";
import FilterDropdown from "@/components/orchard/FilterDropdown";
import MyOrchardCard from "@/components/orchard/MyOrchardCard";
import EmptyOrchardsList from "@/components/orchard/EmptyOrchardsList";

export default function MyOrchardsScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const isNavigatingRef = useRef(false);

  const { orchards } = useOrchards({ sanitize: true });

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Unique orchard types for filter chips (orchardType is a single value).
  const cropTypes = [
    "All",
    ...Array.from(
      new Set(orchards.map((o) => o.orchardType).filter(Boolean) as string[])
    ),
  ];

  // Filter + search (guard against incomplete orchard objects).
  const filtered = orchards.filter((o) => {
    if (!o?.id || !o?.name) return false;
    const matchesFilter = activeFilter === "All" || o.orchardType === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      (o.name ?? "").toLowerCase().includes(q) ||
      (o.variety ?? "").toLowerCase().includes(q) ||
      (o.orchardType ?? "").toLowerCase().includes(q) ||
      (o.landType ?? "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const addNewOrchard = async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    await removeItem(StorageKeys.editingOrchard);
    await removeItem(StorageKeys.newOrchard);
    router.push("/orchard/add-step-1");
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-surface-light"}`}
      edges={["bottom"]}
    >
      {/* ── Header ── */}
      <MyOrchardsHeader count={filtered.length} onBack={() => router.back()} />

      {/* ── Search ── */}
      <OrchardSearchBar value={search} onChange={setSearch} />

      {/* ── Filter dropdown ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, zIndex: 10 }}>
        <FilterDropdown
          options={cropTypes}
          active={activeFilter}
          onSelect={setActiveFilter}
        />
      </View>

      {/* ── Card Grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 120, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MyOrchardCard
            item={item}
            onPress={() => router.push(`/orchard/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyOrchardsList isFiltered={!!search || activeFilter !== "All"} />
        }
      />

      {/* ── Add FAB ── */}
      <View className="absolute bottom-8 left-5 right-5">
        <TouchableOpacity
          onPress={addNewOrchard}
          activeOpacity={0.85}
          className="bg-brand-green rounded-2xl py-4 flex-row items-center justify-center gap-2"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold text-base">
            Add new orchard
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
