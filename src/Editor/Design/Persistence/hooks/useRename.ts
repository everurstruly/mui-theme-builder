/**
 * useRename Hook
 *
 * Provides rename functionality with automatic persistence for saved designs.
 * Components don't need to know about snapshots, persistence state, etc.
 */

import { useCallback, useState, useMemo } from "react";
import { usePersistence } from "../usePersistence";
import { usePersistenceStore } from "../persistenceStore";
import { getPersistenceDependencies } from "../persistenceRegistry";
import useCurrent from "../../Current/useCurrent";
import type { ConflictInfo } from "../types";

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

export function useRename() {
  const { save } = usePersistence();
  const currentSnapshotId = usePersistenceStore((s) => s.currentSnapshotId);
  const title = useCurrent((s) => s.title);
  const setTitle = useCurrent((s) => s.setTitle);

  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const isSavedDesign = !!currentSnapshotId;

  const checkTitle = useMemo(() => {
    return debounce(async (title: string) => {
      setIsChecking(true);

      try {
        const { adapter } = getPersistenceDependencies();
        const existing = await adapter.findByTitle(title);

        const result =
          existing && existing.length > 0
            ? {
                type: "title" as const,
                existingId: existing[0].id,
                existingTitle: existing[0].title,
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
  }, []);

  /**
   * Rename the current design.
   * If the design is saved, automatically persists the new name.
   * If the design is unsaved, just updates the in-memory title.
   */
  const rename = useCallback(
    async (newTitle: string, options?: { force?: boolean }) => {
      console.debug('[useRename] rename -> setTitle', newTitle);
      setTitle(newTitle);

      // If this is a saved design, persist the rename immediately
      if (isSavedDesign) {
        console.debug('[useRename] saving persisted title', newTitle);
        const saveArgs: any = { 
          title: newTitle,
          // Default to "fail" to prevent accidental overwrites; allow force override
          onConflict: options?.force ? "overwrite" : "fail"
        };
        await save(saveArgs);
        console.debug('[useRename] save completed for', newTitle);
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
    checkTitle,
    conflict,
    isChecking,
    hasConflict: conflict !== null,
  };
}
