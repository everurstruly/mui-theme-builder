import type { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import type { ThemeResolutionMode } from './types';
import { expandFlatThemeOptions, hydrateFunctions } from './themeSheet.utils';
import { getThemeTemplate } from './themeTemplates';
import { getThemePreset } from './themePresets';

/**
 * Cache for resolved theme options to avoid redundant computation.
 * Invalidated when any relevant state changes.
 */
let cachedThemeOptions: ThemeOptions | null = null;
let cacheKey: string | null = null;

/**
 * Generates a cache key from current theme state.
 * Used to determine if we can reuse cached theme options.
 */
function generateCacheKey(
  templateId: string,
  colorScheme: string,
  enabledPresets: Record<string, boolean>,
  flatLiterals: Record<string, unknown>,
  flatFunctions: Record<string, string>
): string {
  return JSON.stringify({
    templateId,
    colorScheme,
    enabledPresets,
    flatLiterals,
    flatFunctions,
  });
}

/**
 * Resolves the complete ThemeOptions from all layers:
 * 1. Selected theme template
 * 2. Enabled theme presets
 * 3. User literal edits (flat structure)
 * 4. User function edits (hydrated)
 *
 * Uses caching to avoid redundant computation when state hasn't changed.
 *
 * @param params - Resolution parameters
 * @returns Complete ThemeOptions ready for MUI's createTheme()
 */
export function resolveThemeOptions(params: {
  templateId: string;
  colorScheme: 'light' | 'dark';
  enabledPresets: Record<string, boolean>;
  flatLiterals: Record<string, unknown>;
  flatFunctions: Record<string, string>;
  mode?: ThemeResolutionMode;
}): ThemeOptions {
  const {
    templateId,
    colorScheme,
    enabledPresets,
    flatLiterals,
    flatFunctions,
    mode = 'safe',
  } = params;

  // Check if we can use cached result
  const currentCacheKey = generateCacheKey(
    templateId,
    colorScheme,
    enabledPresets,
    flatLiterals,
    flatFunctions
  );

  if (cachedThemeOptions && cacheKey === currentCacheKey) {
    return cachedThemeOptions;
  }

  // Layer 1: Base theme template with correct palette for color scheme
  let themeOptions = getThemeTemplate(templateId, colorScheme);

  // Layer 2: Apply enabled presets
  Object.entries(enabledPresets).forEach(([id, enabled]) => {
    if (enabled) {
      try {
        const preset = getThemePreset(id);
        const presetValue =
          typeof preset.value === 'function'
            ? preset.value(themeOptions)
            : preset.value;
        themeOptions = deepmerge(themeOptions, presetValue);
      } catch (error) {
        console.error(`[ThemeSheet] Failed to apply preset "${id}":`, error);
        if (mode === 'strict') {
          throw error;
        }
      }
    }
  });

  // Layer 3: Apply user literals (flat → nested)
  try {
    const literalsLayer = expandFlatThemeOptions(flatLiterals);
    themeOptions = deepmerge(themeOptions, literalsLayer);
  } catch (error) {
    console.error('[ThemeSheet] Failed to expand flat literals:', error);
    if (mode === 'strict') {
      throw error;
    }
  }

  // Layer 4: Apply user functions (hydrated)
  if (Object.keys(flatFunctions).length > 0) {
    try {
      const hydratedValues = hydrateFunctions(flatFunctions, mode, themeOptions);
      const functionsLayer = expandFlatThemeOptions(hydratedValues);
      themeOptions = deepmerge(themeOptions, functionsLayer);
    } catch (error) {
      console.error('[ThemeSheet] Failed to hydrate functions:', error);
      if (mode === 'strict') {
        throw error;
      }
    }
  }

  // Cache the result
  cachedThemeOptions = themeOptions;
  cacheKey = currentCacheKey;

  return themeOptions;
}

/**
 * Invalidates the theme options cache.
 * Called manually when you want to force re-resolution on next access.
 */
export function invalidateThemeCache(): void {
  cachedThemeOptions = null;
  cacheKey = null;
}
