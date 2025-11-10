import type { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import type { ResolutionMode } from './types';
import { useThemeSheetStore } from './stores/themeWorkspace.store';
import { expandFlatThemeOptions } from './utils/expandFlatThemeOptions';
import { hydrateFunctionsSafely } from './utils/hydrateFunctionsSafely';
import { getStaticBaseThemeOptions } from './baseThemes';
import { getComposableById } from './appearanceComposables';

/**
 * Resolves the complete ThemeOptions from all layers:
 * 1. Active base theme
 * 2. Enabled appearance composables
 * 3. User literal modifications
 * 4. User function modifications (hydrated)
 *
 * @param mode - Resolution mode:
 *   - 'raw': strict evaluation (throws on errors) - for committed/export themes
 *   - 'failsafe': safe evaluation (fallbacks on errors) - for live preview
 * @returns Complete ThemeOptions ready for MUI's createTheme()
 */
export const resolveThemeOptions = (mode: ResolutionMode = 'raw'): ThemeOptions => {
  const {
    activeBaseThemeOption,
    appearanceComposablesState,
    resolvedThemeOptionsModifications: { literals, functions },
    colorScheme,
  } = useThemeSheetStore.getState();

  // Layer 1: Base theme with correct palette for color scheme
  let theme = getStaticBaseThemeOptions(activeBaseThemeOption.ref, colorScheme);

  // Layer 2: Apply composables (removed old palette.mode override)
  Object.entries(appearanceComposablesState).forEach(([id, { enabled }]) => {
    if (enabled) {
      try {
        const composable = getComposableById(id);
        const composableValue =
          typeof composable.value === 'function' ? composable.value(theme) : composable.value;
        theme = deepmerge(theme, composableValue);
      } catch (error) {
        console.error(`[ThemeSheet] Failed to apply composable "${id}":`, error);
        if (mode === 'raw') {
          throw error;
        }
      }
    }
  });

  // Layer 3: Apply user literals
  const literalLayer = expandFlatThemeOptions(literals);
  theme = deepmerge(theme, literalLayer);

  // Layer 4: Apply user functions (hydrated)
  if (Object.keys(functions).length > 0) {
    try {
      const hydratedFunctions = hydrateFunctionsSafely(functions, mode, theme);
      const functionLayer = expandFlatThemeOptions(hydratedFunctions);
      theme = deepmerge(theme, functionLayer);
    } catch (error) {
      console.error('[ThemeSheet] Failed to hydrate functions:', error);
      if (mode === 'raw') {
        throw error;
      }
    }
  }

  // Note: Don't set palette.mode here - let MUI handle it via colorSchemes + ThemeProvider defaultMode
  return theme;
};

/**
 * Resolves theme options for live preview (failsafe mode).
 * Convenience wrapper around resolveThemeOptions('failsafe').
 */
export const resolveThemeOptionsForPreview = (): ThemeOptions => {
  return resolveThemeOptions('failsafe');
};

/**
 * Resolves theme options for export/committed state (raw mode).
 * Convenience wrapper around resolveThemeOptions('raw').
 */
export const resolveThemeOptionsForExport = (): ThemeOptions => {
  return resolveThemeOptions('raw');
};

