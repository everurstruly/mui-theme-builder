/**
 * Flattens a nested theme object into a flat key-value structure.
 * Used for display and comparison purposes.
 * 
 * @example
 * flattenThemeObject({ palette: { primary: { main: '#000' } } })
 * // Returns: { 'palette.primary.main': '#000' }
 */
export function flattenThemeObject(
  obj: Record<string, any>,
  parentKey = '',
  result: Record<string, any> = {}
): Record<string, any> {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenThemeObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}
