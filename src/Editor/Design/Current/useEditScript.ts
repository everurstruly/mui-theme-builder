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
 * Hook that combines code-overrides actions and read-only state access.
 * Migrated from `useDeveloperEditTools` and `useDeveloperToolEdit`.
 */
export default function useEditScript() {
  const setCodeOverrides = useCurrent((s) => s.setCodeOverrides);
  const clearCodeOverrides = useCurrent((s) => s.clearCodeOverrides);
  const resetToVisual = useCurrent((s) => s.clearCodeOverrides);
  const resetToBase = useCurrent((s) => s.resetToBase);

  const source = useCurrent((s) => s.codeOverridesSource);
  const error = useCurrent((s) => s.codeOverridesError);
  const hasOverrides = (source ?? "").length > 0;

  return useMemo(
    () => ({
      // Actions
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

            let flattened: Record<string, any> | undefined = flattenedCache.get(cacheKey);
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
            setCodeOverrides(code, result.dsl, {}, null);

            // Log so we can debug if transform/flatten fails in unexpected cases
            console.error("Failed to compute flattened code overrides:", e);
          }
        }
      },

      clearOverrides: () => clearCodeOverrides(),

      resetToVisual,

      resetToBase,

      // Read-only state
      source,
      error,
      hasOverrides,
    }),
    [setCodeOverrides, clearCodeOverrides, resetToVisual, resetToBase, source, error, hasOverrides]
  );
}
