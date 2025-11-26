import useDesignStore from "./currentStore";

/**
 * Hook: useHasUnsavedChanges
 * Selects and computes the unsaved-changes boolean using the store selector.
 * Avoids calling `get()` directly and keeps the component reactive to changes.
 */
export default function useHasUnsavedChanges(): boolean {
  return useDesignStore((s) => s.version !== s.savedVersion);
}
