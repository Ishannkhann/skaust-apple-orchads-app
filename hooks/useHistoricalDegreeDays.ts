import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { OPENWEATHER_API_KEY, isWeatherKeyConfigured } from "@/constants/weather";

interface HistoricalGDDResult {
  gdd: number;
  hasData: boolean;
  status: string;
  statusColor: string;
  loading: boolean;
  error: string | null;
}

const TBASE = 4.4;
const CACHE_PREFIX = "gdd_historical_";
const DELAY_BETWEEN_CALLS = 400; // ms - to avoid rate limiting

/**
 * Calculates Growing Degree Days from 1 January 2026 using One Call API 3.0
 * day_summary endpoint with better error handling and caching.
 */
export function useHistoricalDegreeDays(
  latitude?: number,
  longitude?: number,
  startDate: string = "2026-01-01"
): HistoricalGDDResult {
  const [result, setResult] = useState<HistoricalGDDResult>({
    gdd: 0,
    hasData: false,
    status: "No Data",
    statusColor: "#6b7280",
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!latitude || !longitude) {
      setResult((prev) => ({
        ...prev,
        hasData: false,
        error: "Latitude and Longitude are required.",
      }));
      return;
    }

    const fetchHistoricalGDD = async () => {
      const cacheKey = `${CACHE_PREFIX}${latitude.toFixed(4)}_${longitude.toFixed(4)}`;

      // Check cache first
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const daysSinceCache = Math.floor(
            (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceCache < 1) {
            const statusInfo = getStatus(parsed.gdd);
            setResult({
              gdd: parsed.gdd,
              hasData: true,
              status: statusInfo.label,
              statusColor: statusInfo.color,
              loading: false,
              error: null,
            });
            return;
          }
        }
      } catch (e) {
        console.log("Cache read error:", e);
      }

      if (!isWeatherKeyConfigured(OPENWEATHER_API_KEY)) {
        setResult((prev) => ({
          ...prev,
          error: "OpenWeather API key is not configured.",
          loading: false,
        }));
        return;
      }

      setResult((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const start = new Date(startDate);
        const today = new Date();
        let totalGDD = 0;
        let currentDate = new Date(start);
        let successfulDays = 0;
        let failedDays = 0;

        while (currentDate <= today) {
          const dateStr = currentDate.toISOString().split("T")[0];

          try {
            const url = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${latitude}&lon=${longitude}&date=${dateStr}&units=metric&appid=${OPENWEATHER_API_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
              failedDays++;
              console.warn(`Failed to fetch ${dateStr}: ${response.status}`);
            } else {
              const data = await response.json();
              const maxTemp = data.temperature?.max;
              const minTemp = data.temperature?.min;

              if (maxTemp != null && minTemp != null) {
                const avgTemp = (maxTemp + minTemp) / 2;
                const gdd = Math.max(0, avgTemp - TBASE);
                totalGDD += gdd;
                successfulDays++;
              }
            }
          } catch (dayError) {
            failedDays++;
            console.warn(`Error fetching ${dateStr}:`, dayError);
          }

          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);

          // Small delay to avoid hitting rate limits
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_CALLS)
          );
        }

        const roundedGDD = Math.round(totalGDD * 10) / 10;
        const statusInfo = getStatus(roundedGDD);

        // Only cache if we got reasonable data
        if (successfulDays > 10) {
          await AsyncStorage.setItem(
            cacheKey,
            JSON.stringify({
              gdd: roundedGDD,
              timestamp: Date.now(),
            })
          );
        }

        setResult({
          gdd: roundedGDD,
          hasData: successfulDays > 0,
          status: statusInfo.label,
          statusColor: statusInfo.color,
          loading: false,
          error:
            failedDays > 30
              ? `Some days failed to load (${failedDays} failed)`
              : null,
        });
      } catch (err: any) {
        console.error("Historical GDD fetch error:", err.message);
        setResult((prev) => ({
          ...prev,
          error: err.message || "Failed to fetch historical weather data.",
          loading: false,
        }));
      }
    };

    fetchHistoricalGDD();
  }, [latitude, longitude, startDate]);

  return result;
}

function getStatus(gdd: number) {
  if (gdd < 50) return { label: "Dormant", color: "#64748b" };
  if (gdd < 100) return { label: "Silver Tip", color: "#94a3b8" };
  if (gdd < 150) return { label: "Green Tip", color: "#22c55e" };
  if (gdd < 250) return { label: "Half-Inch Green", color: "#16a34a" };
  if (gdd < 350) return { label: "Tight Cluster", color: "#4ade80" };
  if (gdd < 500) return { label: "Pink Bud", color: "#f472b6" };
  if (gdd < 650) return { label: "First Bloom", color: "#fb7185" };
  if (gdd < 800) return { label: "Full Bloom", color: "#f43f5e" };
  if (gdd < 950) return { label: "Petal Fall", color: "#fb923c" };
  if (gdd < 1200) return { label: "Fruit Set", color: "#f59e0b" };
  if (gdd < 1800) return { label: "Early Fruit Growth", color: "#eab308" };
  if (gdd < 2500) return { label: "Fruit Enlargement", color: "#ca8a04" };
  return { label: "Maturity / Harvest", color: "#854d0e" };
}
