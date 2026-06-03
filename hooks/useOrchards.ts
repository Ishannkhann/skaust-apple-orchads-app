import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";

import { getJSON, setJSON, StorageKeys } from "@/lib/storage";
import type { Orchard } from "@/types/orchard";

type UseOrchardsOptions = {
  /**
   * When true, filters out incomplete orchard objects (those missing an `id`
   * or `name`). Matches the guard that my-orchards.tsx previously applied in
   * its own loader. Home does not set this, so its behavior is unchanged.
   */
  sanitize?: boolean;
};

/**
 * Orchard data + persistence (data-only).
 *
 * Reloads the orchard list whenever the screen regains focus (matches the
 * previous `useFocusEffect(loadOrchards)` behavior in home.tsx and
 * my-orchards.tsx). Navigation and the delete-confirmation Alert intentionally
 * stay in the screens.
 *
 * Storage behavior is identical to the previous inline AsyncStorage calls,
 * just centralized through lib/storage.
 */
export function useOrchards(options: UseOrchardsOptions = {}) {
  const { sanitize = false } = options;

  const [orchards, setOrchards] = useState<Orchard[]>([]);

  const loadOrchards = useCallback(async () => {
    try {
      const saved = await getJSON<Orchard[] | null>(StorageKeys.orchards, null);
      if (saved) {
        setOrchards(sanitize ? saved.filter((o) => o?.id && o?.name) : saved);
      }
    } catch (err) {
      console.log(err);
    }
  }, [sanitize]);

  // Reload on focus (same as the previous useFocusEffect in both screens).
  useFocusEffect(
    useCallback(() => {
      loadOrchards();
    }, [loadOrchards])
  );

  /** Remove an orchard by id and persist. (Caller handles confirmation UI.) */
  const removeOrchard = useCallback(
    async (id: string) => {
      const updated = orchards.filter((o) => o.id !== id);
      setOrchards(updated);
      await setJSON(StorageKeys.orchards, updated);
    },
    [orchards]
  );

  return { orchards, setOrchards, loadOrchards, removeOrchard };
}
