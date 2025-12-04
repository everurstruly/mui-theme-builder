import { useCallback } from "react";
import type {
  LoadOptions,
  PersistenceError,
} from "../Current/useCurrent/types";
import type { LoadData } from "../New/types";
import useCurrent from "../Current/useCurrent";
import { useHasUnsavedWork } from "../Current/useHasUnsavedWork";
import useDialogs from "./useDialogs";

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
  const clearHistory = useCurrent((s) => s.clearHistory);
  const hydrate = useCurrent((s) => s.hydrate);

  const status = useDialogs((s) => s.loadStatus);
  const setStatus = useDialogs((s) => s.setLoadStatus);
  const blocker = useDialogs((s) => s.loadBlocker);
  const setBlocker = useDialogs((s) => s.setLoadBlocker);
  const hasUnsavedWork = useHasUnsavedWork();

  /**
   * Internal executor: hydrates snapshot without blocker checks
   */
  const handleLoadable = useCallback(
    async (loadData: LoadData, options: LoadOptions = {}) => {
      setStatus("loading");
      setBlocker(null);
      setLoadStatus("loading");
      setError(null);

      try {
        // Clear history if replace mode
        if (options.mode === "replace") {
          clearHistory?.();
        }

        // Hydrate store directly from snapshot
        const isSavedDesign =
          loadData.metadata.sourceType === "snapshot" &&
          !!loadData.metadata.snapshotId;

        hydrate(loadData.snapshot, { isSaved: isSavedDesign });

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
        setStatus("idle");
      } catch (error: any) {
        const persistenceError: PersistenceError = {
          code: error.code ?? "UNKNOWN",
          message: error.message ?? String(error),
        };
        setLoadStatus("error");
        setError(persistenceError);
        setStatus("idle");
        throw persistenceError;
      }
    },
    [setLoadStatus, setError, setSnapshotId, setLastSavedAt, clearHistory, hydrate]
  );

  /**
   * Public API: load using any strategy with blocker detection
   */
  const loadWithStrategy = useCallback(
    async (strategy: () => Promise<LoadData>, options: LoadOptions = {}) => {
      if (status === "loading") {
        // Prevent multiple simultaneous loads
        return;
      }

      // Check for blockers (unless explicitly skipped)
      if (!options.skipBlockerCheck && hasUnsavedWork) {
        setStatus("blocked");
        setBlocker({
          reason: "UNSAVED_CHANGES",
          context: {},
          resolutions: {
            discardAndProceed: async () => {
              const loadData = await strategy();
              handleLoadable(loadData, options);
            },
            cancel: () => {
              setStatus("idle");
              setBlocker(null);
            },
          },
        });

        return;
      }

      // No blockers - execute strategy
      const loadData = await strategy();
      await handleLoadable(loadData, options);
    },
    [hasUnsavedWork, handleLoadable, status]
  );

  return {
    load: loadWithStrategy,
    status,
    blocker,
  };
}
