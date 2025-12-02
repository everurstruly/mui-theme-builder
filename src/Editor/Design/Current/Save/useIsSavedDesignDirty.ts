import { useCurrent } from "../useCurrent";

/**
 * Checks if a SAVED design has been modified since last save.
 * 
 * Use this for: Save button UI state (showing "Saved ✓" badge)
 * 
 * Returns true:
 * - Design was saved before AND content changed since checkpoint
 * 
 * Returns false:
 * - Brand new designs (never saved) - always return false
 * - Saved designs with no changes
 * 
 * Note: This is NOT for blocker detection. Use useHasUnsavedWork for that.
 */
export function useIsSavedDesignDirty(): boolean {
  return useCurrent((state) => {
    const { checkpointHash, contentHash } = state;
    return checkpointHash !== null && contentHash !== checkpointHash;
  });
}
