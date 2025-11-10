import type { ThemeOptions } from '@mui/material/styles';
import type { ThemeResolutionConfig } from './types';
import { expandFlatThemeOptions, deepMerge } from './themeDesign.utils';

/**
 * Resolves a complete ThemeOptions object from all layers.
 * 
 * Layer hierarchy (in order of application):
 * 1. Template (provides complete theme with full palette for color scheme)
 * 2. Base Visual Edits (typography, spacing, shape, component defaults - color-independent)
 * 3. Color Scheme Visual Edits (palette, shadows only)
 * 4. Code Overrides (global - can override any path including palette - highest priority)
 * 
 * @param config - Resolution configuration with all layers
 * @returns Merged ThemeOptions ready for createTheme()
 * 
 * @example
 * const themeOptions = resolveThemeOptions({
 *   template: materialTemplate,
 *   baseVisualEdits: { 'typography.fontSize': 16, 'components.MuiButton.defaultProps.size': 'small' },
 *   colorSchemeVisualEdits: { 'palette.primary.main': '#ff0000' },
 *   codeOverrides: {},
 *   colorScheme: 'light'
 * });
 */
export function resolveThemeOptions(config: ThemeResolutionConfig): ThemeOptions {
  const {
    template,
    baseVisualEdits,
    colorSchemeVisualEdits,
    codeOverrides,
  } = config;

  // 1. Start with template base (includes full palette for color scheme)
  let resolved: ThemeOptions = { ...template };

  // 2. Apply base visual edits (typography, spacing, shape, component defaults, etc.)
  if (Object.keys(baseVisualEdits).length > 0) {
    const expandedBaseVisual = expandFlatThemeOptions(baseVisualEdits);
    resolved = deepMerge(resolved as Record<string, unknown>, expandedBaseVisual) as ThemeOptions;
  }

  // 3. Apply color-scheme-specific visual edits (palette, shadows)
  if (Object.keys(colorSchemeVisualEdits).length > 0) {
    const expandedColorSchemeVisual = expandFlatThemeOptions(colorSchemeVisualEdits);
    resolved = deepMerge(resolved as Record<string, unknown>, expandedColorSchemeVisual) as ThemeOptions;
  }

  // 4. Apply code overrides (global - highest priority, can override anything)
  if (codeOverrides && Object.keys(codeOverrides).length > 0) {
    resolved = deepMerge(resolved as Record<string, unknown>, codeOverrides as Record<string, unknown>) as ThemeOptions;
  }

  return resolved;
}

