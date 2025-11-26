/**
 * Pure Object Operations
 * 
 * Type-safe utilities for nested object manipulation.
 * All functions are pure (no side effects, no external dependencies).
 * 
 * Used by:
 * - Transformation layer (DSL resolution)
 * - UI components (property panels)
 * - Store mutations (pre-computing flattened state)
 */

export type SerializableValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

/**
 * Gets a value at a nested path in an object.
 *
 * @param obj - Source object
 * @param path - Dot-notation path
 * @returns Value at path, or undefined if not found
 *
 * @example
 * const obj = { palette: { primary: { main: '#1976d2' } } };
 * getNestedValue(obj, 'palette.primary.main') // '#1976d2'
 * getNestedValue(obj, 'palette.secondary.main') // undefined
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Sets a value at a nested path in an object.
 * Creates intermediate objects as needed.
 *
 * @param obj - Target object (mutated in place)
 * @param path - Dot-notation path
 * @param value - Value to set
 *
 * @example
 * const obj = {};
 * setNestedValue(obj, 'palette.primary.main', '#ff0000');
 * // obj is now: { palette: { primary: { main: '#ff0000' } } }
 */
export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
}

/**
 * Expands a flat dot-notation record back into a nested object.
 *
 * @param flat - Flat record with dot-notation keys
 * @returns Nested object structure
 *
 * @example
 * expandFlatThemeOptions({
 *   'palette.primary.main': '#1976d2',
 *   'spacing': 8
 * })
 * // Returns: { palette: { primary: { main: '#1976d2' } }, spacing: 8 }
 */
export function expandFlatThemeOptions(
  flat: Record<string, SerializableValue>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(flat)) {
    setNestedValue(result, path, value);
  }

  return result;
}

/**
 * Flattens a nested ThemeOptions object into dot-notation paths.
 *
 * @param obj - Nested ThemeOptions object
 * @param prefix - Internal: current path prefix during recursion
 * @returns Flat record with dot-notation keys
 *
 * @example
 * flattenThemeOptions({
 *   palette: { primary: { main: '#1976d2' } },
 *   spacing: 8
 * })
 * // Returns: { 'palette.primary.main': '#1976d2', 'spacing': 8 }
 */
export function flattenThemeOptions(
  obj: Record<string, unknown>,
  prefix: string = ''
): Record<string, SerializableValue> {
  const result: Record<string, SerializableValue> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[fullPath] = null;
    } else if (typeof value === 'function') {
      // Skip functions during flattening (they're handled separately)
      continue;
    } else if (Array.isArray(value)) {
      result[fullPath] = value as SerializableValue;
    } else if (typeof value === 'object' && Object.keys(value).length > 0) {
      // Recursively flatten nested objects
      Object.assign(
        result,
        flattenThemeOptions(value as Record<string, unknown>, fullPath)
      );
    } else {
      result[fullPath] = value as SerializableValue;
    }
  }

  return result;
}

/**
 * Deep merge multiple objects into one.
 * Later objects override earlier ones.
 *
 * @param objects - Objects to merge (in order of priority)
 * @returns Merged object
 *
 * @example
 * deepMerge(
 *   { palette: { primary: { main: '#000' } } },
 *   { palette: { primary: { dark: '#333' } } }
 * )
 * // Returns: { palette: { primary: { main: '#000', dark: '#333' } } }
 */
export function deepMerge(
  ...objects: Record<string, unknown>[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const obj of objects) {
    if (!obj) continue;

    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) continue;

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        result[key] &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(
          result[key] as Record<string, unknown>,
          value as Record<string, unknown>
        );
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
