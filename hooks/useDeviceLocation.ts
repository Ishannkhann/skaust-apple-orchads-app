import { useEffect, useState } from "react";

import { getCurrentCoords } from "@/lib/location";

export type Coords = { lat: number; lon: number };

/**
 * Requests foreground location permission and returns the device's current
 * GPS coordinates (once, on mount).
 *
 * Graceful by design: if permission is denied or location is unavailable,
 * `coords` stays null and `error` is set — callers should fall back to the
 * orchard's saved location name. Never throws.
 */
export function useDeviceLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result = await getCurrentCoords();

      if (cancelled) return;

      if (result) {
        setCoords({ lat: result.latitude, lon: result.longitude });
      } else {
        setError("Location unavailable or permission denied");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, loading, error };
}
