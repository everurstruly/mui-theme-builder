import useCurrentDesign from "./useCurrent";

/**
 * Hook: useHasUnsavedModifications
 * Selects and computes the unsaved-changes boolean using the store selector.
 * Avoids calling `get()` directly and keeps the component reactive to changes.
 */
export default function useHasUnsavedModifications(): boolean {
  return useCurrentDesign((s) => s.modificationVersion !== s.lastStoredModificationVersion);
}
