import { useMemo } from "react";
import { useEdit } from "./useEdit";
import { transformCodeToDsl } from "../compiler";

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
  const setCodeOverrides = useEdit((s) => s.setCodeOverrides);
  const clearCodeOverrides = useEdit((s) => s.clearCodeOverrides);
  const resetToVisual = useEdit((s) => s.clearCodeOverrides);
  const resetToBase = useEdit((s) => s.resetToBase);

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
