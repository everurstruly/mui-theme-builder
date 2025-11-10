import type { SerializableValue } from '../types';

/**
 * Flattens a nested ThemeOptions object into dot-notation paths.
 * Functions are excluded (handled separately by splitThemeOptions).
 *
 * Example:
 * Input:  { palette: { primary: { main: '#f00' } } }
 * Output: { 'palette.primary.main': '#f00' }
 *
 * @param obj - Nested object to flatten
 * @param prefix - Internal recursion parameter (dot-notation prefix)
 * @returns Flat object with dot-notation keys
 */
export const flattenThemeOptions = (
  obj: unknown,
  prefix = ''
): Record<string, SerializableValue> => {
  const result: Record<string, SerializableValue> = {};

  const traverse = (value: unknown, path: string) => {
    // Skip nullish values
    if (value == null) {
      if (path) result[path] = null;
      return;
    }

    // Skip functions (they're handled by splitThemeOptions)
    if (typeof value === 'function') {
      return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      // Store array itself if all elements are primitives
      const hasComplexItems = value.some(
        (item) => typeof item === 'object' && item !== null && !Array.isArray(item)
      );

      if (!hasComplexItems) {
        result[path] = value as SerializableValue;
      } else {
        // Recursively flatten array items
        value.forEach((item, i) => traverse(item, `${path}[${i}]`));
      }
      return;
    }

    // Handle primitives
    if (typeof value !== 'object') {
      if (path) result[path] = value as SerializableValue;
      return;
    }

    // Handle nested objects
    const entries = Object.entries(value);
    if (entries.length === 0) {
      // Empty object
      if (path) result[path] = {} as SerializableValue;
      return;
    }

    entries.forEach(([key, val]) => {
      traverse(val, path ? `${path}.${key}` : key);
    });
  };

  traverse(obj, prefix);
  return result;
};

