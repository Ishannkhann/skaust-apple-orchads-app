import Constants from "expo-constants";

import type { HourlyForecast, DailyForecast } from "@/types/weather";

/**
 * OpenWeather API key.
 *
 * SECURITY: previously hardcoded in the screen. Now read from Expo config
 * (app.json -> expo.extra.openWeatherApiKey, or the EXPO_PUBLIC_OPENWEATHER_API_KEY
 * env var). Falls back to the original placeholder so the app keeps showing
 * mock data when no key is configured — identical behavior to before.
 */
export const OPENWEATHER_API_KEY: string =
  process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ||
  (Constants.expoConfig?.extra?.openWeatherApiKey as string) ||
  "YOUR_OPENWEATHER_API_KEY";

/** True when no usable key is configured (mirrors the previous inline guard). */
export const isWeatherKeyConfigured = (key: string): boolean =>
  !(
    !key ||
    key.includes("YOUR_") ||
    key.trim() === "" ||
    key.length < 15
  );

// ─── Mock fallback weather data ───

export const MOCK_HOURLY: HourlyForecast[] = [
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

/**
 * Generates dynamic mock daily forecast data with correct current dates.
 * This ensures dates are always up-to-date even when using fallback data.
 */
export const getMockDailyForecast = (): DailyForecast[] => {
  const today = new Date();
  const days: DailyForecast[] = [];

  const mockData = [
    { desc: "Clouds", icon: "partly-sunny", maxTemp: "30.3", minTemp: "22", rainProb: 30, rainVol: "2mm", humidity: 68, wind: "1.93KM/Hr", clouds: 13, dewPoint: "20.47°", feelsLike: "30.3°" },
    { desc: "Heavy Rain", icon: "rainy", maxTemp: "22", minTemp: "14", rainProb: 90, rainVol: "18mm", humidity: 85, wind: "4.5KM/Hr", clouds: 95, dewPoint: "18.2°", feelsLike: "21.0°" },
    { desc: "Scattered Rain", icon: "thunderstorm", maxTemp: "23", minTemp: "15", rainProb: 75, rainVol: "8mm", humidity: 78, wind: "3.2KM/Hr", clouds: 80, dewPoint: "19.0°", feelsLike: "22.5°" },
    { desc: "Partly Cloudy", icon: "cloudy", maxTemp: "25", minTemp: "16", rainProb: 25, rainVol: "0.5mm", humidity: 60, wind: "2.1KM/Hr", clouds: 40, dewPoint: "17.5°", feelsLike: "24.8°" },
    { desc: "Sunny & Warm", icon: "sunny", maxTemp: "28", minTemp: "17", rainProb: 5, rainVol: "0mm", humidity: 50, wind: "1.5KM/Hr", clouds: 10, dewPoint: "15.0°", feelsLike: "27.5°" },
    { desc: "Clear Sky", icon: "sunny", maxTemp: "29", minTemp: "18", rainProb: 0, rainVol: "0mm", humidity: 45, wind: "1.2KM/Hr", clouds: 5, dewPoint: "14.2°", feelsLike: "29.0°" },
    { desc: "Light Rain", icon: "rainy", maxTemp: "24", minTemp: "16", rainProb: 60, rainVol: "3mm", humidity: 70, wind: "2.8KM/Hr", clouds: 65, dewPoint: "18.0°", feelsLike: "23.5°" },
    { desc: "Partly Sunny", icon: "partly-sunny", maxTemp: "26", minTemp: "16", rainProb: 15, rainVol: "0mm", humidity: 55, wind: "1.9KM/Hr", clouds: 25, dewPoint: "16.8°", feelsLike: "25.5°" },
    { desc: "Moderate Rain", icon: "rainy", maxTemp: "23", minTemp: "15", rainProb: 80, rainVol: "12mm", humidity: 82, wind: "3.9KM/Hr", clouds: 88, dewPoint: "19.2°", feelsLike: "22.0°" },
    { desc: "Scattered Rain", icon: "rainy", maxTemp: "24", minTemp: "14", rainProb: 70, rainVol: "6mm", humidity: 76, wind: "2.5KM/Hr", clouds: 72, dewPoint: "18.5°", feelsLike: "23.8°" },
    { desc: "Mostly Cloudy", icon: "cloudy", maxTemp: "25", minTemp: "16", rainProb: 30, rainVol: "1mm", humidity: 62, wind: "2.0KM/Hr", clouds: 48, dewPoint: "17.0°", feelsLike: "24.5°" },
    { desc: "Pleasant & Sunny", icon: "sunny", maxTemp: "27", minTemp: "17", rainProb: 10, rainVol: "0mm", humidity: 52, wind: "1.7KM/Hr", clouds: 15, dewPoint: "15.5°", feelsLike: "26.8°" },
    { desc: "Clear Sunny", icon: "sunny", maxTemp: "29", minTemp: "18", rainProb: 0, rainVol: "0mm", humidity: 48, wind: "1.1KM/Hr", clouds: 5, dewPoint: "14.5°", feelsLike: "28.5°" },
    { desc: "Afternoon Showers", icon: "thunderstorm", maxTemp: "25", minTemp: "15", rainProb: 65, rainVol: "4mm", humidity: 72, wind: "3.0KM/Hr", clouds: 70, dewPoint: "18.2°", feelsLike: "24.5°" },
    { desc: "Mostly Cloudy", icon: "cloudy", maxTemp: "24", minTemp: "15", rainProb: 40, rainVol: "2mm", humidity: 68, wind: "2.2KM/Hr", clouds: 52, dewPoint: "17.5°", feelsLike: "23.8°" },
    { desc: "Partly Sunny", icon: "partly-sunny", maxTemp: "26", minTemp: "16", rainProb: 20, rainVol: "0.2mm", humidity: 58, wind: "1.8KM/Hr", clouds: 22, dewPoint: "16.5°", feelsLike: "25.2°" },
  ];

  for (let i = 0; i < 16; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    let dayLabel: string;
    if (i === 0) {
      dayLabel = "Today";
    } else if (i === 1) {
      dayLabel = "Tomorrow";
    } else {
      dayLabel = date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }

    days.push({
      day: dayLabel,
      ...mockData[i],
    });
  }

  return days;
};

// Keep the old constant for backward compatibility (now dynamic)
export const MOCK_DAILY_16_DAYS: DailyForecast[] = getMockDailyForecast();
