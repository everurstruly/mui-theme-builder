import type { ThemeOptions } from "@mui/material/styles";
import { deepMerge, expandFlatThemeOptions, type SerializableValue } from "../utilities/objectOps";

export default function createThemeOptionsFromEdits(
  config: ThemeResolutionConfig
): ThemeOptions {
  const {
    template,
    baseVisualToolEdits,
    colorSchemeVisualToolEdits,
    codeOverrides,
  } = config;

  // 1. Start with template base (includes full palette for color scheme)
  let resolved: ThemeOptions = { ...template };

  // 2. Apply base visual edits (typography, spacing, shape, component defaults, etc.)
  if (Object.keys(baseVisualToolEdits).length > 0) {
    const expandedBaseVisual = expandFlatThemeOptions(baseVisualToolEdits);
    resolved = deepMerge(
      resolved as Record<string, unknown>,
      expandedBaseVisual
    ) as ThemeOptions;
  }

  // 3. Apply color-scheme-specific visual edits (palette, shadows)
  if (Object.keys(colorSchemeVisualToolEdits).length > 0) {
    const expandedColorSchemeVisual = expandFlatThemeOptions(
      colorSchemeVisualToolEdits
    );
    resolved = deepMerge(
      resolved as Record<string, unknown>,
      expandedColorSchemeVisual
    ) as ThemeOptions;
  }

  // 4. Apply code overrides (global - highest priority, can override anything)
  if (codeOverrides && Object.keys(codeOverrides).length > 0) {
    resolved = deepMerge(
      resolved as Record<string, unknown>,
      codeOverrides as Record<string, unknown>
    ) as ThemeOptions;
  }

  return resolved;
}

/**
 * Configuration for resolving a complete theme from all layers.
 */
export interface ThemeResolutionConfig {
  /** Base template ThemeOptions (full theme for color scheme) */
  template: ThemeOptions;

  /** Base visual edits (typography, spacing, shape, component defaults) */
  baseVisualToolEdits: Record<string, SerializableValue>;

  /** Color-scheme-specific visual edits (palette.*, shadows) */
  colorSchemeVisualToolEdits: Record<string, SerializableValue>;

  /** Code overrides (global - can override any path including palette) */
  codeOverrides: ThemeOptions;

  /** Target color scheme */
  colorScheme: "light" | "dark";
}
