import { useEffect, useState } from "react";

import {
  OPENWEATHER_API_KEY,
  isWeatherKeyConfigured,
  MOCK_HOURLY,
  MOCK_DAILY_16_DAYS,
} from "@/constants/weather";
import type { WeatherData } from "@/types/weather";

/**
 * Fetches + maps the OpenWeather 5-day forecast for an orchard's location.
 *
 * Behavior is identical to the previous inline `fetchWeather` effect in
 * orchard-detail.tsx:
 *  - falls back to mock data (with an error message) when no key is configured
 *  - fetches by city name, retries with "Srinagar" on 404
 *  - maps hourly (16 steps) + daily (grouped) and pads daily to 16 entries
 *
 * SECURITY: the API key now comes from config (constants/weather), and the
 * noisy console.log/console.warn calls have been removed. The console.error in
 * the catch is kept (it surfaces real failures) but no longer logs secrets.
 */
export function useOrchardWeather(location: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [resolvedCity, setResolvedCity] = useState<string>(location || "Nishat");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    hourly: MOCK_HOURLY,
    daily: MOCK_DAILY_16_DAYS,
  });

  useEffect(() => {
    async function fetchWeather() {
      const originalLocation = location || "Nishat";

      // Clean up the location string (take first part before any comma/slash)
      const city = originalLocation.split(/[,/]/)[0].trim() || "Nishat";

      // Foolproof check: if key is unconfigured, show simulated weather data
      if (!isWeatherKeyConfigured(OPENWEATHER_API_KEY)) {
        setWeatherError("API Key is unconfigured. Showing simulated weather data.");
        return;
      }

      setLoading(true);
      setWeatherError(null);

      try {
        // Fetch directly using City Name (eliminating geocoding extra step entirely!)
        let forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            city
          )}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        // 401: Invalid key / non-activated key
        if (forecastRes.status === 401) {
          throw new Error(
            "Invalid API Key (401 Unauthorized). Note: Newly created OpenWeather keys take up to 2-3 hours to activate."
          );
        }

        // 404: City name not found. Fallback to Srinagar.
        if (forecastRes.status === 404) {
          forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=Srinagar&units=metric&appid=${OPENWEATHER_API_KEY}`
          );
          if (!forecastRes.ok) {
            throw new Error(
              `Default city Srinagar fallback failed (status ${forecastRes.status})`
            );
          }
        }

        if (!forecastRes.ok) {
          throw new Error(`API request failed with status ${forecastRes.status}`);
        }

        const forecastData = await forecastRes.json();

        if (forecastData && forecastData.list) {
          // Get the resolved city name from the API response
          const resolvedName = forecastData.city?.name || city;
          setResolvedCity(resolvedName);

          // Map Hourly Forecast (next 16 steps = 48 hours)
          const mappedHourly = forecastData.list
            .slice(0, 16)
            .map((item: any) => {
              const date = new Date(item.dt * 1000);
              const timeStr = date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              });

              let iconName = "partly-sunny";
              if (item.weather[0].main === "Rain") iconName = "rainy";
              else if (item.weather[0].main === "Clear") iconName = "sunny";
              else if (item.weather[0].main === "Clouds") iconName = "cloudy";
              else if (item.weather[0].main === "Thunderstorm")
                iconName = "thunderstorm";

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
            const dayStr = date.toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

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
            const rainProb = Math.round(
              Math.max(...dailyMap[dayKey].rainProbs) * 100
            );
            const rainVolSum = Math.round(dailyMap[dayKey].rainVols);

            const avgHumidity = Math.round(
              dailyMap[dayKey].humidityList.reduce((a: any, b: any) => a + b, 0) /
                dailyMap[dayKey].humidityList.length
            );
            const avgWind = (
              (dailyMap[dayKey].windList.reduce((a: any, b: any) => a + b, 0) /
                dailyMap[dayKey].windList.length) *
              3.6
            ).toFixed(2); // Convert m/s to km/h
            const avgClouds = Math.round(
              dailyMap[dayKey].cloudsList.reduce((a: any, b: any) => a + b, 0) /
                dailyMap[dayKey].cloudsList.length
            );

            let iconName = "partly-sunny";
            let desc = "Partly Cloudy";
            const weather = dailyMap[dayKey].weatherMain;
            if (weather === "Rain") {
              iconName = "rainy";
              desc = "Rainy";
            } else if (weather === "Clear") {
              iconName = "sunny";
              desc = "Sunny";
            } else if (weather === "Clouds") {
              iconName = "cloudy";
              desc = "Clouds";
            } else if (weather === "Thunderstorm") {
              iconName = "thunderstorm";
              desc = "Stormy";
            }

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
              dewPoint: `${Math.round(minTemp - (100 - avgHumidity) / 5)}°`,
              feelsLike: `${Math.round(maxTemp)}°`,
            };
          });

          // Extrapolate remaining days to complete 16 full slots
          const finalDailyList = [...mappedDaily];
          for (let i = finalDailyList.length; i < 16; i++) {
            const baseMock = MOCK_DAILY_16_DAYS[i] || MOCK_DAILY_16_DAYS[i % 16];
            const dateOffset = new Date();
            dateOffset.setDate(dateOffset.getDate() + i);
            const dayStr = dateOffset.toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            finalDailyList.push({
              ...baseMock,
              day: dayStr,
            });
          }

          setWeatherData({
            hourly: mappedHourly,
            daily: finalDailyList,
          });
        }
      } catch (err: any) {
        console.error("Weather fetch error:", err.message);
        setWeatherError(err.message || "Failed to fetch weather.");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  return { loading, weatherError, resolvedCity, setResolvedCity, weatherData };
}
