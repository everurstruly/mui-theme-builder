/**
 * Color Scheme Classification
 * 
 * Defines which ThemeOptions paths are color-scheme-specific.
 * 
 * Color schemes in MUI:
 * - v5: light, dark (built-in)
 * - v6+: light, dark, plus custom schemes (high-contrast, sepia, AMOLED, etc.)
 * 
 * Scheme-specific paths:
 * - palette.* - All color tokens
 * - shadows - Elevation shadows (different for light/dark)
 * 
 * Global paths (apply to all schemes):
 * - typography.* - Font settings
 * - spacing - Spacing factor
 * - shape.* - Border radius, etc.
 * - breakpoints.* - Responsive breakpoints
 * - components.* - Component defaults
 * - transitions.* - Animation timings
 * - zIndex.* - Stacking order
 */

/**
 * Paths that are scoped to specific color schemes.
 * All other paths are considered global (apply to all schemes).
 */
export const COLOR_SCHEME_PATHS = ['palette', 'shadows'] as const;

/**
 * Determines if a given path should be scoped to a specific color scheme.
 *
 * @param path - Dot-notation path (e.g., 'palette.primary.main')
 * @returns true if path is color-scheme-specific
 *
 * @example
 * isColorSchemePath('palette.primary.main') // true
 * isColorSchemePath('typography.fontSize') // false
 * isColorSchemePath('shadows.1') // true
 * isColorSchemePath('shape.borderRadius') // false
 */
export function isColorSchemePath(path: string): boolean {
  return COLOR_SCHEME_PATHS.some((prefix) => path.startsWith(prefix));
}
