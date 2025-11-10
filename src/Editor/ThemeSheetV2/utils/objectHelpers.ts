/**
 * Sets a value at a nested path in an object using dot notation.
 * Similar to lodash's set() function.
 *
 * @param obj - Target object
 * @param path - Dot-notation path (e.g., 'palette.primary.main')
 * @param value - Value to set
 */
export const setNestedValue = (obj: Record<string, unknown>, path: string, value: unknown): void => {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
};

/**
 * Gets a value at a nested path in an object using dot notation.
 * Similar to lodash's get() function.
 *
 * @param obj - Source object
 * @param path - Dot-notation path (e.g., 'palette.primary.main')
 * @returns Value at path, or undefined if not found
 */
export const getNestedValue = (obj: unknown, path: string): unknown => {
  if (typeof obj !== 'object' || obj === null) return undefined;

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (typeof current !== 'object' || current === null || !(key in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
};

