import { useMemo } from "react";
import { useCurrentDesign } from "./useCurrent";
import { transformCodeToDsl } from "../compiler";

/**
 * Hook for accessing code overrides actions.
 * Provides functions to modify code overrides.
 *
 * @returns Code overrides actions
 *
 * @example
 * function ApplyButton() {
 *   const { applyModifications } = useCodeOverridesActions();
 *   const handleApply = () => applyModifications('{ palette: { primary: { main: "#ff0000" } } }');
 *   return <Button onClick={handleApply}>Apply</Button>;
 * }
 */
export default function useCodeOverridesActions() {
  const setCodeOverrides = useCurrentDesign((s) => s.setCodeOverrides);
  const clearCodeOverrides = useCurrentDesign((s) => s.clearCodeOverrides);
  const resetToVisual = useCurrentDesign((s) => s.clearCodeOverrides);
  const resetToBase = useCurrentDesign((s) => s.resetToBase);

  return useMemo(
    () => ({
      /** Apply code overrides from editor */
      applyModifications: (code: string) => {
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
