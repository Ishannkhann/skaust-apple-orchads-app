import { useMemo } from "react";
import type { DailyForecast } from "@/types/weather";

/**
 * Calculates cumulative Growing Degree Days (GDD) from daily forecast data.
 *
 * Formula: GDD = ((Tmax + Tmin) / 2) - Tbase
 * Tbase for apple = 4.4°C
 *
 * This uses the daily data already fetched by useOrchardWeather (API 2.5).
 */
export function useGrowingDegreeDays(dailyData: DailyForecast[] = []) {
  return useMemo(() => {
    if (!dailyData || dailyData.length === 0) {
      return {
        gdd: 0,
        hasData: false,
        status: "No Data",
        statusColor: "#6b7280",
      };
    }

    const Tbase = 4.4;
    let totalGDD = 0;

    dailyData.forEach((day) => {
      const maxTemp = parseFloat(day.maxTemp);
      const minTemp = parseFloat(day.minTemp);

      if (!isNaN(maxTemp) && !isNaN(minTemp)) {
        const avgTemp = (maxTemp + minTemp) / 2;
        const gdd = Math.max(0, avgTemp - Tbase);
        totalGDD += gdd;
      }
    });

    const roundedGDD = Math.round(totalGDD * 10) / 10;

    // Determine status
    let status = "Early Season";
    let statusColor = "#3b82f6";

    if (roundedGDD >= 50 && roundedGDD < 150) {
      status = "Active Growing";
      statusColor = "#22c55e";
    } else if (roundedGDD >= 150 && roundedGDD < 300) {
      status = "Near Bloom";
      statusColor = "#f59e0b";
    } else if (roundedGDD >= 300) {
      status = "Post Bloom";
      statusColor = "#f97316";
    }

    return {
      gdd: roundedGDD,
      hasData: true,
      status,
      statusColor,
    };
  }, [dailyData]);
}
