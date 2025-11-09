import { getNestedValue } from '../utils/objectHelpers';
import { useThemeSheetStore } from '../stores/themeWorkspace.store';
import type { RawThemeModification, SerializableValue } from '../types';

/**
 * Hook for UI controls to read and update theme values at specific paths.
 *
 * Key behaviors:
 * - UI controls should be DISABLED when `isControlledByFunction === true`
 * - `value` comes from raw buffer (live preview) or resolved literals (committed)
 * - `setValue` updates the transient raw buffer (doesn't trigger history)
 * - `resetToBase` removes the modification at this path
 *
 * @param path - Dot-notation path (e.g., 'palette.primary.main')
 * @returns Object with value, setters, and control state flags
 */
export const useThemeSheetEditValue = (path: string) => {
  const store = useThemeSheetStore();
  const { literals, functions } = store.resolvedThemeOptionsModifications;
  const raw = store.rawThemeOptionsModifications;

  // Check if this path is controlled by a function (UI should disable)
  const isControlledByFunction = path in functions;

  // Check if this path has been overridden from the base theme
  const isOverridden = path in literals || path in functions;

  // Current live value (from raw buffer if editing, otherwise from committed literals)
  const liveValue: RawThemeModification | undefined =
    path in raw ? raw[path] : getNestedValue(literals, path) as SerializableValue | undefined;

  /**
   * Sets a new value at this path in the raw buffer.
   * Does NOT commit (no history trigger).
   */
  const setValue = (value: SerializableValue) => {
    store.setRawModificationAtPath(path, value);
  };

  /**
   * Removes the modification at this path, reverting to base theme value.
   */
  const resetToBase = () => {
    store.removeModificationAtPath(path);
  };

  return {
    /** Current value (may be from raw buffer or resolved literals) */
    value: liveValue,

    /** If true, this path is controlled by a function — UI should disable */
    isControlledByFunction,

    /** If true, this path has been modified from the base theme */
    isOverridden,

    /** Update the value in the raw buffer (live preview) */
    setValue,

    /** Remove this modification (reset to base) */
    resetToBase,
  };
};
