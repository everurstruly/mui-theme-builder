import { useCurrent } from "./useCurrent";

/**
 * Checks if there is ANY unsaved work that would be lost.
 * 
 * Use this for: Blocker dialogs (load/launch/close confirmations)
 * 
 * Returns true:
 * - Saved designs: Modified since last save
 * - New designs: Any edits made (neutralEdits, schemeEdits, codeOverrides)
 * 
 * Returns false:
 * - Saved designs: No changes since save
 * - New designs: Still pristine (no edits at all)
 * 
 * This answers: "Will the user lose work if we proceed?"
 */
export function useHasUnsavedWork(): boolean {
  return useCurrent((state) => {
    const {
      checkpointHash,
      contentHash,
      neutralEdits,
      schemeEdits,
      codeOverridesSource,
    } = state;

    // For saved designs: check if dirty
    if (checkpointHash !== null) {
      return contentHash !== checkpointHash;
    }

    // For new designs: check if any edits were made
    const hasEdits =
      Object.keys(neutralEdits).length > 0 ||
      Object.keys(schemeEdits.light?.designer || {}).length > 0 ||
      Object.keys(schemeEdits.dark?.designer || {}).length > 0 ||
      Boolean(codeOverridesSource && codeOverridesSource.trim().length > 0);

    return hasEdits;
  });
}
