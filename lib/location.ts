import * as Location from "expo-location";

export type Coords = { latitude: number; longitude: number };

/**
 * One-shot GPS fetch with permission request.
 *
 * Returns coordinates on success, or null if permission is denied / location
 * is unavailable. Never throws — callers decide how to handle null (e.g. show
 * an alert and keep the typed location name).
 */
export async function getCurrentCoords(): Promise<Coords | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  } catch {
    return null;
  }
}
