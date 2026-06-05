import type { HourlyForecast } from "@/types/weather";

/**
 * Custom mathematical interpolation engine to convert 3-hour forecasts into
 * 1-hour increments. Extracted verbatim from orchard-detail.tsx (the noisy
 * console.log was removed; logic is otherwise unchanged).
 */
export function interpolateToHourly(threeHourList: any[]): HourlyForecast[] {
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
      const stepTimeStr = `${displayHour}:${String(min).padStart(2, "0")} ${displayAmpm}`;

      const ratio = step / diffHours;
      // Smooth linear interpolation of temperatures and rain probabilities
      const interpolatedTemp = cur.temp + ratio * (nxt.temp - cur.temp);
      const interpolatedProb = Math.round(
        cur.rainProb + ratio * (nxt.rainProb - cur.rainProb)
      );
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
