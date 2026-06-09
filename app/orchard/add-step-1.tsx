import React, { useCallback, useMemo, useState, useRef } from "react";

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
import * as Location from "expo-location";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useOrchardDraft } from "@/hooks/useOrchardDraft";
import {
  DISTRICT_OPTIONS,
  LOCATION_MAP,
  getBlockOptions,
  getVillageOptions,
} from "@/constants/locationOptions";
import { Fonts } from "@/theme/fonts";
import StepHeader from "@/components/orchard/form/StepHeader";
import FormField from "@/components/orchard/form/FormField";
import DropdownField from "@/components/orchard/form/DropdownField";
import PrimaryButton from "@/components/orchard/form/PrimaryButton";
import SelectModal from "@/components/orchard/form/SelectModal";

type LocationField = "district" | "block" | "village";
type OrchardCoords = { latitude: number; longitude: number } | null;

type MatchedLocation = {
  district: string;
  block: string;
  village: string;
  confidence: "village" | "block" | "district";
};

type ReverseGeocodeAddressLike = Record<string, string | null | undefined>;

function normalizeLocationName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function buildAddressCandidates(address: ReverseGeocodeAddressLike) {
  const rawValues = Object.values(address)
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0
    )
    .flatMap((value) => [
      value,
      ...value.split(","),
      ...value.split("/"),
      ...value.split("-"),
    ]);

  return rawValues
    .map(normalizeLocationName)
    .filter((value) => value.length > 0);
}

function candidateMatches(candidates: string[], option: string) {
  const normalizedOption = normalizeLocationName(option);
  if (!normalizedOption) return false;

  return candidates.some((candidate) => {
    if (candidate === normalizedOption) return true;

    if (normalizedOption.length >= 4 && candidate.includes(normalizedOption)) {
      return true;
    }

    if (candidate.length >= 4 && normalizedOption.includes(candidate)) {
      return true;
    }

    return false;
  });
}

function matchReverseGeocodeAddressToLocationOptions(
  address: ReverseGeocodeAddressLike
): MatchedLocation | null {
  const candidates = buildAddressCandidates(address);

  if (candidates.length === 0) return null;

  let districtOnlyMatch: MatchedLocation | null = null;
  let blockMatch: MatchedLocation | null = null;

  for (const district of DISTRICT_OPTIONS) {
    const districtMatched = candidateMatches(candidates, district);
    const blocks = LOCATION_MAP[district];

    if (!blocks) continue;

    if (districtMatched && !districtOnlyMatch) {
      districtOnlyMatch = {
        district,
        block: "",
        village: "",
        confidence: "district",
      };
    }

    for (const block of Object.keys(blocks)) {
      const blockMatched = candidateMatches(candidates, block);

      if ((districtMatched || blockMatched) && blockMatched && !blockMatch) {
        blockMatch = {
          district,
          block,
          village: "",
          confidence: "block",
        };
      }

      for (const village of blocks[block]) {
        if (candidateMatches(candidates, village)) {
          return {
            district,
            block,
            village,
            confidence: "village",
          };
        }
      }
    }
  }

  return blockMatch ?? districtOnlyMatch;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown location error";
  }
}

async function getPositionFromWatcher() {
  return new Promise<Location.LocationObject>((resolve, reject) => {
    let subscription: Location.LocationSubscription | null = null;
    let settled = false;

    const cleanup = () => {
      subscription?.remove();
    };

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Location watcher timed out"));
    }, 15000);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Lowest,
        timeInterval: 1000,
        distanceInterval: 0,
      },
      (position) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        cleanup();
        resolve(position);
      }
    )
      .then((sub) => {
        subscription = sub;
      })
      .catch((error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(error);
      });
  });
}

async function getBestAvailablePosition() {
  const errors: string[] = [];

  // 1) Try the simplest Expo call first. This is often the most reliable on
  // iOS Simulator when a simulated location is already selected.
  try {
    return await Location.getCurrentPositionAsync({});
  } catch (error) {
    errors.push(`default: ${getErrorMessage(error)}`);
  }

  // 2) Try cached coordinates next. This is fast if iOS/Android already has a
  // recent provider location.
  try {
    const cachedPosition = await Location.getLastKnownPositionAsync({
      maxAge: 1000 * 60 * 60,
    });

    if (cachedPosition) return cachedPosition;
    errors.push("cached: no cached position");
  } catch (error) {
    errors.push(`cached: ${getErrorMessage(error)}`);
  }

  // 3) Try explicit accuracy levels.
  const attempts = [
    Location.Accuracy.Lowest,
    Location.Accuracy.Low,
    Location.Accuracy.Balanced,
  ];

  for (const accuracy of attempts) {
    try {
      return await Location.getCurrentPositionAsync({ accuracy });
    } catch (error) {
      errors.push(`accuracy ${accuracy}: ${getErrorMessage(error)}`);
    }
  }

  // 4) Final fallback: briefly watch for a provider update.
  try {
    return await getPositionFromWatcher();
  } catch (error) {
    errors.push(`watch: ${getErrorMessage(error)}`);
  }

  throw new Error(errors.join(" | "));
}

export default function AddStep1() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const { loadDraft, saveStep } = useOrchardDraft();

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");
  const [coords, setCoords] = useState<OrchardCoords>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<LocationField | null>(null);
  const [tempValue, setTempValue] = useState("");

  // ✅ FIX: prevent unnecessary rehydration overwrite
  const hasLoadedRef = useRef(false);

  const blockOptions = useMemo(() => getBlockOptions(district), [district]);
  const villageOptions = useMemo(
    () => getVillageOptions(district, block),
    [district, block]
  );

  const dropdownOptions = useMemo(() => {
    if (activeDropdown === "district") return DISTRICT_OPTIONS;
    if (activeDropdown === "block") return blockOptions;
    if (activeDropdown === "village") return villageOptions;
    return [];
  }, [activeDropdown, blockOptions, villageOptions]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const { data } = await loadDraft();

        // ✅ EDIT MODE / CREATE MODE (draft present)
        if (data) {
          setName(data.name || "");
          setDistrict(data.district || "");
          setBlock(data.block || "");
          setVillage(data.village || "");

          if (data.latitude && data.longitude) {
            setCoords({
              latitude: Number(data.latitude),
              longitude: Number(data.longitude),
            });
          }

          hasLoadedRef.current = true;
          return;
        }

        // 🆕 TRUE FRESH START
        if (!hasLoadedRef.current) {
          setName("");
          setDistrict("");
          setBlock("");
          setVillage("");
          setCoords(null);

          hasLoadedRef.current = true;
        }
      };

      loadData();
    }, [])
  );

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

  const useCurrentLocation = async () => {
    if (locationLoading) return;

    setLocationLoading(true);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        Alert.alert(
          "Location Services Off",
          "Please turn on device location services, then try again. You can still select district, block, and village manually."
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access to detect your orchard location. You can still select district, block, and village manually."
        );
        return;
      }

      // Android can have GPS enabled but network location disabled. This prompts
      // the user to improve provider accuracy instead of failing immediately.
      if (Platform.OS === "android") {
        try {
          await Location.enableNetworkProviderAsync();
        } catch {
          // Non-fatal: continue with the available provider/manual fallback.
        }
      }

      const position = await getBestAvailablePosition();

      const currentCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCoords(currentCoords);

      let address: Location.LocationGeocodedAddress | undefined;

      try {
        [address] = await Location.reverseGeocodeAsync(currentCoords);
      } catch {
        Alert.alert(
          "Address Not Found",
          "We detected your coordinates, but could not convert them into an address. Please select district, block, and village manually."
        );
        return;
      }

      if (!address) {
        Alert.alert(
          "Address Not Found",
          "We detected your coordinates, but could not find a matching address. Please select district, block, and village manually."
        );
        return;
      }

      let match: MatchedLocation | null = null;

      try {
        match = matchReverseGeocodeAddressToLocationOptions(
          address as Record<string, string | null | undefined>
        );
      } catch (matchError) {
        Alert.alert(
          "Location Match Error",
          `We detected your coordinates, but could not compare the address with the district/block/village list. Please select the fields manually.\n\nDetails: ${getErrorMessage(matchError)}`
        );
        return;
      }

      if (!match) {
        Alert.alert(
          "No Match Found",
          "We detected your location, but could not match it to the district/block/village list. Please select the fields manually."
        );
        return;
      }

      setDistrict(match.district);
      setBlock(match.block);
      setVillage(match.village);

      if (match.confidence === "village") {
        Alert.alert(
          "Location Detected",
          `We matched your location as ${match.village}, ${match.block}, ${match.district}. You can correct it manually if needed.`
        );
        return;
      }

      if (match.confidence === "block") {
        Alert.alert(
          "Partial Location Detected",
          `We matched your district and block as ${match.block}, ${match.district}. Please select the village manually if needed.`
        );
        return;
      }

      Alert.alert(
        "Partial Location Detected",
        `We matched your district as ${match.district}. Please select block and village manually.`
      );
    } catch (error) {
      let providerDetails = "";

      try {
        const providerStatus = await Location.getProviderStatusAsync();
        providerDetails = `\n\nProvider status: ${JSON.stringify(providerStatus)}`;
      } catch {
        providerDetails = "";
      }

      Alert.alert(
        "Location Error",
        `${
          Platform.OS === "ios"
            ? "Could not detect your location automatically. If you are using the iOS Simulator, confirm Features > Location has a custom location selected."
            : Platform.OS === "android"
            ? "Could not detect your location automatically. If you are using an emulator, set a mock location from Extended Controls > Location."
            : "Could not detect your location automatically."
        } You can also select district, block, and village manually.\n\nNative error: ${getErrorMessage(
          error
        )}${providerDetails}`
      );
    } finally {
      setLocationLoading(false);
    }
  };

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

    if (field === "district") setTempValue(district);
    if (field === "block") setTempValue(block);
    if (field === "village") setTempValue(village);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setTempValue("");
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

  const saveAndNext = async () => {
    if (!validate()) return;

    await saveStep({
      name: name.trim(),
      district: district.trim(),
      block: block.trim(),
      village: village.trim(),
      location: [village, block, district].filter(Boolean).join(", "),
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    });

    router.push("/orchard/add-step-2");
  };

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
            contentContainerStyle={{ paddingBottom: 50 }}
            className="flex-1 mt-6"
          >
            <View>
              <FormField
                label="Orchard Name *"
                placeholder="Enter orchard name"
                value={name}
                onChangeText={setName}
              />

              <View
                className={`mt-8 rounded-3xl border p-4 ${
                  isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-edge-green"
                }`}
              >
                <View className="flex-row items-center mb-1">
                  <View className="w-9 h-9 rounded-full bg-surface-track dark:bg-slate-800 items-center justify-center mr-3">
                    <Ionicons name="location-outline" size={18} color="#6D8B4F" />
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{ fontFamily: Fonts.bold }}
                      className={`text-base ${
                        isDark ? "text-white" : "text-brand-text"
                      }`}
                    >
                      Current Location
                    </Text>
                    <Text
                      style={{ fontFamily: Fonts.medium }}
                      className={`text-xs mt-0.5 ${
                        isDark ? "text-slate-400" : "text-brand-green"
                      }`}
                    >
                      Detect automatically or select manually below.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={useCurrentLocation}
                  disabled={locationLoading}
                  activeOpacity={0.85}
                  className={`mt-4 rounded-2xl py-4 flex-row items-center justify-center ${
                    locationLoading
                      ? isDark
                        ? "bg-slate-700"
                        : "bg-gray-300"
                      : isDark
                      ? "bg-brand-green-dark"
                      : "bg-brand-green"
                  }`}
                >
                  {locationLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="locate-outline" size={20} color="white" />
                  )}
                  <Text
                    style={{ fontFamily: Fonts.semibold }}
                    className="text-white text-base ml-2"
                  >
                    {locationLoading ? "Detecting location..." : "Use Current Location"}
                  </Text>
                </TouchableOpacity>
              </View>

              <DropdownField
                label="District *"
                placeholder="Select district"
                value={district}
                onPress={() => openDropdown("district")}
              />

              <DropdownField
                label="Block *"
                placeholder={district ? "Select block" : "Select district first"}
                value={block}
                onPress={() => openDropdown("block")}
              />

              <DropdownField
                label="Village *"
                placeholder={block ? "Select village" : "Select block first"}
                value={village}
                onPress={() => openDropdown("village")}
              />
            </View>
          </ScrollView>

          {/* BUTTON */}
          <PrimaryButton label="Next" onPress={saveAndNext} className="mb-4" />

        </View>
      </KeyboardAvoidingView>

      <SelectModal
        visible={!!activeDropdown}
        onClose={closeDropdown}
        options={dropdownOptions}
        multiSelect={false}
        searchable={false}
        tempValue={tempValue}
        onSelect={setTempValue}
        onConfirm={confirmSelection}
        okDisabled={!tempValue}
      />
    </SafeAreaView>
  );
}
