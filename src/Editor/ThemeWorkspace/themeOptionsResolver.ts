import type { ThemeOptions } from "@mui/material/styles";
import type { ResolutionMode } from "./types";
// import { useThemeWorkspaceStore } from "./themeWorkspaceStore";
import { expandFlatThemeOptions } from "./utils/expandFlatThemeOptions";
import { hydrateFunctionsSafely } from "./utils/hydrateFunctionsSafely";

/**
 * Resolves the complete ThemeOptions from stored modifications.
 *
 * NEW ARCHITECTURE (Apply-Once):
 * - Base theme and composables are already merged into modifications
 * - No dynamic layering needed
 * - Simply expand the flat modifications and hydrate functions
 *
 * @param mode - Resolution mode:
 *   - 'raw': strict evaluation (throws on errors) - for committed/export themes
 *   - 'failsafe': safe evaluation (fallbacks on errors) - for live preview
 * @param includeRawBuffer - Include transient raw buffer for live preview
 * @returns Complete ThemeOptions ready for MUI's createTheme()
 */
export const resolveThemeOptions = (
  mode: ResolutionMode = "raw",
  includeRawBuffer = false
): ThemeOptions => {
  // const {
  //   resolvedThemeOptionsModifications: { literals, functions },
  //   rawThemeOptionsModifications,
  // } = useThemeWorkspaceStore.getState();
  const literals = {};
  const functions = {};
  const rawThemeOptionsModifications = {};

  // Start with literals (already contains base + composables + user edits)
  let theme = expandFlatThemeOptions(literals);

  // Apply functions (hydrated)
  if (Object.keys(functions).length > 0) {
    try {
      const hydratedFunctions = hydrateFunctionsSafely(functions, mode, theme);
      const functionLayer = expandFlatThemeOptions(hydratedFunctions);

      // Merge function layer into theme
      theme = { ...theme, ...functionLayer };
    } catch (error) {
      console.error("[ThemeWorkspace] Failed to hydrate functions:", error);
      if (mode === "raw") {
        throw error;
      }
    }
  }

  // Apply raw buffer (transient edits) for live preview
  if (includeRawBuffer && Object.keys(rawThemeOptionsModifications).length > 0) {
    try {
      const rawLayer = expandFlatThemeOptions(rawThemeOptionsModifications);
      theme = { ...theme, ...rawLayer };
    } catch (error) {
      console.error("[ThemeWorkspace] Failed to apply raw modifications:", error);
      if (mode === "raw") {
        throw error;
      }
    }
  }

  return theme;
};

/**
 * Resolves theme options for live preview (failsafe mode).
 * Includes raw buffer for live editing updates.
 * Convenience wrapper around resolveThemeOptions('failsafe', true).
 */
export const resolveThemeOptionsForPreview = (): ThemeOptions => {
  return resolveThemeOptions("failsafe", true);
};

/**
 * Resolves theme options for export/committed state (raw mode).
 * Does NOT include raw buffer - only committed changes.
 * Convenience wrapper around resolveThemeOptions('raw', false).
 */
export const resolveThemeOptionsForExport = (): ThemeOptions => {
  return resolveThemeOptions("raw", false);
};
