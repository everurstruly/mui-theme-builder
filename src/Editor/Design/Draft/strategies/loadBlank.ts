import { createFreshSnapshot } from "../../storage/createFreshSnapshot";
import { validateSnapshot } from "../../storage/validateSnapshot";
import type { LoadData } from "../types";

/**
 * Load blank design
 */

export async function loadBlank(): Promise<LoadData> {
  // Use factory to ensure consistency
  const snapshot = createFreshSnapshot({
    id: '', // Empty = unsaved/blank
    title: "Untitled Design",
    baseThemeDsl: {},
    sourceLabel: "Blank Design",
  });

  // Validate before returning
  validateSnapshot(snapshot, "blank");

  return {
    snapshot,
    metadata: {
      title: "Untitled Design",
      sourceType: "blank",
    },
  };
}
