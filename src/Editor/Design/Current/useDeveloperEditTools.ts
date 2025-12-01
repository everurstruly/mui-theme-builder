import { useMemo } from "react";
import useCurrent from "./useCurrent";
import {
  transformCodeToDsl,
  transformDslToThemeOptions,
  flattenThemeObject,
  parseThemeCode,
} from "../compiler";

// Simple in-memory cache to avoid recomputing flattened maps for identical inputs.
// Key is JSON.stringify(dsl) + '::' + baseThemeOptionSource + '::' + activeColorScheme
const flattenedCache = new Map<string, Record<string, any>>();

/**
 * Hook for accessing code overrides actions.
 * Provides functions to modify code overrides.
 *
 * @returns Code overrides actions
 *
 * @example
 * function ApplyButton() {
 *   const { applyModifications } = useDeveloperToolActions();
 *   const handleApply = () => applyModifications('{ palette: { primary: { main: "#ff0000" } } }');
 *   return <Button onClick={handleApply}>Apply</Button>;
 * }
 */
export default function useDeveloperToolActions() {
  const setCodeOverrides = useCurrent((s) => s.setCodeOverrides);
  const clearCodeOverrides = useCurrent((s) => s.clearCodeOverrides);
  const resetToVisual = useCurrent((s) => s.clearCodeOverrides);
  const resetToBase = useCurrent((s) => s.resetToBase);

  return useMemo(
    () => ({
      /** Apply code overrides from editor */
      applyModifications: (code: string) => {
        const result = transformCodeToDsl(code);
        if (result.error) {
          setCodeOverrides(code, {}, {}, result.error);
        } else {
          try {
            // Build resolution context from current editor base template
            const state = useCurrent.getState();
            const baseTemplate = parseThemeCode(state.baseThemeOptionSource) ?? {};
            const activeScheme = state.activeColorScheme ?? "light";

            // Cache key must include DSL + base template (string) + scheme because
            // resolved values depend on the template and active color scheme.
            const dslString = JSON.stringify(result.dsl || {});
            const cacheKey = `${dslString}::${state.baseThemeOptionSource}::${activeScheme}`;

            let flattened: Record<string, any> | undefined =
              flattenedCache.get(cacheKey);
            if (!flattened) {
              const context = {
                template: baseTemplate,
                colorScheme: activeScheme,
                spacingFactor: 8,
              };

              // Resolve DSL -> ThemeOptions and then flatten for quick path lookups
              const themeOptions = transformDslToThemeOptions(result.dsl, context);
              flattened = flattenThemeObject(themeOptions || {});
              try {
                flattenedCache.set(cacheKey, flattened);
              } catch {
                // ignore cache failures (e.g., circular references causing stringify issues)
              }
            }

            setCodeOverrides(code, result.dsl, flattened, null);
          } catch (e) {
            // Fallback: still set DSL but keep flattened empty and record error for visibility
            try {
              setCodeOverrides(code, result.dsl, {}, null);
            } catch {
              // ignore
            }
            // Log so we can debug if transform/flatten fails in unexpected cases
            console.error("Failed to compute flattened code overrides:", e);
          }
        }
      },

      /** Clear all code overrides */
      clearOverrides: () => clearCodeOverrides(),

      /** Reset to visual edits only (clear all code overrides) */
      resetToVisual,

      /** Reset to base theme (clear all modifications) */
      resetToBase,
    }),
    [setCodeOverrides, clearCodeOverrides, resetToVisual, resetToBase]
  );
}
