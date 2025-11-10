import { useMemo } from 'react';
import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';
import { useThemeSheetStore } from './themeSheet.store';
import { resolveThemeOptions } from './themeSheet.resolver';
import { getNestedValue } from './themeSheet.utils';
import type { SerializableValue } from './types';

/**
 * Hook that returns a fully resolved MUI Theme for preview/canvas rendering.
 * Uses safe resolution mode for live preview with error handling.
 *
 * Automatically re-renders when any theme-affecting state changes.
 *
 * @returns MUI Theme instance ready for use with ThemeProvider
 */
export function useThemeSheetTheme(): Theme {
  const themeOptions = useThemeSheetOptions('safe');

  const theme = useMemo(() => {
    try {
      return createTheme(themeOptions);
    } catch (error) {
      console.error('[useThemeSheetTheme] Failed to create theme:', error);
      // Fallback to default MUI theme
      return createTheme();
    }
  }, [themeOptions]);

  return theme;
}

/**
 * Hook that returns resolved ThemeOptions (not yet passed to createTheme).
 * Useful for code editors, export functionality, or debugging.
 *
 * @param mode - Resolution mode ('safe' or 'strict')
 * @returns Resolved ThemeOptions object
 */
export function useThemeSheetOptions(mode: 'safe' | 'strict' = 'safe'): ThemeOptions {
  const templateId = useThemeSheetStore((state) => state.selectedThemeTemplateId.id);
  const colorScheme = useThemeSheetStore((state) => state.colorScheme);
  const enabledPresets = useThemeSheetStore((state) => state.enabledPresets);
  const flatThemeOptions = useThemeSheetStore((state) => state.flatThemeOptions);
  const editBuffer = useThemeSheetStore((state) => state.editBuffer);
  const hasUnsavedEdits = useThemeSheetStore((state) => state.hasUnsavedEdits);

  const themeOptions = useMemo(() => {
    try {
      // Use edit buffer if there are unsaved edits, otherwise use committed flat options
      const activeLiterals = hasUnsavedEdits
        ? { ...flatThemeOptions.literals, ...editBuffer }
        : flatThemeOptions.literals;

      return resolveThemeOptions({
        templateId,
        colorScheme,
        enabledPresets,
        flatLiterals: activeLiterals,
        flatFunctions: flatThemeOptions.functions,
        mode,
      });
    } catch (error) {
      console.error('[useThemeSheetOptions] Failed to resolve theme options:', error);
      
      if (mode === 'strict') {
        throw error;
      }
      
      // Fallback to empty object in safe mode
      return {};
    }
  }, [
    templateId,
    colorScheme,
    enabledPresets,
    flatThemeOptions.literals,
    flatThemeOptions.functions,
    editBuffer,
    hasUnsavedEdits,
    mode,
  ]);

  return themeOptions;
}

/**
 * Hook for UI controls to read and update theme values at specific paths.
 *
 * @param path - Dot-notation path (e.g., 'palette.primary.main')
 * @returns Object with value, setters, and control state flags
 */
export function useThemeSheetValue(path: string) {
  const store = useThemeSheetStore();
  const { literals, functions } = store.flatThemeOptions;
  const editBuffer = store.editBuffer;

  // Check if this path is controlled by a function (UI should disable)
  const isControlledByFunction = path in functions;

  // Check if this path has been customized from the template
  const isCustomized = path in literals || path in functions;

  // Current live value (from edit buffer if editing, otherwise from committed literals)
  const liveValue: SerializableValue | string | undefined =
    path in editBuffer
      ? editBuffer[path]
      : (getNestedValue(literals, path) as SerializableValue | undefined);

  /**
   * Sets a new value at this path in the edit buffer.
   * Does NOT commit (no history trigger).
   */
  const setValue = (value: SerializableValue | string) => {
    store.setEditValue(path, value);
  };

  /**
   * Removes the edit at this path, reverting to template default.
   * Does NOT commit (no history trigger).
   */
  const resetValue = () => {
    store.removeEditValue(path);
  };

  return {
    /** Current value (may be from edit buffer or committed literals) */
    value: liveValue,

    /** If true, this path is controlled by a function — UI should disable or show code editor */
    isControlledByFunction,

    /** If true, this path has been customized from the template */
    isCustomized,

    /** Update the value in the edit buffer (live preview) */
    setValue,

    /** Remove this edit (revert to template default) */
    resetValue,
  };
}

