import { useMemo } from "react";
import { useDesignStore } from "./currentStore";
import { transformCodeToDsl } from "../compiler";

/**
 * Hook for accessing code overrides actions.
 * Provides functions to modify code overrides.
 *
 * @returns Code overrides actions
 *
 * @example
 * function ApplyButton() {
 *   const { applyChanges } = useCodeOverridesActions();
 *   const handleApply = () => applyChanges('{ palette: { primary: { main: "#ff0000" } } }');
 *   return <Button onClick={handleApply}>Apply</Button>;
 * }
 */
export default function useCodeOverridesActions() {
  const setCodeOverrides = useDesignStore((s) => s.setCodeOverrides);
  const clearCodeOverrides = useDesignStore((s) => s.clearCodeOverrides);
  const resetToVisual = useDesignStore((s) => s.clearCodeOverrides);
  const resetToBase = useDesignStore((s) => s.resetToBase);

  return useMemo(
    () => ({
      /** Apply code overrides from editor */
      applyChanges: (code: string) => {
        const result = transformCodeToDsl(code);
        if (result.error) {
          setCodeOverrides(code, {}, {}, result.error);
        } else {
          setCodeOverrides(code, result.dsl, {}, null);
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
