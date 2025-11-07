/**
 * Serializes a ThemeOptions object by converting functions to their string representations
 * while preserving the original object structure.
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
 *   palette: {
 *     primary: {
 *       main: '#f00',
 *       contrast: 't => t.palette.getContrastText("#f00")'
 *     }
 *   }
 * }
 *
 * @param obj - ThemeOptions object (may contain functions)
 * @returns Object with same structure but functions converted to strings
 */
export const serializeThemeOptions = (obj: unknown): unknown => {
  // Handle nullish values
  if (obj == null) {
    return obj;
  }

  // Convert functions to strings
  if (typeof obj === 'function') {
    return obj.toString();
  }

  // Handle arrays recursively
  if (Array.isArray(obj)) {
    return obj.map((item) => serializeThemeOptions(item));
  }

  // Handle primitives (string, number, boolean)
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle nested objects recursively
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = serializeThemeOptions(value);
  }

  return result;
};
