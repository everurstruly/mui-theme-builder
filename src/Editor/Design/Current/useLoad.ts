import { useState, useCallback } from "react";
import { useCurrent } from "../Current/useCurrent";
import { useHasUnsavedWork } from "../Current/useHasUnsavedWork";
import type {
  LoadOptions,
  LoadBlocker,
  PersistenceError,
} from "./useCurrent/types";
import type { LoadData } from "./loadStrategies";

/**
 * Universal Load Hook (Strategy Pattern)
 * 
 * Accepts any data provider strategy. You control what to load:
 * 
 * @example
 * const { load } = useLoad();
 * 
 * // Load from snapshot
 * load(() => loadFromSnapshot(id, storage));
 * 
 * // Load from template
 * load(() => loadFromTemplate("material"));
 * 
 * // Load blank
 * load(() => loadBlank());
 * 
 * // Custom strategy (URL, clipboard, etc.)
 * load(async () => ({
 *   commands: [...],
 *   metadata: { sourceType: "custom", title: "..." }
 * }));
 */
export function useLoad() {
  // Get persistence state setters from useCurrent
  const setLoadStatus = useCurrent((s) => s.setLoadStatus);
  const setError = useCurrent((s) => s.setPersistenceError);
  const setSnapshotId = useCurrent((s) => s.setPersistenceSnapshotId);
  const setLastSavedAt = useCurrent((s) => s.setPersistedAt);
  
  const hasUnsavedWork = useHasUnsavedWork();

  const [localStatus, setLocalStatus] = useState<"idle" | "loading" | "blocked">(
    "idle"
  );
  const [blocker, setBlocker] = useState<LoadBlocker | null>(null);

  /**
   * Internal executor: hydrates snapshot without blocker checks
   */
  const executeLoad = useCallback(
    async (loadData: LoadData, options: LoadOptions = {}) => {
      setLocalStatus("loading");
      setBlocker(null);
      setLoadStatus("loading");
      setError(null);

      try {
        const editStore = useCurrent.getState();

        // Clear history if replace mode
        if (options.mode === "replace") {
          editStore.clearHistory?.();
        }

        // Hydrate store directly from snapshot
        const isSavedDesign = loadData.metadata.sourceType === "snapshot" && !!loadData.metadata.snapshotId;
        editStore.hydrate(loadData.snapshot, { isSaved: isSavedDesign });

        // Update persistence context based on source type
        if (isSavedDesign) {
          // Loading from saved snapshot - update persistence context
          setSnapshotId(loadData.metadata.snapshotId!);
          setLastSavedAt(loadData.metadata.updatedAt ?? Date.now());
        } else {
          // Loading new design (template, blank, etc.) - clear persistence context
          setSnapshotId(null);
          setLastSavedAt(null);
        }

        setLoadStatus("idle");
        setLocalStatus("idle");
      } catch (error: any) {
        const persistenceError: PersistenceError = {
          code: error.code ?? "UNKNOWN",
          message: error.message ?? String(error),
        };
        setLoadStatus("error");
        setError(persistenceError);
        setLocalStatus("idle");
        throw persistenceError;
      }
    },
    [setLoadStatus, setError, setSnapshotId, setLastSavedAt]
  );

  /**
   * Public API: load using any strategy with blocker detection
   */
  const load = useCallback(
    async (strategy: () => Promise<LoadData>, options: LoadOptions = {}) => {
      // Check for blockers (unless explicitly skipped)
      if (!options.skipBlockerCheck && hasUnsavedWork) {
        setLocalStatus("blocked");
        setBlocker({
          reason: "UNSAVED_CHANGES",
          context: {},
          resolutions: {
            discardAndProceed: async () => {
              const loadData = await strategy();
              executeLoad(loadData, options);
            },
            cancel: () => {
              setLocalStatus("idle");
              setBlocker(null);
            },
          },
        });
        return;
      }

      // No blockers - execute strategy
      const loadData = await strategy();
      await executeLoad(loadData, options);
    },
    [hasUnsavedWork, executeLoad]
  );

  return {
    load,
    status: localStatus,
    blocker,
  };
}
