import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  useColorScheme,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path, Circle, Rect, Text as SvgText, Defs, LinearGradient, Stop, G } from "react-native-svg";

const { height, width } = Dimensions.get("window");
const HERO_HEIGHT = 200;

// ─── CONFIGURATION ───
// REPLACE THIS SINGLE VALUE WITH YOUR REAL OPENWEATHER API KEY
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";

// Mock fallback weather data
const MOCK_HOURLY = [
  // Today's hours (0 - 7)
  { time: "12:30 AM", temp: 30.3, icon: "rainy", rainProb: 65, rainVol: "2.4mm" },
  { time: "1:30 AM", temp: 30.3, icon: "rainy", rainProb: 80, rainVol: "4.1mm" },
  { time: "2:30 AM", temp: 30.3, icon: "cloudy", rainProb: 40 },
  { time: "3:30 AM", temp: 29.8, icon: "partly-sunny", rainProb: 15 },
  { time: "4:30 AM", temp: 29.2, icon: "sunny", rainProb: 10 },
  { time: "5:30 AM", temp: 28.5, icon: "sunny", rainProb: 5 },
  { time: "6:30 AM", temp: 28.0, icon: "sunny", rainProb: 0 },
  { time: "7:30 AM", temp: 27.5, icon: "sunny", rainProb: 0 },
  // Tomorrow's hours (8 - 15)
  { time: "12:30 AM", temp: 22.0, icon: "rainy", rainProb: 90, rainVol: "5.5mm" },
  { time: "1:30 AM", temp: 21.8, icon: "rainy", rainProb: 85, rainVol: "3.2mm" },
  { time: "2:30 AM", temp: 21.5, icon: "thunderstorm", rainProb: 75, rainVol: "1.2mm" },
  { time: "3:30 AM", temp: 22.0, icon: "cloudy", rainProb: 45 },
  { time: "4:30 AM", temp: 23.5, icon: "partly-sunny", rainProb: 20 },
  { time: "5:30 AM", temp: 24.2, icon: "sunny", rainProb: 10 },
  { time: "6:30 AM", temp: 25.0, icon: "sunny", rainProb: 5 },
  { time: "7:30 AM", temp: 24.8, icon: "sunny", rainProb: 0 },
];

const MOCK_DAILY_16_DAYS = [
  { day: "Today", desc: "Clouds", icon: "partly-sunny", maxTemp: 30.3, minTemp: 22, rainProb: 30, rainVol: "2mm", humidity: 68, wind: "1.93KM/Hr", clouds: 13, dewPoint: "20.47°", feelsLike: "30.3°" },
  { day: "Tomorrow", desc: "Heavy Rain", icon: "rainy", maxTemp: 22, minTemp: 14, rainProb: 90, rainVol: "18mm", humidity: 85, wind: "4.5KM/Hr", clouds: 95, dewPoint: "18.2°", feelsLike: "21.0°" },
  { day: "Wed, May 27", desc: "Scattered Rain", icon: "thunderstorm", maxTemp: 23, minTemp: 15, rainProb: 75, rainVol: "8mm", humidity: 78, wind: "3.2KM/Hr", clouds: 80, dewPoint: "19.0°", feelsLike: "22.5°" },
  { day: "Thu, May 28", desc: "Partly Cloudy", icon: "cloudy", maxTemp: 25, minTemp: 16, rainProb: 25, rainVol: "0.5mm", humidity: 60, wind: "2.1KM/Hr", clouds: 40, dewPoint: "17.5°", feelsLike: "24.8°" },
  { day: "Fri, May 29", desc: "Sunny & Warm", icon: "sunny", maxTemp: 28, minTemp: 17, rainProb: 5, rainVol: "0mm", humidity: 50, wind: "1.5KM/Hr", clouds: 10, dewPoint: "15.0°", feelsLike: "27.5°" },
  { day: "Sat, May 30", desc: "Clear Sky", icon: "sunny", maxTemp: 29, minTemp: 18, rainProb: 0, rainVol: "0mm", humidity: 45, wind: "1.2KM/Hr", clouds: 5, dewPoint: "14.2°", feelsLike: "29.0°" },
  { day: "Sun, May 31", desc: "Light Rain", icon: "rainy", maxTemp: 24, minTemp: 16, rainProb: 60, rainVol: "3mm", humidity: 70, wind: "2.8KM/Hr", clouds: 65, dewPoint: "18.0°", feelsLike: "23.5°" },
  { day: "Mon, Jun 01", desc: "Partly Sunny", icon: "partly-sunny", maxTemp: 26, minTemp: 16, rainProb: 15, rainVol: "0mm", humidity: 55, wind: "1.9KM/Hr", clouds: 25, dewPoint: "16.8°", feelsLike: "25.5°" },
  { day: "Tue, Jun 02", desc: "Moderate Rain", icon: "rainy", maxTemp: 23, minTemp: 15, rainProb: 80, rainVol: "12mm", humidity: 82, wind: "3.9KM/Hr", clouds: 88, dewPoint: "19.2°", feelsLike: "22.0°" },
  { day: "Wed, Jun 03", desc: "Scattered Rain", icon: "rainy", maxTemp: 24, minTemp: 14, rainProb: 70, rainVol: "6mm", humidity: 76, wind: "2.5KM/Hr", clouds: 72, dewPoint: "18.5°", feelsLike: "23.8°" },
  { day: "Thu, Jun 04", desc: "Mostly Cloudy", icon: "cloudy", maxTemp: 25, minTemp: 16, rainProb: 30, rainVol: "1mm", humidity: 62, wind: "2.0KM/Hr", clouds: 48, dewPoint: "17.0°", feelsLike: "24.5°" },
  { day: "Fri, Jun 05", desc: "Pleasant & Sunny", icon: "sunny", maxTemp: 27, minTemp: 17, rainProb: 10, rainVol: "0mm", humidity: 52, wind: "1.7KM/Hr", clouds: 15, dewPoint: "15.5°", feelsLike: "26.8°" },
  { day: "Sat, Jun 06", desc: "Clear Sunny", icon: "sunny", maxTemp: 29, minTemp: 18, rainProb: 0, rainVol: "0mm", humidity: 48, wind: "1.1KM/Hr", clouds: 5, dewPoint: "14.5°", feelsLike: "28.5°" },
  { day: "Sun, Jun 07", desc: "Afternoon Showers", icon: "thunderstorm", maxTemp: 25, minTemp: 15, rainProb: 65, rainVol: "4mm", humidity: 72, wind: "3.0KM/Hr", clouds: 70, dewPoint: "18.2°", feelsLike: "24.5°" },
  { day: "Mon, Jun 08", desc: "Mostly Cloudy", icon: "cloudy", maxTemp: 24, minTemp: 15, rainProb: 40, rainVol: "2mm", humidity: 68, wind: "2.2KM/Hr", clouds: 52, dewPoint: "17.5°", feelsLike: "23.8°" },
  { day: "Tue, Jun 09", desc: "Partly Sunny", icon: "partly-sunny", maxTemp: 26, minTemp: 16, rainProb: 20, rainVol: "0.2mm", humidity: 58, wind: "1.8KM/Hr", clouds: 22, dewPoint: "16.5°", feelsLike: "25.2°" },
];

// Minimalist Spray Nozzle and Droplet Icon component matching your exact screenshot
function AdvisoryIcon() {
  const isDark = useColorScheme() === "dark";
  return (
    <View
      className={`w-14 h-14 rounded-full border items-center justify-center ${
        isDark ? "border-slate-800 bg-slate-900" : "border-[#d8eedf] bg-[#f5fbf7]"
      }`}
    >
      <View className="items-center justify-center relative w-10 h-10">
        <View className="w-5 h-1 bg-[#8fa499] rounded-full absolute top-[5px]" />
        <View className="w-[2px] h-3.5 bg-[#8fa499] absolute top-[6px]" />
        <View className={`w-6 h-6 rounded-full border absolute bottom-[3px] items-center justify-center ${
          isDark ? "border-slate-700 bg-slate-950" : "border-[#b8d9c4] bg-white"
        }`}>
          <View className="w-2.5 h-2.5 rounded-full bg-[#ca6a24] shadow-sm" />
        </View>
      </View>
    </View>
  );
}

// Custom mathematical interpolation engine to convert 3-hour forecasts into 1-hour increments
function interpolateToHourly(threeHourList: any[]) {
  if (!threeHourList || threeHourList.length === 0) return [];

  const parseToMinutes = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return 0;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const ampm = match[3];
    if (ampm) {
      if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
      if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
    }
    return h * 60 + m;
  };
  // Check if the list is already in 1-hour intervals (e.g. mock data)
  if (threeHourList.length > 1) {
    const min0 = parseToMinutes(threeHourList[0].time);
    const min1 = parseToMinutes(threeHourList[1].time);
    let diff = min1 - min0;
    if (diff < 0) diff += 24 * 60; // Handle midnight wrap-around

    // If interval is already ~1 hour, skip the interpolation block to avoid duplicates!
    if (diff > 45 && diff < 75) {
      console.log("🌦️ [OpenWeather] Hourly list is already in 1-hour intervals. Skipping interpolation.");
      return threeHourList;
    }
  }
  const interpolated: any[] = [];

  for (let i = 0; i < threeHourList.length - 1; i++) {
    const cur = threeHourList[i];
    const nxt = threeHourList[i + 1];

    const minCurrent = parseToMinutes(cur.time);
    const minNext = parseToMinutes(nxt.time);
    let diffMinutes = minNext - minCurrent;
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Midnight wrap-around

    const diffHours = Math.round(diffMinutes / 60);

    // If the distance is already 1 hour, just push current item and skip interpolation
    if (diffHours <= 1) {
      interpolated.push(cur);
      continue;
    }

    // Parse the start time (e.g., "12:30 AM" or "01:30 PM")
    const timeMatch = cur.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!timeMatch) {
      interpolated.push(cur);
      continue;
    }

    let hour24 = parseInt(timeMatch[1]);
    const min = parseInt(timeMatch[2]);
    const ampm = timeMatch[3];

    if (ampm) {
      if (ampm.toUpperCase() === "PM" && hour24 < 12) hour24 += 12;
      if (ampm.toUpperCase() === "AM" && hour24 === 12) hour24 = 0;
    }

    // Generate steps of 1-hour increments dynamically based on diffHours
    for (let step = 0; step < 3; step++) {
      const currentHour24 = (hour24 + step) % 24;

      // Convert back to clean 12-hour format without leading zeros (e.g., "1:30 AM")
      const displayHour = currentHour24 % 12 === 0 ? 12 : currentHour24 % 12;
      const displayAmpm = currentHour24 >= 12 ? "PM" : "AM";
      const stepTimeStr = `${displayHour}:${String(min).padStart(2, '0')} ${displayAmpm}`;

      const ratio = step / diffHours;
      // Smooth linear interpolation of temperatures and rain probabilities
      const interpolatedTemp = cur.temp + ratio * (nxt.temp - cur.temp);
      const interpolatedProb = Math.round(cur.rainProb + ratio * (nxt.rainProb - cur.rainProb));
      const icon = ratio > 0.5 ? nxt.icon : cur.icon;
      const desc = ratio > 0.5 ? nxt.desc : cur.desc;

      interpolated.push({
        time: stepTimeStr,
        temp: parseFloat(interpolatedTemp.toFixed(1)),
        icon,
        desc,
        rainProb: interpolatedProb,
        rainVol: cur.rainVol,
      });
    }
  }

  // Add final item
  if (threeHourList.length > 0) {
    interpolated.push(threeHourList[threeHourList.length - 1]);
  }

  return interpolated;
}

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
  // Weather States
  const [loading, setLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [resolvedCity, setResolvedCity] = useState<string>(parsedOrchardData?.location || "Nishat");
  const [weatherData, setWeatherData] = useState<{
    hourly: typeof MOCK_HOURLY;
    daily: typeof MOCK_DAILY_16_DAYS;
  }>({
    hourly: MOCK_HOURLY,
    daily: MOCK_DAILY_16_DAYS,
  });
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

  // Fetch Weather Data from OpenWeather API using the Orchard Profile Location
  useEffect(() => {
    async function fetchWeather() {
      const originalLocation = orchardData?.location || "Nishat";

      // Clean up the location string (take first part before any comma/slash)
      const location = originalLocation.split(/[,/]/)[0].trim() || "Nishat";
      // Foolproof check: if key is unconfigured, return and show simulated weather data
      if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.includes("YOUR_") || OPENWEATHER_API_KEY.trim() === "" || OPENWEATHER_API_KEY.length < 15) {
        console.log("🌦️ [OpenWeather] No API Key set. Rendering fallback mock weather data.");
        setWeatherError("API Key is unconfigured. Showing simulated weather data.");
        return;
      }
      setLoading(true);
      setWeatherError(null);
      try {
        console.log(`🌦️ [OpenWeather] Direct fetching 5-day forecast for city: "${location}"...`);

        // Fetch directly using City Name (eliminating geocoding extra step entirely!)
        let forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        // 401: Invalid key / non-activated key
        if (forecastRes.status === 401) {
          throw new Error("Invalid API Key (401 Unauthorized). Note: Newly created OpenWeather keys take up to 2-3 hours to activate.");
        }

        // 404: City name not found. Fallback to Srinagar.
        if (forecastRes.status === 404) {
          console.warn(`🌦️ [OpenWeather] City "${location}" not found. Trying default: "Srinagar"...`);
          forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=Srinagar&units=metric&appid=${OPENWEATHER_API_KEY}`
          );
          if (!forecastRes.ok) {
            throw new Error(`Default city Srinagar fallback failed (status ${forecastRes.status})`);
          }
        }
        if (!forecastRes.ok) {
          throw new Error(`API request failed with status ${forecastRes.status}`);
        }
        const forecastData = await forecastRes.json();
        if (forecastData && forecastData.list) {
          console.log(`🌦️ [OpenWeather] Forecast fetched successfully! Parsing...`);

          // Get the resolved city name from the API response
          const resolvedName = forecastData.city?.name || location;
          setResolvedCity(resolvedName);

          // Map Hourly Forecast (next 16 steps = 48 hours to cover Today & Tomorrow full scrollable intervals)
          const mappedHourly = forecastData.list.slice(0, 16).map((item: any, idx: number) => {
            const date = new Date(item.dt * 1000);

            // Format time without leading zeros (e.g. "1:30 AM")
            const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

            let iconName = "partly-sunny";
            if (item.weather[0].main === "Rain") iconName = "rainy";
            else if (item.weather[0].main === "Clear") iconName = "sunny";
            else if (item.weather[0].main === "Clouds") iconName = "cloudy";
            else if (item.weather[0].main === "Thunderstorm") iconName = "thunderstorm";
            return {
              time: timeStr,
              temp: item.main.temp,
              icon: iconName,
              rainProb: Math.round((item.pop || 0) * 100),
              rainVol: item.rain ? `${item.rain["3h"] || 0}mm` : undefined,
            };
          });
          // Map Daily Forecast (Combine 3-hour chunks into days)
          const dailyMap: { [key: string]: any } = {};
          forecastData.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000);
            const dayStr = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

            if (!dailyMap[dayStr]) {
              dailyMap[dayStr] = {
                temps: [],
                rainProbs: [],
                rainVols: 0,
                weatherMain: item.weather[0].main,
                humidityList: [],
                windList: [],
                cloudsList: [],
              };
            }
            dailyMap[dayStr].temps.push(item.main.temp);
            dailyMap[dayStr].rainProbs.push(item.pop || 0);
            dailyMap[dayStr].humidityList.push(item.main.humidity);
            dailyMap[dayStr].windList.push(item.wind.speed);
            dailyMap[dayStr].cloudsList.push(item.clouds.all);
            if (item.rain && item.rain["3h"]) {
              dailyMap[dayStr].rainVols += item.rain["3h"];
            }
          });
          const mappedDaily = Object.keys(dailyMap).map((dayKey, idx) => {
            const temps = dailyMap[dayKey].temps;
            const maxTemp = Math.max(...temps);
            const minTemp = Math.min(...temps);
            const rainProb = Math.round(Math.max(...dailyMap[dayKey].rainProbs) * 100);
            const rainVolSum = Math.round(dailyMap[dayKey].rainVols);

            // Averages
            const avgHumidity = Math.round(dailyMap[dayKey].humidityList.reduce((a: any, b: any) => a + b, 0) / dailyMap[dayKey].humidityList.length);
            const avgWind = (dailyMap[dayKey].windList.reduce((a: any, b: any) => a + b, 0) / dailyMap[dayKey].windList.length * 3.6).toFixed(2); // Convert m/s to km/h
            const avgClouds = Math.round(dailyMap[dayKey].cloudsList.reduce((a: any, b: any) => a + b, 0) / dailyMap[dayKey].cloudsList.length);
            let iconName = "partly-sunny";
            let desc = "Partly Cloudy";
            const weather = dailyMap[dayKey].weatherMain;
            if (weather === "Rain") { iconName = "rainy"; desc = "Rainy"; }
            else if (weather === "Clear") { iconName = "sunny"; desc = "Sunny"; }
            else if (weather === "Clouds") { iconName = "cloudy"; desc = "Clouds"; }
            else if (weather === "Thunderstorm") { iconName = "thunderstorm"; desc = "Stormy"; }
            return {
              day: idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : dayKey,
              desc,
              icon: iconName,
              maxTemp: maxTemp.toFixed(1),
              minTemp: minTemp.toFixed(1),
              rainProb,
              rainVol: rainVolSum > 0 ? `${rainVolSum}mm` : "0mm",
              humidity: avgHumidity,
              wind: `${avgWind}KM/Hr`,
              clouds: avgClouds,
              dewPoint: `${Math.round(minTemp - ((100 - avgHumidity) / 5))}°`,
              feelsLike: `${Math.round(maxTemp)}°`,
            };
          });
          // Extrapolate remaining days to complete 16 full slots
          const finalDailyList = [...mappedDaily];
          for (let i = finalDailyList.length; i < 16; i++) {
            const baseMock = MOCK_DAILY_16_DAYS[i] || MOCK_DAILY_16_DAYS[i % 16];
            const dateOffset = new Date();
            dateOffset.setDate(dateOffset.getDate() + i);
            const dayStr = dateOffset.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

            finalDailyList.push({
              ...baseMock,
              day: dayStr,
            });
          }
          setWeatherData({
            hourly: mappedHourly,
            daily: finalDailyList,
          });
          console.log("🌦️ [OpenWeather] State successfully updated with real API data.");
        }
      } catch (err: any) {
        console.error("🌦️ [OpenWeather] Error: ", err.message);
        setWeatherError(err.message || "Failed to fetch weather.");
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [orchardData?.location]);

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
          <View
            style={{ height: HERO_HEIGHT }}
            className={`w-full rounded-[32px] overflow-hidden relative ${
              isDark ? "bg-slate-900" : "bg-[#dfe7d8]"
            }`}
          >
            {hasImage ? (
              <ImageBackground
                source={{ uri: heroImage }}
                resizeMode="cover"
                className="flex-1"
              >
                <View className="flex-1 bg-black/25 px-5 pt-5 pb-6 justify-end relative">
                  <View className="flex-row items-end justify-between">
                    <View className="flex-1 pr-4">
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "Montserrat_700Bold" }}
                        className="text-white text-[24px]"
                      >
                        {orchardData?.name || "Orchard Name"}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons
                          name="location-outline"
                          size={15}
                          color="rgba(255,255,255,0.9)"
                        />
                        <Text
                          style={{ fontFamily: "Montserrat_500Medium" }}
                          className="ml-1 text-white/90 text-sm"
                        >
                          {orchardData?.location || "Orchard Location"}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={handleUpload}
                      className="px-4 py-2 rounded-full bg-white/95 border border-white/40"
                    >
                      <Text
                        style={{ fontFamily: "Montserrat_600SemiBold" }}
                        className="text-[#243022] text-sm"
                      >
                        Edit Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            ) : (
              <View className="flex-1 px-5 pt-5 pb-6 justify-between relative">
                <View className="items-center flex-1 justify-center">
                  <TouchableOpacity
                    onPress={handleUpload}
                    activeOpacity={0.9}
                    className="w-[82%] h-24 rounded-2xl border-2 border-dashed items-center justify-center"
                    style={{
                      borderColor: isDark ? "#475569" : "#9fb08f",
                      backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={isDark ? "#cbd5e1" : "#55624f"}
                    />
                    <Text
                      style={{ fontFamily: "Montserrat_500Medium" }}
                      className={`mt-2 text-sm ${
                        isDark ? "text-slate-300" : "text-[#55624f]"
                      }`}
                    >
                      Upload Cover
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* ─── DEGREE DAYS TILE ─── */}
          <View
            className={`mt-4 rounded-2xl border px-5 py-4 flex-row items-center justify-between ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-[#e2f0d9]"
            }`}
            style={{
              shadowColor: isDark ? "#000" : "#6b8f71",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3.5 ${
                  isDark ? "bg-amber-950/40" : "bg-amber-50"
                }`}
              >
                <Ionicons name="thermometer-outline" size={20} color={isDark ? "#fbbf24" : "#d97706"} />
              </View>
              <View>
                <Text
                  style={{ fontFamily: "Montserrat_500Medium" }}
                  className={`text-[10px] uppercase tracking-[1.2px] ${
                    isDark ? "text-slate-400" : "text-green-900/50"
                  }`}
                >
                  Growing Degree Days
                </Text>
                <Text
                  style={{ fontFamily: "Montserrat_700Bold" }}
                  className={`text-2xl font-bold mt-0.5 ${
                    isDark ? "text-white" : "text-[#1b3d2f]"
                  }`}
                >
                  222.2
                  <Text
                    style={{ fontFamily: "Montserrat_500Medium" }}
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-[#6b8f71]"
                    }`}
                  >
                    {" "}°C
                  </Text>
                </Text>
              </View>
            </View>
            <View
              className={`rounded-full px-3 py-1.5 ${
                isDark ? "bg-emerald-950/30" : "bg-[#e8f5e9]"
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                <Text
                  style={{ fontFamily: "Montserrat_600SemiBold", fontSize: 10 }}
                  className={isDark ? "text-emerald-400" : "text-[#2d8a56]"}
                >
                  Active Growing
                </Text>
              </View>
            </View>
          </View>

          {/* TABS SELECTOR */}
          <View className="mt-4 flex-row bg-white/70 dark:bg-slate-800 rounded-2xl p-1">
            <TouchableOpacity
              onPress={() => setActiveTab("home")}
              className="flex-1 py-3 rounded-xl items-center"
              style={{
                backgroundColor: activeTab === "home" ? "#009e4f" : "transparent",
              }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "home"
                    ? "text-white"
                    : isDark
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("info")}
              className="flex-1 py-3 rounded-xl items-center"
              style={{
                backgroundColor: activeTab === "info" ? "#009e4f" : "transparent",
              }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "info"
                    ? "text-white"
                    : isDark
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Orchard Info
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB CONTENT */}
          <View className="mt-4">
            {activeTab === "home" ? (
              <View className="flex-1 space-y-4">

                {/* --- ORCHARD ADVISORY COMPONENT --- */}
                <View>
                  <View className="flex-row items-center mb-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                    <Text
                      style={{ fontFamily: "Montserrat_700Bold" }}
                      className={`text-[10px] tracking-[1.2px] uppercase ${
                        isDark ? "text-white/60" : "text-green-900/60"
                      }`}
                    >
                      ORCHARD ADVISORY
                    </Text>
                  </View>
                  <View
                    className={`rounded-xl border p-3 flex-row items-start ${
                      isDark
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-[#e2f0d9]"
                    }`}
                  >
                    {/* FIXED: Removed h-full wrapper which broke the Layout sizing inside the ScrollView */}
                    <View className="mr-3 justify-start items-center pt-1">
                      <AdvisoryIcon />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between pb-1.5">
                        <Text
                          style={{ fontFamily: "Montserrat_700Bold" }}
                          className={`text-lg font-bold ${
                            isDark ? "text-white" : "text-[#1b3d2f]"
                          }`}
                        >
                          Calcium Spray
                        </Text>
                        <View className="flex-row items-center bg-[#fffbeb] dark:bg-amber-950/20 border border-[#fde68a] dark:border-amber-900/30 px-2.5 py-0.5 rounded-full">
                          <Ionicons name="time-outline" size={11} color="#ca6a24" />
                          <Text
                            style={{
                              fontFamily: "Montserrat_600SemiBold",
                              fontSize: 10,
                            }}
                            className="ml-1 text-[#ca6a24] dark:text-amber-400 font-semibold"
                          >
                            Pending
                          </Text>
                        </View>
                      </View>
                      <View className="mt-1">
                        <View
                          className={`flex-row items-center py-2 border-t ${
                            isDark ? "border-slate-800" : "border-[#f1f5f9]"
                          }`}
                        >
                          <Ionicons name="rainy-outline" size={15} color="#3b82f6" />
                          <Text
                            style={{ fontFamily: "Montserrat_500Medium" }}
                            className={`ml-2.5 text-xs ${
                              isDark ? "text-white/70" : "text-slate-600"
                            }`}
                          >
                            Rains On 16th & 17th
                          </Text>
                        </View>
                        <View
                          className={`flex-row items-center py-2 border-t ${
                            isDark ? "border-slate-800" : "border-[#f1f5f9]"
                          }`}
                        >
                          <Ionicons name="bug-outline" size={15} color="#ef4444" />
                          <Text
                            style={{ fontFamily: "Montserrat_500Medium" }}
                            className={`ml-2.5 text-xs ${
                              isDark ? "text-white/70" : "text-slate-600"
                            }`}
                          >
                            Scout For Aphids & Mites
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* API Warning/Error overlay - visible to help you debug why it is mock data */}
                {weatherError && (
                  <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 px-3 py-2.5 rounded-xl flex-row items-center">
                    <Ionicons name="warning" size={16} color="#d97706" />
                    <Text style={{ fontFamily: "Montserrat_500Medium", fontSize: 10 }} className="text-amber-800 dark:text-amber-400 ml-2 flex-1">
                      {weatherError}
                    </Text>
                  </View>
                )}

                {/* Loading Indicator for API updates */}
                {loading && (
                  <View className="flex-row items-center justify-center py-4">
                    <ActivityIndicator size="small" color="#009e4f" />
                    <Text className="ml-2 text-xs text-slate-500">Updating live weather...</Text>
                  </View>
                )}

                {/* ─── NEW HIGH-FIDELITY WEATHER WIDGET SECTION (Matches Photo exactly) ─── */}
                <View className="mt-2">

                  {/* WEATHER SUB-TABS: Today, Tomorrow, Next 16 Days (Matches Next 16 Days exactly) */}
                  <View className="flex-row items-center justify-between px-2 mb-3 mt-1">
                    <TouchableOpacity
                      onPress={() => setWeatherSubTab("today")}
                      className="px-4 py-1.5 rounded-full"
                      style={{
                        backgroundColor: weatherSubTab === "today" ? "#7a9a60" : "transparent",
                      }}
                    >
                      <Text
                        style={{ fontFamily: "Montserrat_700Bold", fontSize: 11 }}
                        className={
                          weatherSubTab === "today"
                            ? "text-white font-bold"
                            : isDark
                            ? "text-slate-400 font-semibold"
                            : "text-[#55624f]/80 font-semibold"
                        }
                      >
                        Today
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setWeatherSubTab("tomorrow")}
                      className="px-4 py-1.5 rounded-full"
                      style={{
                        backgroundColor: weatherSubTab === "tomorrow" ? "#7a9a60" : "transparent",
                      }}
                    >
                      <Text
                        style={{ fontFamily: "Montserrat_700Bold", fontSize: 11 }}
                        className={
                          weatherSubTab === "tomorrow"
                            ? "text-white font-bold"
                            : isDark
                            ? "text-slate-400 font-semibold"
                            : "text-[#55624f]/80 font-semibold"
                        }
                      >
                        Tomorrow
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setWeatherSubTab("nextWeek")}
                      className="px-4 py-1.5 rounded-full"
                      style={{
                        backgroundColor: weatherSubTab === "nextWeek" ? "#7a9a60" : "transparent",
                      }}
                    >
                      <Text
                        style={{ fontFamily: "Montserrat_700Bold", fontSize: 11 }}
                        className={
                          weatherSubTab === "nextWeek"
                            ? "text-white font-bold"
                            : isDark
                            ? "text-slate-400 font-semibold"
                            : "text-[#55624f]/80 font-semibold"
                        }
                      >
                        Next 16 Days
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* MAIN GRADIENT WEATHER CARD */}
                  <View className="bg-[#469e80] dark:bg-slate-900 rounded-[28px] overflow-hidden border border-[#5cb895]/20 dark:border-slate-800 shadow-md relative">

                    {/* SVG Gradient Background */}
                    <View className="absolute inset-0">
                      <Svg height="100%" width="100%">
                        <Defs>
                          <LinearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor="#5cb895" />
                            <Stop offset="100%" stopColor="#30755d" />
                          </LinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#bgGrad)" />
                      </Svg>
                    </View>

                    {/* Card Content Overlay */}
                    <View className="p-5 relative">

                      {/* CARD CONTENT HEADER */}
                      <View className="items-center">
                        <View className="flex-row items-center justify-center">
                          <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.85)" />
                          <Text
                            style={{ fontFamily: "Montserrat_600SemiBold" }}
                            className="text-white text-[14px] ml-1.5 font-semibold tracking-wide"
                          >
                            {resolvedCity}
                          </Text>
                        </View>
                        <Text
                          style={{ fontFamily: "Montserrat_700Bold" }}
                          className="text-white text-[23px] font-bold mt-1"
                        >
                          {weatherSubTab === "today"
                            ? "Today's Weather"
                            : weatherSubTab === "tomorrow"
                            ? "Tomorrow's Weather"
                            : "16-Day Forecast"}
                        </Text>
                        <Text
                          style={{ fontFamily: "Montserrat_500Medium" }}
                          className="text-white/80 text-[10px] mt-0.5"
                        >
                          {weatherSubTab === "today"
                            ? "25 May 2026 Monday"
                            : weatherSubTab === "tomorrow"
                            ? "26 May 2026 Tuesday"
                            : "Next 16 Days Overview"}
                        </Text>
                      </View>

                      {/* CONDITIONAL RENDER BY WEATHER SUB-TAB */}
                      {weatherSubTab !== "nextWeek" ? (
                        <>
                          {/* CURRENT TEMP / ICON BLOCK */}
                          <View className="flex-row items-center justify-center mt-5 mb-3">
                            <View className="items-center mr-6">
                              <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center shadow-inner">
                                <Ionicons
                                  name={
                                    activeForecast?.icon === "sunny" ? "sunny" :
                                    activeForecast?.icon === "rainy" ? "rainy" :
                                    activeForecast?.icon === "thunderstorm" ? "thunderstorm" :
                                    activeForecast?.icon === "cloudy" ? "cloudy" : "partly-sunny"
                                  }
                                  size={30}
                                  color="white"
                                />
                              </View>
                              <Text
                                style={{ fontFamily: "Montserrat_600SemiBold" }}
                                className="text-white text-[11px] mt-1 uppercase tracking-wider"
                              >
                                {activeForecast?.desc || "Clouds"}
                              </Text>
                            </View>
                            <Text
                              style={{ fontFamily: "Montserrat_700Bold", fontSize: 44, lineHeight: 50 }}
                              className="text-white font-extrabold"
                            >
                              {activeForecast?.maxTemp || "30.3"}°C
                            </Text>
                          </View>

                          {/* METRICS GRID (3 columns x 2 rows, matching photo layout) */}
                          <View className="mt-3.5 mb-2.5">
                            {/* Row 1 */}
                            <View className="flex-row justify-between mb-2">
                              {/* Feels Like */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="thermometer-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-white/70 text-[8px] uppercase tracking-wider">Feels Like</Text>
                                  <Text style={{ fontFamily: "Montserrat_700Bold" }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.feelsLike || "30.3°C"}</Text>
                                </View>
                              </View>
                              {/* Humidity */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="water-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-white/70 text-[8px] uppercase tracking-wider">Humidity</Text>
                                  <Text style={{ fontFamily: "Montserrat_700Bold" }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.humidity || "68"}%</Text>
                                </View>
                              </View>
                              {/* Clouds */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="cloud-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-white/70 text-[8px] uppercase tracking-wider">Clouds</Text>
                                  <Text style={{ fontFamily: "Montserrat_700Bold" }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.clouds || "13"}%</Text>
                                </View>
                              </View>
                            </View>
                            {/* Row 2 */}
                            <View className="flex-row justify-between">
                              {/* Dew Point */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="snow-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-white/70 text-[8px] uppercase tracking-wider">Dew Point</Text>
                                  <Text style={{ fontFamily: "Montserrat_700Bold" }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.dewPoint || "20.47°"}</Text>
                                </View>
                              </View>
                              {/* Wind */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="flag-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-white/70 text-[8px] uppercase tracking-wider">Wind</Text>
                                  <Text style={{ fontFamily: "Montserrat_700Bold" }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.wind || "1.93KM/Hr"}</Text>
                                </View>
                              </View>
                              {/* Air Pressure */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="speedometer-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-white/70 text-[8px] uppercase tracking-wider">Pressure</Text>
                                  <Text style={{ fontFamily: "Montserrat_700Bold" }} className="text-white text-[11px] font-bold mt-0.5">1012 hPa</Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          {/* --- SCROLLABLE HOURLY TIMELINE --- */}
                          <View className="border-t border-white/20 pt-3 mt-1.5">
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ paddingRight: 10, gap: 16 }}
                            >
                              {activeHourlyList.map((h, i) => (
                                <View key={i} className="items-center px-2">
                                  <Text style={{ fontFamily: "Montserrat_500Medium", fontSize: 9 }} className="text-white/60">{h.time}</Text>
                                  <View className="my-1.5">
                                    <Ionicons
                                      name={
                                        h.icon === "sunny" ? "sunny" :
                                        h.icon === "rainy" ? "rainy" :
                                        h.icon === "thunderstorm" ? "thunderstorm" :
                                        h.icon === "cloudy" ? "cloudy" : "partly-sunny"
                                      }
                                      size={15}
                                      color="white"
                                      style={{ opacity: 0.9 }}
                                    />
                                  </View>
                                  <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 11 }} className="text-white font-bold">{Math.round(h.temp)}°C</Text>
                                </View>
                              ))}
                            </ScrollView>
                          </View>

                          {/* COHESIVE GRAPH SECTION: Scrollable Rain Intelligence line graph inside card (HOURLY BASED) */}
                          <View className="border-t border-white/20 pt-3 mt-3">
                            <Text
                              style={{ fontFamily: "Montserrat_700Bold", fontSize: 9, letterSpacing: 0.8 }}
                              className="text-white/80 uppercase mb-2"
                            >
                             Rain Probability Intelligence
                            </Text>

                            {/* --- FIXED Y-AXIS OVERLAY + SCROLLABLE GRAPH CONTAINER --- */}
                            <View className="flex-row items-center mt-1">
                              {/* Fixed Stationary Y-Axis Panel (Always visible on the left) */}
                              <View style={{ width: 35 }}>
                                <Svg height={svgHeight} width={35}>
                                  <SvgText x="28" y="18" fontSize="8" fontWeight="bold" fill="rgba(255,255,255,0.65)" textAnchor="end">100%</SvgText>
                                  <SvgText x="28" y="53" fontSize="8" fontWeight="bold" fill="rgba(255,255,255,0.65)" textAnchor="end">0%</SvgText>
                                  {/* Vertical separator line between axis and scrolling curve */}
                                  <Path d="M 34 10 L 34 75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                </Svg>
                              </View>
                              {/* Horizontally Scrollable Plot Area */}
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingRight: 10 }}
                                className="flex-1"
                              >
                                <View className="items-center justify-center">
                                  <Svg height={svgHeight} width={svgWidth} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                                    <Defs>
                                      <LinearGradient id="cardRainGrad" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor="white" stopOpacity="0.35" />
                                        <Stop offset="100%" stopColor="white" stopOpacity="0.0" />
                                      </LinearGradient>
                                    </Defs>
                                    <Path d={`M 18 50 L ${svgWidth - 18} 50`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
                                    <Path d={fillPathD} fill="url(#cardRainGrad)" />
                                    <Path
                                      d={linePathD}
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    {/* Render hourly dots, probability values, and time stamps directly inside the SVG */}
                                    {points.map((p, idx) => {
                                      // Split "12:30 AM" into "12:30" (Time) and "AM" (Descriptor) to draw them stacked in two lines
                                      const timeParts = p.label.split(" ");
                                      const timeOnly = timeParts[0] || "";
                                      const ampmOnly = timeParts[1] || "";
                                      return (
                                        <G key={idx}>
                                          <Circle cx={p.x} cy={p.y} r="3" fill="white" stroke="#398871" strokeWidth="1.5" />
                                          <SvgText
                                            x={p.x}
                                            y={p.y - 6}
                                            fontSize="7.5"
                                            fontWeight="bold"
                                            fill="white"
                                            textAnchor="middle"
                                          >
                                            {p.prob}%
                                          </SvgText>
                                          {/* Line 1: TIME (e.g. "12:30") */}
                                          <SvgText
                                            x={p.x}
                                            y="64"
                                            fontSize="8"
                                            fontWeight="700"
                                            fill="rgba(255, 255, 255, 0.9)"
                                            textAnchor="middle"
                                          >
                                            {timeOnly}
                                          </SvgText>
                                          {/* Line 2: AM / PM (e.g. "AM") */}
                                          <SvgText
                                            x={p.x}
                                            y="74"
                                            fontSize="7"
                                            fontWeight="600"
                                            fill="rgba(255, 255, 255, 0.6)"
                                            textAnchor="middle"
                                          >
                                            {ampmOnly}
                                          </SvgText>
                                        </G>
                                      );
                                    })}
                                  </Svg>
                                </View>
                              </ScrollView>
                            </View>
                          </View>
                        </>
                      ) : (
                        /* --- "NEXT WEEK" TAB --- */
                        <View className="mt-4">
                          <View className="divide-y divide-white/10">
                            {visibleDays.map((item, idx) => (
                              <View key={idx} className="flex-row items-center justify-between py-2.5">
                                <View className="flex-1">
                                  <Text
                                    style={{ fontFamily: "Montserrat_700Bold", fontSize: 12 }}
                                    className="text-white"
                                  >
                                    {item.day}
                                  </Text>
                                  <Text
                                    style={{ fontFamily: "Montserrat_500Medium", fontSize: 10 }}
                                    className="text-white/60 mt-0.5"
                                  >
                                    {item.desc}
                                  </Text>
                                </View>
                                {/* Prob Segmented Mini Bar (Unified style inside card!) */}
                                <View className="w-24 flex-row items-center justify-center mr-3">
                                  <Ionicons name="rainy" size={12} color="white" />
                                  <View className="flex-row ml-1.5 flex-1 items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <View
                                        key={i}
                                        className="flex-1 mx-[0.5px] h-1 rounded-full bg-white/10 overflow-hidden"
                                      >
                                        <View
                                          className={`h-full ${
                                            i < Math.ceil(item.rainProb / 20)
                                              ? "bg-white"
                                              : "bg-transparent"
                                          }`}
                                        />
                                      </View>
                                    ))}
                                  </View>
                                  <Text className="text-[8px] font-bold text-white ml-1">
                                    {item.rainProb}%
                                  </Text>
                                </View>
                                <View className="flex-row items-center justify-end w-16">
                                  <Ionicons
                                    name={
                                      item.icon === "sunny" ? "sunny" :
                                      item.icon === "rainy" ? "rainy" :
                                      item.icon === "thunderstorm" ? "thunderstorm" :
                                      item.icon === "cloudy" ? "cloudy" : "partly-sunny"
                                    }
                                    size={15}
                                    color="white"
                                    style={{ marginRight: 6 }}
                                  />
                                  <View className="items-end">
                                    <Text className="text-xs font-bold text-white">
                                      {item.maxTemp}°
                                    </Text>
                                    <Text className="text-[9px] text-white/60">
                                      {item.minTemp}°
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            ))}
                          </View>
                          <TouchableOpacity
                            onPress={() => setExpandedDays(!expandedDays)}
                            className="border-t border-white/10 pt-3 mt-1 items-center justify-center flex-row"
                          >
                            <Text
                              style={{ fontFamily: "Montserrat_600SemiBold", fontSize: 11 }}
                              className="text-white font-bold"
                            >
                              {expandedDays ? "Show Less Days" : "Show All 16 Days"}
                            </Text>
                            <Ionicons
                              name={expandedDays ? "chevron-up" : "chevron-down"}
                              size={14}
                              color="white"
                              style={{ marginLeft: 4 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              /* --- STUNNING, COHESIVE ORCHARD INFO TAB DASHBOARD --- */
              <View className="flex-1 space-y-4">

                {/* Section Header: Orchard Specifications (now with Edit button) */}
                <View className="flex-row items-center justify-between mb-1">
                  {/* Left: dot + title */}
                  <View className="flex-row items-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                    <Text
                      style={{ fontFamily: "Montserrat_700Bold" }}
                      className={`text-[10px] tracking-[1.2px] uppercase ${
                        isDark ? "text-white/60" : "text-green-900/60"
                      }`}
                    >
                      ORCHARD SPECIFICATIONS
                    </Text>
                  </View>

                  {/* Right: Edit button */}
                  <TouchableOpacity
                    onPress={handleEditOrchard}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Edit orchard information"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className={`flex-row items-center rounded-full px-3 py-1.5 ${
                      isDark ? "bg-emerald-950/40" : "bg-[#e8f5e9]"
                    }`}
                  >
                    <Ionicons name="create-outline" size={13} color="#469e80" />
                    <Text
                      style={{ fontFamily: "Montserrat_600SemiBold", color: "#469e80" }}
                      className="text-[10px] tracking-[0.5px] uppercase ml-1"
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Primary Specifications Card (Stacked layout) */}
                <View
                  className={`rounded-[24px] border p-5 ${
                    isDark
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-[#e2f0d9]"
                  }`}
                >
                  {/* 1. Orchard Name */}
                  <View className="flex-row items-center pb-3 border-b border-[#f1f5f9] dark:border-slate-800/60">
                    <View className="w-9 h-9 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-3.5">
                      <Ionicons name="leaf-outline" size={16} color="#469e80" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Orchard Name</Text>
                      <Text
                        style={{ fontFamily: "Montserrat_600SemiBold" }}
                        className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5"
                      >
                        {orchardData?.name || "Valley Orchard"}
                      </Text>
                    </View>
                  </View>

                  {/* 2. Crop Type */}
                  <View className="flex-row items-center py-3 border-b border-[#f1f5f9] dark:border-slate-800/60">
                    <View className="w-9 h-9 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-3.5">
                      <Ionicons name="basket-outline" size={16} color="#469e80" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Crop Type</Text>
                      <Text
                        style={{ fontFamily: "Montserrat_600SemiBold" }}
                        className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5"
                      >
                        {orchardData?.orchardType || "Apple Orchard"}
                      </Text>
                    </View>
                  </View>

                  {/* 3. Variety */}
                  <View className="flex-row items-center py-3 border-b border-[#f1f5f9] dark:border-slate-800/60">
                    <View className="w-9 h-9 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-3.5">
                      <Ionicons name="git-branch-outline" size={16} color="#469e80" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Variety</Text>
                      <Text
                        style={{ fontFamily: "Montserrat_600SemiBold" }}
                        className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5"
                      >
                        {orchardData?.variety || "Honeycrisp, Gala"}
                      </Text>
                    </View>
                  </View>

                  {/* 4. Total Area */}
                  <View className="flex-row items-center py-3 border-b border-[#f1f5f9] dark:border-slate-800/60">
                    <View className="w-9 h-9 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-3.5">
                      <Ionicons name="resize-outline" size={16} color="#469e80" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Total Area</Text>
                      <Text
                        style={{ fontFamily: "Montserrat_600SemiBold" }}
                        className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5"
                      >
                        {orchardData?.area || "14.5 Acres"}
                      </Text>
                    </View>
                  </View>

                  {/* 5. Location */}
                  <View className="flex-row items-center pt-3">
                    <View className="w-9 h-9 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-3.5">
                      <Ionicons name="location-outline" size={16} color="#469e80" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Montserrat_500Medium" }} className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Location</Text>
                      <Text
                        style={{ fontFamily: "Montserrat_600SemiBold" }}
                        className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5"
                      >
                        {orchardData?.location || resolvedCity}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Optional Note / Message Card from Orchard Setup */}
                {orchardData?.message && (
                  <View>
                    <View className="bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-amber-400 p-4 rounded-r-2xl border border-t-amber-100/30 border-r-amber-100/30 border-b-amber-100/30">
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="bookmark" size={13} color="#d97706" />
                        <Text
                          style={{ fontFamily: "Montserrat_700Bold" }}
                          className="text-[#b45309] dark:text-amber-400 text-xs font-bold ml-1.5 uppercase tracking-wide"
                        >
                          Setup Notes
                        </Text>
                      </View>
                      <Text
                        style={{ fontFamily: "Montserrat_500Medium" }}
                        className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed mt-1"
                      >
                        {orchardData.message}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ═══════════════ EDIT ORCHARD MODAL ═══════════════ */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
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
                  style={{ fontFamily: "Montserrat_700Bold" }}
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-[#1b3d2f]"
                  }`}
                >
                  Edit Orchard Info
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
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
              {[
                { key: "name", label: "Orchard Name", icon: "leaf-outline", placeholder: "e.g. Valley Orchard", multiline: false },
                { key: "orchardType", label: "Crop Type", icon: "basket-outline", placeholder: "e.g. Apple Orchard", multiline: false },
                { key: "variety", label: "Variety", icon: "git-branch-outline", placeholder: "e.g. Honeycrisp, Gala", multiline: false },
                { key: "area", label: "Total Area", icon: "resize-outline", placeholder: "e.g. 14.5 Acres", multiline: false },
                { key: "location", label: "Location", icon: "location-outline", placeholder: "e.g. Nishat, Srinagar", multiline: false },
              ].map((field) => (
                <View key={field.key} className="mb-3.5">
                  <View className="flex-row items-center mb-1.5">
                    <View className="w-7 h-7 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/30 items-center justify-center mr-2.5">
                      <Ionicons name={field.icon as any} size={14} color="#469e80" />
                    </View>
                    <Text
                      style={{ fontFamily: "Montserrat_600SemiBold" }}
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
                    style={{ fontFamily: "Montserrat_500Medium" }}
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
                  onPress={() => setShowEditModal(false)}
                  activeOpacity={0.8}
                  className={`flex-1 rounded-2xl py-4 items-center justify-center border ${
                    isDark ? "border-slate-700 bg-slate-800" : "border-[#e2f0d9] bg-white"
                  }`}
                >
                  <Text
                    style={{ fontFamily: "Montserrat_600SemiBold" }}
                    className={`text-sm ${isDark ? "text-slate-200" : "text-[#1b3d2f]"}`}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveOrchard}
                  activeOpacity={0.85}
                  className="flex-1 rounded-2xl py-4 items-center justify-center bg-emerald-600"
                >
                  <Text
                    style={{ fontFamily: "Montserrat_700Bold" }}
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
    </SafeAreaView>
  );
}
