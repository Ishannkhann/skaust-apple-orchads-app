/**
 * Weather types for the orchard-detail screen.
 * Extracted from the previously-inline shapes.
 */
export type HourlyForecast = {
  time: string;
  temp: number;
  icon: string;
  rainProb: number;
  rainVol?: string;
  desc?: string;
};

export type DailyForecast = {
  day: string;
  desc: string;
  icon: string;
  /**
   * Stored as a string. The live API mapper produces these via `.toFixed(1)`,
   * so the mock data uses strings too (they are only ever rendered as text).
   * This also resolves the previous number-vs-string type mismatch.
   */
  maxTemp: string;
  minTemp: string;
  rainProb: number;
  rainVol: string;
  humidity: number;
  wind: string;
  clouds: number;
  dewPoint: string;
  feelsLike: string;
};

export type WeatherData = {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};
