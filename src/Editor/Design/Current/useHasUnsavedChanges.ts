import useCurrentDesign from "./useCurrent";

/**
 * Hook: useHasUnsavedChanges
 * Selects and computes the unsaved-changes boolean using the store selector.
 * Avoids calling `get()` directly and keeps the component reactive to changes.
 */
export default function useHasUnsavedChanges(): boolean {
  return useCurrentDesign((s) => s.version !== s.savedVersion);
}
