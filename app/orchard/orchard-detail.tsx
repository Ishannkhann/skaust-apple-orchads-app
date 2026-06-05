import React, { useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { useOrchardWeather } from "@/hooks/useOrchardWeather";
import { interpolateToHourly } from "@/lib/weather";
import { MOCK_HOURLY, MOCK_DAILY_16_DAYS } from "@/constants/weather";
import OrchardHero from "@/components/orchard/detail/OrchardHero";
import DegreeDaysTile from "@/components/orchard/detail/DegreeDaysTile";
import DetailTabs from "@/components/orchard/detail/DetailTabs";
import AdvisoryCard from "@/components/orchard/detail/AdvisoryCard";
import WeatherStatusBanners from "@/components/orchard/detail/WeatherStatusBanners";
import OrchardSpecsCard from "@/components/orchard/detail/OrchardSpecsCard";
import EditOrchardModal from "@/components/orchard/detail/EditOrchardModal";
import WeatherWidget from "@/components/orchard/detail/WeatherWidget";

const { height, width } = Dimensions.get("window");
const HERO_HEIGHT = 200;

export default function OrchardDetailScreen() {
  const router = useRouter();
  const { orchard } = useLocalSearchParams();
  let parsedOrchardData = null;
  try {
    if (orchard) {
      parsedOrchardData =
        typeof orchard === "string"
          ? JSON.parse(orchard)
          : orchard;
    }
  } catch (e) {
    parsedOrchardData = null;
  }
  const isDark = useColorScheme() === "dark";

  // ─── EDITABLE ORCHARD DATA (so the Edit button can update specs live) ───
  // We keep the original parsed data intact and work off an editable copy.
  const [orchardData, setOrchardData] = useState<any>(parsedOrchardData);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "info">("home");
  // WEATHER SUB-TABS: Today, Tomorrow, Next Week (Next 16 Days)
  const [weatherSubTab, setWeatherSubTab] = useState<"today" | "tomorrow" | "nextWeek">("today");

  // Weather data + fetch logic (extracted to useOrchardWeather).
  const { loading, weatherError, resolvedCity, setResolvedCity, weatherData } =
    useOrchardWeather(orchardData?.location);

  const [expandedDays, setExpandedDays] = useState(false); // Toggle to show all 16 days

  // ─── EDIT ORCHARD MODAL STATE ───
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    orchardType: "",
    variety: "",
    area: "",
    location: "",
    message: "",
  });

  // Open the modal, pre-filling fields with the current values shown on the card.
  const handleEditOrchard = () => {
    setEditForm({
      name: orchardData?.name || "",
      orchardType: orchardData?.orchardType || "",
      variety: orchardData?.variety || "",
      area: orchardData?.area || "",
      // Prefer the explicit orchard location, fall back to the API-resolved city.
      location: orchardData?.location || resolvedCity || "",
      message: orchardData?.message || "",
    });
    setShowEditModal(true);
  };

  // Save edits → update editable orchardData (specs card updates instantly).
  const handleSaveOrchard = () => {
    setOrchardData((prev: any) => ({
      ...(prev || {}),
      name: editForm.name.trim(),
      orchardType: editForm.orchardType.trim(),
      variety: editForm.variety.trim(),
      area: editForm.area.trim(),
      location: editForm.location.trim(),
      message: editForm.message.trim(),
    }));
    // Keep the weather card's location label in sync if the user changed it.
    if (editForm.location.trim()) {
      setResolvedCity(editForm.location.trim());
    }
    setShowEditModal(false);
  };

  const heroImage = selectedImage || orchardData?.image || null;
  const hasImage = !!heroImage;


  const handleUpload = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow gallery access to upload an image."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // DEFENSIVE FALLBACKS
  const dailyForecastList = (weatherData.daily && weatherData.daily.length > 0)
    ? weatherData.daily
    : MOCK_DAILY_16_DAYS;
  const hourlyForecastList = (weatherData.hourly && weatherData.hourly.length > 0)
    ? weatherData.hourly
    : MOCK_HOURLY;
  const visibleDays = expandedDays ? dailyForecastList : dailyForecastList.slice(0, 7);
  const rainChartData = dailyForecastList.slice(0, 7);
  const totalWeeklyRain = rainChartData.reduce((sum, item) => {
    const match = String(item.rainVol).match(/(\d+(\.\d+)?)/);
    return sum + (match ? parseFloat(match[0]) : 0);
  }, 0);

  // Pick correct active forecast safely (Today or Tomorrow)
  const activeForecast = (weatherSubTab === "tomorrow" && dailyForecastList.length > 1)
    ? dailyForecastList[1]
    : dailyForecastList[0];

  // ─── INTERPOLATE TO TRUE 1-HOUR INCREMENTS ───
  const interpolatedHourlyList = interpolateToHourly(hourlyForecastList);
  // Pick correct active hourly list dynamically (Today's 24 hours or Tomorrow's 24 hours in 1-hour increments!)
  // Slicing 24 elements represents exactly 24 full hours of 1-hour interval data!
  const activeHourlyList = (weatherSubTab === "tomorrow" && interpolatedHourlyList.length >= 48)
    ? interpolatedHourlyList.slice(24, 48)
    : interpolatedHourlyList.slice(0, 24);

  // ─── HOURLY-BASED RAIN INTELLIGENCE GRAPH COORDINATES ───
  // Using the exact 24 1-hour points to plot the graph dynamically!
  const hourlyGraphData = activeHourlyList;

  const svgWidth = 840; // Wider width (35px per hour step * 24 nodes) to allow smooth horizontal scrolling
  const svgHeight = 85; // Sized perfectly to fit the stacked dual-line AM/PM time tags
  const points = hourlyGraphData.map((item, idx) => {
    const stepSize = 800 / Math.max(hourlyGraphData.length - 1, 1);
    const x = 15 + idx * stepSize;
    const prob = item.rainProb;
    const y = 45 - (prob / 100) * 32; // Calibrated y-coordinate range
    return { x, y, prob, vol: item.rainVol || "0mm", label: item.time };
  });
  const fillPathD = `${points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`);
  }, "")} L ${points[points.length - 1].x} 55 L ${points[0].x} 55 Z`;
  const linePathD = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`);
  }, "");

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-[#f4fbf0]"}`}
    >
      <ScrollView
        className={isDark ? "bg-slate-950" : "bg-[#f4fbf0]"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
      >
        <View
          className={`flex-1 px-5 pt-4 ${
            isDark ? "bg-slate-950" : "bg-[#f4fbf0]"
          }`}
        >
          {/* BACK BUTTON */}
          <TouchableOpacity
            onPress={() => router.back()}
            className={`self-start mt-4 mb-4 w-11 h-11 rounded-full items-center justify-center ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={isDark ? "#fff" : "#243022"}
            />
          </TouchableOpacity>

          {/* HERO */}
          <OrchardHero
            name={orchardData?.name}
            location={orchardData?.location}
            heroImage={heroImage}
            onUpload={handleUpload}
          />

          {/* ─── DEGREE DAYS TILE ─── */}
          <DegreeDaysTile />

          {/* TABS SELECTOR */}
          <DetailTabs activeTab={activeTab} onChange={setActiveTab} />

          {/* TAB CONTENT */}
          <View className="mt-4">
            {activeTab === "home" ? (
              <View className="flex-1 space-y-4">

                {/* --- ORCHARD ADVISORY --- */}
                <AdvisoryCard />

                {/* API error + loading banners */}
                <WeatherStatusBanners weatherError={weatherError} loading={loading} />

                {/* WEATHER WIDGET */}
                <WeatherWidget
                  weatherSubTab={weatherSubTab}
                  setWeatherSubTab={setWeatherSubTab}
                  expandedDays={expandedDays}
                  setExpandedDays={setExpandedDays}
                  resolvedCity={resolvedCity}
                  activeForecast={activeForecast}
                  visibleDays={visibleDays}
                  activeHourlyList={activeHourlyList}
                  points={points}
                  fillPathD={fillPathD}
                  linePathD={linePathD}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              </View>
            ) : (
              /* --- ORCHARD INFO TAB --- */
              <OrchardSpecsCard
                orchardData={orchardData}
                resolvedCity={resolvedCity}
                onEdit={handleEditOrchard}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* ═══════════════ EDIT ORCHARD MODAL ═══════════════ */}
      <EditOrchardModal
        visible={showEditModal}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveOrchard}
      />
    </SafeAreaView>
  );
}
