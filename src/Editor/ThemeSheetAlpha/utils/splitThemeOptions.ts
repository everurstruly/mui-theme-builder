import type { SerializableValue, ResolvedThemeModifications } from '../types';

/**
 * Splits a ThemeOptions object into serializable literals and function strings.
 * This is the critical normalization step that separates safe data from code.
 *
 * Example:
 * Input:  {
 *   palette: {
 *     primary: {
 *       main: '#f00',
 *       contrast: t => t.palette.getContrastText('#f00')
 *     }
 *   }
 * }
 * Output: {
 *   literals: { 'palette.primary.main': '#f00' },
 *   functions: { 'palette.primary.contrast': 't => t.palette.getContrastText("#f00")' }
 * }
 *
 * @param obj - ThemeOptions object (may contain functions)
 * @param prefix - Internal recursion parameter
 * @returns Normalized literals and function strings
 */
export const splitThemeOptions = (
  obj: unknown,
  prefix = ''
): ResolvedThemeModifications => {
  const literals: Record<string, SerializableValue> = {};
  const functions: Record<string, string> = {};

  const traverse = (value: unknown, path: string) => {
    // Skip nullish values but record them
    if (value == null) {
      if (path) literals[path] = null;
      return;
    }

    // Extract functions as strings
    if (typeof value === 'function') {
      functions[path] = value.toString();
      return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      // Check if array contains complex types that need traversal
      const needsTraversal = value.some(
        (item) =>
          typeof item === 'function' ||
          (typeof item === 'object' && item !== null && !Array.isArray(item))
      );

      if (needsTraversal) {
        value.forEach((item, i) => traverse(item, `${path}[${i}]`));
      } else {
        // Simple array of primitives
        if (path) literals[path] = value as SerializableValue;
      }
      return;
    }

    // Handle primitives
    if (typeof value !== 'object') {
      if (path) literals[path] = value as SerializableValue;
      return;
    }

    // Handle nested objects
    const entries = Object.entries(value);
    if (entries.length === 0) {
      if (path) literals[path] = {};
      return;
    }

    entries.forEach(([key, val]) => {
      traverse(val, path ? `${path}.${key}` : key);
    });
  };

  traverse(obj, prefix);
  return { literals, functions };
};
