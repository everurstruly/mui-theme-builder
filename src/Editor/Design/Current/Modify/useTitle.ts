import { useCallback, useState, useMemo } from "react";
import type { ConflictInfo } from "../useCurrent/types";
import { useStorage } from "../../storage/useStorage";
import useCurrent from "../useCurrent";
import { useSave } from "../Save/useSave";

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function useTitle() {
  const storage = useStorage();
  const { save } = useSave();
  const currentSnapshotId = useCurrent((s) => s.persistenceSnapshotId);
  const title = useCurrent((s) => s.title);
  const setTitle = useCurrent((s) => s.setTitle);

  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const isSavedDesign = !!currentSnapshotId;

  const validateNewTitle = useMemo(() => {
    return debounce(async (t: string) => {
      const title = t.trim();
      setIsChecking(true);

      try {
        const existing = await storage.adapter.findByTitle(title);

        // Filter out the current design's own ID to prevent self-conflict
        const conflict =
          existing && existing.length > 0
            ? existing.find((item: any) => item.id !== currentSnapshotId)
            : null;

        const result = conflict
          ? {
              type: "title" as const,
              existingId: conflict.id,
              existingTitle: conflict.title,
              currentTitle: title,
            }
          : null;

        setConflict(result);
      } catch (error) {
        console.error("Title validation error:", error);
        setConflict(null);
      } finally {
        setIsChecking(false);
      }
    }, 300);
  }, [storage.adapter, currentSnapshotId]);

  /**
   * Rename the current design.
   * If the design is saved, automatically persists the new name.
   * If the design is unsaved, just updates the in-memory title.
   */
  const rename = useCallback(
    async (newTitle: string, options?: { force?: boolean }) => {
      console.debug("[useTitle] rename -> setTitle", newTitle);
      setTitle(newTitle);

      // If this is a saved design, persist the rename immediately
      if (isSavedDesign) {
        console.debug("[useTitle] saving persisted title", newTitle);
        const saveArgs: any = {
          title: newTitle,
          // Default to "fail" to prevent accidental overwrites; allow force override
          onConflict: options?.force ? "overwrite" : "fail",
        };
        await save(saveArgs);
        console.debug("[useTitle] save completed for", newTitle);
        return { persisted: true, title: newTitle };
      }

      // Unsaved design - just updated in-memory
      return { persisted: false, title: newTitle };
    },
    [setTitle, isSavedDesign, save]
  );

  return {
    title,
    rename,
    isSavedDesign,
    validateNewTitle,
    conflict,
    isChecking,
    hasConflict: conflict !== null,
  };
}
