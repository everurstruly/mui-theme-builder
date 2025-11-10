import { setNestedValue } from './objectHelpers';

/**
 * Expands a flat dot-notation object back into nested structure.
 * Inverse operation of flattenThemeOptions.
 *
 * Example:
 * Input:  { 'palette.primary.main': '#f00', 'spacing': 8 }
 * Output: { palette: { primary: { main: '#f00' } }, spacing: 8 }
 *
 * @param flat - Flat object with dot-notation keys
 * @returns Nested object
 */
export const expandFlatThemeOptions = (
  flat: Record<string, unknown>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  Object.entries(flat).forEach(([path, value]) => {
    // Handle array notation: 'palette.colors[0]' -> ['palette', 'colors', '0']
    const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
    setNestedValue(result, normalizedPath, value);
  });

  return result;
};

