import React, { useCallback, useState, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import * as ExpoLocation from "expo-location";
import MapView, { Marker, type Region } from "react-native-maps";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useOrchardDraft } from "@/hooks/useOrchardDraft";
import {
  LOCATION_MAP,
  DISTRICT_OPTIONS,
  DISTRICT_COORDS,
  getBlockOptions,
  getVillageOptions,
} from "@/constants/locationOptions";
import { Fonts } from "@/theme/fonts";
import StepHeader from "@/components/orchard/form/StepHeader";
import FormField from "@/components/orchard/form/FormField";
import DropdownField from "@/components/orchard/form/DropdownField";
import PrimaryButton from "@/components/orchard/form/PrimaryButton";
import SelectModal from "@/components/orchard/form/SelectModal";

// ─── Types ───────────────────────────────────────────────────────────────────

type LocationField = "district" | "block" | "village";
type Coords = { latitude: number; longitude: number };

type MatchedLocation = {
  district: string;
  block: string;
  village: string;
  confidence: "village" | "block" | "district";
};

// ─── Constants ───────────────────────────────────────────────────────────────

const KASHMIR_REGION: Region = {
  latitude: 34.0837,
  longitude: 74.7973,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
};

// ─── Reverse-geocode matching helpers ────────────────────────────────────────

function normalizeLocationName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function buildAddressCandidates(
  address: Record<string, string | null | undefined>,
) {
  const rawValues = Object.values(address)
    .filter(
      (v): v is string => typeof v === "string" && v.trim().length > 0,
    )
    .flatMap((v) => [v, ...v.split(","), ...v.split("/"), ...v.split("-")]);

  return rawValues
    .map(normalizeLocationName)
    .filter((v) => v.length > 0);
}

function candidateMatches(candidates: string[], option: string) {
  const norm = normalizeLocationName(option);
  if (!norm) return false;

  return candidates.some((c) => {
    if (c === norm) return true;
    if (norm.length >= 4 && c.includes(norm)) return true;
    if (c.length >= 4 && norm.includes(c)) return true;
    return false;
  });
}

function matchAddressToLocationOptions(
  address: Record<string, string | null | undefined>,
): MatchedLocation | null {
  const candidates = buildAddressCandidates(address);
  if (candidates.length === 0) return null;

  let districtOnlyMatch: MatchedLocation | null = null;
  let blockMatch: MatchedLocation | null = null;

  for (const district of DISTRICT_OPTIONS) {
    const districtHit = candidateMatches(candidates, district);
    const blocks = LOCATION_MAP[district];
    if (!blocks) continue;

    if (districtHit && !districtOnlyMatch) {
      districtOnlyMatch = {
        district,
        block: "",
        village: "",
        confidence: "district",
      };
    }

    for (const block of Object.keys(blocks)) {
      const blockHit = candidateMatches(candidates, block);

      if ((districtHit || blockHit) && blockHit && !blockMatch) {
        blockMatch = {
          district,
          block,
          village: "",
          confidence: "block",
        };
      }

      for (const village of blocks[block]) {
        if (candidateMatches(candidates, village)) {
          return { district, block, village, confidence: "village" };
        }
      }
    }
  }

  return blockMatch ?? districtOnlyMatch;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AddStep1() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const { loadDraft, saveStep } = useOrchardDraft();

  // Form state
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");

  // Map state
  const mapRef = useRef<MapView>(null);
  const [marker, setMarker] = useState<Coords | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Dropdown modal state
  const [activeDropdown, setActiveDropdown] = useState<LocationField | null>(
    null,
  );
  const [tempValue, setTempValue] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // Draft hydration guard
  const hasLoadedRef = useRef(false);

  // ─── Derived data ──────────────────────────────────────────────────

  const blockOptions = getBlockOptions(district);
  const villageOptions = getVillageOptions(district, block);

  const dropdownOptions = (() => {
    if (activeDropdown === "district") return DISTRICT_OPTIONS;
    if (activeDropdown === "block") return blockOptions;
    if (activeDropdown === "village") return villageOptions;
    return [];
  })();

  const filteredDropdownOptions = locationSearch.trim()
    ? dropdownOptions.filter((o) =>
        o.toLowerCase().includes(locationSearch.trim().toLowerCase()),
      )
    : dropdownOptions;

  // ─── Load draft on focus ──────────────────────────────────────────

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const { data } = await loadDraft();

        if (data) {
          setName(data.name || "");
          setDistrict(data.district || "");
          setBlock(data.block || "");
          setVillage(data.village || "");

          if (data.latitude && data.longitude) {
            const c = {
              latitude: Number(data.latitude),
              longitude: Number(data.longitude),
            };
            setMarker(c);
            mapRef.current?.animateCamera(
              { center: c, zoom: 12 },
              { duration: 500 },
            );
          }

          hasLoadedRef.current = true;
          return;
        }

        if (!hasLoadedRef.current) {
          setName("");
          setDistrict("");
          setBlock("");
          setVillage("");
          setMarker(null);
          hasLoadedRef.current = true;
        }
      };

      loadData();
    }, []),
  );

  // ─── Map interaction ──────────────────────────────────────────────

  const reverseGeocodeAndMatch = async (coords: Coords) => {
    try {
      const [address] = await ExpoLocation.reverseGeocodeAsync(coords);

      if (!address) {
        Alert.alert(
          "Address Not Found",
          "Could not convert map coordinates to an address. Please select district, block, and village manually.",
        );
        return;
      }

      const match = matchAddressToLocationOptions(
        address as Record<string, string | null | undefined>,
      );

      if (!match) {
        Alert.alert(
          "No Match Found",
          "The map location does not match any known district/block/village. Please select manually.",
        );
        return;
      }

      setDistrict(match.district);
      setBlock(match.block);
      setVillage(match.village);

      if (match.confidence === "village") {
        Alert.alert(
          "Location Detected",
          `Matched: ${match.village}, ${match.block}, ${match.district}`,
        );
      } else if (match.confidence === "block") {
        Alert.alert(
          "Partial Match",
          `Matched block: ${match.block}, ${match.district}. Please select the village.`,
        );
      } else {
        Alert.alert(
          "Partial Match",
          `Matched district: ${match.district}. Please select block and village.`,
        );
      }
    } catch {
      Alert.alert(
        "Geocoding Error",
        "Could not determine the address. Please select district, block, and village manually.",
      );
    }
  };

  const handleMapPress = async (e: { nativeEvent: { coordinate: Coords } }) => {
    const coord = e.nativeEvent.coordinate;
    setMarker(coord);
    await reverseGeocodeAndMatch(coord);
  };

  const handleMarkerDragEnd = async (
    e: { nativeEvent: { coordinate: Coords } },
  ) => {
    const coord = e.nativeEvent.coordinate;
    setMarker(coord);
    await reverseGeocodeAndMatch(coord);
  };

  // ─── "Use My Location" ────────────────────────────────────────────

  const useMyLocation = async () => {
    if (gpsLoading) return;
    setGpsLoading(true);

    try {
      const { status } =
        await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access to centre the map on your position.",
        );
        return;
      }

      const position = await ExpoLocation.getCurrentPositionAsync({});
      const coords: Coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setMarker(coords);
      mapRef.current?.animateCamera(
        { center: coords, zoom: 12 },
        { duration: 600 },
      );

      await reverseGeocodeAndMatch(coords);
    } catch {
      Alert.alert(
        "Location Error",
        "Could not detect your location. You can still tap the map to pick a point.",
      );
    } finally {
      setGpsLoading(false);
    }
  };

  // ─── Dropdown modal handlers ──────────────────────────────────────

  const openDropdown = (field: LocationField) => {
    if (field === "block" && !district) {
      Alert.alert("Select District", "Please select a district first.");
      return;
    }
    if (field === "village" && !block) {
      Alert.alert("Select Block", "Please select a block first.");
      return;
    }

    setActiveDropdown(field);
    setLocationSearch("");

    if (field === "district") setTempValue(district);
    if (field === "block") setTempValue(block);
    if (field === "village") setTempValue(village);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setTempValue("");
    setLocationSearch("");
  };

  const confirmSelection = () => {
    if (!activeDropdown || !tempValue) return;

    if (activeDropdown === "district") {
      setDistrict(tempValue);
      setBlock("");
      setVillage("");
    }
    if (activeDropdown === "block") {
      setBlock(tempValue);
      setVillage("");
    }
    if (activeDropdown === "village") {
      setVillage(tempValue);
    }

    closeDropdown();
  };

  // ─── Validation & save ────────────────────────────────────────────

  const validate = () => {
    if (!name.trim()) {
      Alert.alert("Missing Field", "Orchard Name is required");
      return false;
    }
    if (!district.trim()) {
      Alert.alert("Missing Field", "District is required");
      return false;
    }
    if (!block.trim()) {
      Alert.alert("Missing Field", "Block is required");
      return false;
    }
    if (!village.trim()) {
      Alert.alert("Missing Field", "Village is required");
      return false;
    }
    return true;
  };

  const saveAndNext = async () => {
    if (!validate()) return;

    await saveStep({
      name: name.trim(),
      district: district.trim(),
      block: block.trim(),
      village: village.trim(),
      location: [village, block, district].filter(Boolean).join(", "),
      latitude: marker?.latitude,
      longitude: marker?.longitude,
    });

    router.push("/orchard/add-step-2");
  };

  // ─── Render ───────────────────────────────────────────────────────

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
            title="Add Orchard"
            subtitle="Step 1 of 3 • Basic orchard information"
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            className="flex-1 mt-4"
            keyboardShouldPersistTaps="handled"
          >
            {/* ── MAP ──────────────────────────────────────────────── */}
            <View
              className={`rounded-2xl border overflow-hidden ${
                isDark ? "border-slate-700" : "border-edge-green"
              }`}
            >
              <MapView
                ref={mapRef}
                style={{ height: 200 }}
                initialRegion={KASHMIR_REGION}
                onPress={handleMapPress}
                scrollEnabled
                zoomEnabled
              >
                {marker && (
                  <Marker
                    coordinate={marker}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                    pinColor="#6D8B4F"
                  />
                )}
              </MapView>

              {/* Use My Location overlay */}
              <TouchableOpacity
                onPress={useMyLocation}
                disabled={gpsLoading}
                activeOpacity={0.85}
                className={`absolute bottom-3 right-3 flex-row items-center rounded-full px-3 py-2 ${
                  isDark ? "bg-slate-900/90" : "bg-white/90"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
                }}
              >
                {gpsLoading ? (
                  <ActivityIndicator size="small" color="#6D8B4F" />
                ) : (
                  <Ionicons name="locate" size={16} color="#6D8B4F" />
                )}
                <Text
                  style={{ fontFamily: Fonts.semibold, fontSize: 12 }}
                  className={`ml-1.5 ${isDark ? "text-white" : "text-brand-text"}`}
                >
                  {gpsLoading ? "Locating…" : "My Location"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── FORM FIELDS ──────────────────────────────────────── */}
            <View className="mt-4">
              <FormField
                label="Orchard Name"
                icon="leaf-outline"
                placeholder="e.g. Valley Orchard"
                value={name}
                onChangeText={setName}
              />

              <DropdownField
                label="District"
                icon="location-outline"
                placeholder="Select district"
                value={district}
                onPress={() => openDropdown("district")}
              />

              <DropdownField
                label="Block"
                icon="map-outline"
                placeholder={district ? "Select block" : "Select district first"}
                value={block}
                onPress={() => openDropdown("block")}
              />

              <DropdownField
                label="Village"
                icon="home-outline"
                placeholder={block ? "Select village" : "Select block first"}
                value={village}
                onPress={() => openDropdown("village")}
              />
            </View>
          </ScrollView>

          {/* BUTTON */}
          <PrimaryButton
            label="Next"
            onPress={saveAndNext}
            className="mb-4"
          />
        </View>
      </KeyboardAvoidingView>

      {/* ── SELECT MODAL ──────────────────────────────────────────── */}
      <SelectModal
        visible={!!activeDropdown}
        onClose={closeDropdown}
        title={
          activeDropdown === "district"
            ? "Select District"
            : activeDropdown === "block"
            ? "Select Block"
            : "Select Village"
        }
        options={filteredDropdownOptions}
        multiSelect={false}
        searchable
        searchQuery={locationSearch}
        onSearchChange={setLocationSearch}
        tempValue={tempValue}
        onSelect={setTempValue}
        onConfirm={confirmSelection}
        okDisabled={!tempValue}
      />
    </SafeAreaView>
  );
}
