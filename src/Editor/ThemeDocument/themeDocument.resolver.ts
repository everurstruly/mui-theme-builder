import type { ThemeOptions } from '@mui/material/styles';
import type { ThemeResolutionConfig } from './types';
import { expandFlatThemeOptions, deepMerge } from './themeDocument.utils';

/**
 * Resolves a complete ThemeOptions object from all layers.
 * 
 * Layer hierarchy (in order of application):
 * 1. Template (provides complete theme with full palette for color scheme)
 * 2. Composables (toggleable presets)
 * 3. Base Visual Edits (typography, spacing, shape - color-independent)
 * 4. Color Scheme Visual Edits (palette, shadows only)
 * 5. Code Overrides (global - can override any path including palette - highest priority)
 * 
 * @param config - Resolution configuration with all layers
 * @returns Merged ThemeOptions ready for createTheme()
 * 
 * @example
 * const themeOptions = resolveThemeOptions({
 *   template: materialTemplate,
 *   composables: [denseSpacing, highContrast],
 *   baseVisualEdits: { 'typography.fontSize': 16 },
 *   colorSchemeVisualEdits: { 'palette.primary.main': '#ff0000' },
 *   codeOverrides: {},
 *   colorScheme: 'light'
 * });
 */
export function resolveThemeOptions(config: ThemeResolutionConfig): ThemeOptions {
  const {
    template,
    composables,
    baseVisualEdits,
    colorSchemeVisualEdits,
    codeOverrides,
  } = config;

  // 1. Start with template base (includes full palette for color scheme)
  let resolved: ThemeOptions = { ...template };

  // 2. Apply composables (in order they were enabled)
  for (const composable of composables) {
    resolved = deepMerge(resolved as Record<string, unknown>, composable as Record<string, unknown>) as ThemeOptions;
  }

  // 3. Apply base visual edits (typography, spacing, shape, etc.)
  if (Object.keys(baseVisualEdits).length > 0) {
    const expandedBaseVisual = expandFlatThemeOptions(baseVisualEdits);
    resolved = deepMerge(resolved as Record<string, unknown>, expandedBaseVisual) as ThemeOptions;
  }

  // 4. Apply color-scheme-specific visual edits (palette, shadows)
  if (Object.keys(colorSchemeVisualEdits).length > 0) {
    const expandedColorSchemeVisual = expandFlatThemeOptions(colorSchemeVisualEdits);
    resolved = deepMerge(resolved as Record<string, unknown>, expandedColorSchemeVisual) as ThemeOptions;
  }

  // 5. Apply code overrides (global - highest priority, can override anything)
  if (codeOverrides && Object.keys(codeOverrides).length > 0) {
    resolved = deepMerge(resolved as Record<string, unknown>, codeOverrides as Record<string, unknown>) as ThemeOptions;
  }

  return resolved;
}
