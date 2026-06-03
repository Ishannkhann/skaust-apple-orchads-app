import { getJSON, getItem, removeItem, setJSON, StorageKeys } from "@/lib/storage";
import type { Orchard } from "@/types/orchard";

/**
 * Shared draft persistence for the 3-step "Add / Edit Orchard" flow.
 *
 * The flow stores progress in one of two AsyncStorage keys:
 *  - `editingOrchard` — present when editing an existing orchard (takes priority)
 *  - `newOrchard`     — the in-progress draft when creating a new orchard
 *
 * This hook centralizes the read / merge-save / final-commit logic that was
 * previously duplicated inline across add-step-1/2/3. The merge semantics are
 * preserved EXACTLY:
 *  - load: editing takes priority over new
 *  - saveStep: shallow-merge the partial onto the existing editing/new object
 *  - commit: editing -> replace in `orchards` (moved to front) + clear editing;
 *            new -> assign id (Date.now), prepend to `orchards` + clear new
 */
export function useOrchardDraft() {
  /** True if an edit is in progress (editingOrchard exists). */
  const isEditing = async (): Promise<boolean> => {
    const editing = await getItem(StorageKeys.editingOrchard);
    return !!editing;
  };

  /**
   * Read the current draft (editing takes priority over new). Returns null if
   * neither key is present.
   */
  const loadDraft = async (): Promise<{
    data: Partial<Orchard> & Record<string, any> | null;
    editing: boolean;
  }> => {
    const editing = await getJSON<any>(StorageKeys.editingOrchard, null);
    if (editing) return { data: editing, editing: true };

    const draft = await getJSON<any>(StorageKeys.newOrchard, null);
    if (draft) return { data: draft, editing: false };

    return { data: null, editing: false };
  };

  /**
   * Merge a partial step payload onto the active draft and persist it.
   * Mirrors the previous "if editingOrchard {...existing, ...data} else
   * {...newOrchard, ...data}" pattern in steps 1 & 2.
   */
  const saveStep = async (data: Record<string, any>): Promise<void> => {
    const editRaw = await getJSON<any>(StorageKeys.editingOrchard, null);

    if (editRaw) {
      await setJSON(StorageKeys.editingOrchard, { ...editRaw, ...data });
    } else {
      const existingNew = await getJSON<any>(StorageKeys.newOrchard, null);
      await setJSON(StorageKeys.newOrchard, {
        ...(existingNew ?? {}),
        ...data,
      });
    }
  };

  /**
   * Final commit (step 3): write the orchard into the `orchards` list and clear
   * the draft key.
   *
   * - When editing: replace the matching orchard (moved to the front) and
   *   remove `editingOrchard`. `finalData` values fall back to the existing
   *   orchard's values, matching the previous `area || editing.area` behavior.
   * - When creating: assign `id: Date.now()`, merge with the `newOrchard`
   *   draft, prepend to the list, and remove `newOrchard`.
   */
  const commitOrchard = async (
    finalData: { area: string; landType: string; image: string },
    editingOrchard: any | null
  ): Promise<void> => {
    const orchards = await getJSON<any[]>(StorageKeys.orchards, []);

    if (editingOrchard) {
      const updatedOrchard = {
        ...editingOrchard,
        area: finalData.area || editingOrchard.area,
        landType: finalData.landType || editingOrchard.landType,
        image: finalData.image || editingOrchard.image,
      };

      const filtered = orchards.filter((o: any) => o.id !== editingOrchard.id);
      const updated = [updatedOrchard, ...filtered];

      await setJSON(StorageKeys.orchards, updated);
      await removeItem(StorageKeys.editingOrchard);
    } else {
      const newData = await getJSON<any>(StorageKeys.newOrchard, {});

      const newOrchard = {
        id: Date.now().toString(),
        ...newData,
        area: finalData.area,
        landType: finalData.landType,
        image: finalData.image,
      };

      const updated = [newOrchard, ...orchards];

      await setJSON(StorageKeys.orchards, updated);
      await removeItem(StorageKeys.newOrchard);
    }
  };

  return { isEditing, loadDraft, saveStep, commitOrchard };
}
