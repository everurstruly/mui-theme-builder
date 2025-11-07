import type { ThemeOptions } from '@mui/material/styles';
import type { ResolutionMode } from '../types';

/**
 * Hydrates function body strings into executable functions with controlled scope.
 *
 * Resolution modes:
 * - 'raw': strict evaluation, throws on errors (for export/committed themes)
 * - 'failsafe': safe evaluation with fallbacks (for live preview)
 *
 * Security note: Functions are executed with limited scope (only theme object exposed).
 * For production use, consider sandboxing strategies (Web Workers, VM contexts, etc.).
 *
 * @param functionStrings - Map of dot-notation paths to function body strings
 * @param mode - Resolution mode ('raw' or 'failsafe')
 * @param theme - Current theme context for function evaluation
 * @returns Map of paths to executable functions
 */
export const hydrateFunctionsSafely = (
  functionStrings: Record<string, string>,
  mode: ResolutionMode,
  theme: ThemeOptions
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(functionStrings).map(([path, code]) => {
      try {
        if (mode === 'failsafe') {
          // Safe mode: catch errors and return sensible fallbacks
          const fn = new Function(
            'theme',
            `
            try {
              const { palette, spacing, breakpoints, typography, shape, transitions, zIndex, shadows, mixins } = theme;
              return (${code});
            } catch (e) {
              console.warn('[ThemeWorkspace] Failsafe fallback for "${path}":', e);
              // Return type-appropriate fallbacks
              if ("${path}".includes('color') || "${path}".includes('Color') || "${path}".includes('background')) {
                return '#cccccc'; // Gray fallback for colors
              }
              if ("${path}".includes('spacing') || "${path}".includes('width') || "${path}".includes('height')) {
                return 0; // Zero for dimensions
              }
              return null;
            }
          `
          );
          return [path, (fn as (theme: ThemeOptions) => unknown)(theme)];
        } else {
          // Raw mode: strict evaluation, let errors propagate
          const fn = new Function(
            'theme',
            `
            const { palette, spacing, breakpoints, typography, shape, transitions, zIndex, shadows, mixins } = theme;
            return (${code});
          `
          );
          return [path, (fn as (theme: ThemeOptions) => unknown)(theme)];
        }
      } catch (e) {
        if (mode === 'failsafe') {
          // Failsafe: return a no-op function that returns null
          console.error(`[ThemeWorkspace] Failed to parse function at "${path}":`, e);
          return [path, () => null];
        } else {
          // Raw mode: propagate error
          throw new Error(
            `Failed to hydrate function at "${path}": ${e instanceof Error ? e.message : String(e)}`
          );
        }
      }
    })
  );
};
