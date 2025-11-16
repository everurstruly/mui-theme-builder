import { useMemo } from "react";
import { useDesignStore } from "./designStore";

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
  const applyCodeOverrides = useDesignStore((s) => s.applyCodeOverrides);
  const clearCodeOverrides = useDesignStore((s) => s.removeAllCodeOverrides);
  const resetToVisual = useDesignStore((s) => s.removeAllCodeOverrides);
  const resetToTemplate = useDesignStore((s) => s.resetToTemplate);

  return useMemo(
    () => ({
      /** Apply code overrides from editor */
      applyChanges: (code: string) => applyCodeOverrides(code),

      /** Clear all code overrides */
      clearOverrides: () => clearCodeOverrides(),

      /** Reset to visual edits only (clear all code overrides) */
      resetToVisual,

      /** Reset to template base (clear all modifications) */
      resetToTemplate,
    }),
    [applyCodeOverrides, clearCodeOverrides, resetToVisual, resetToTemplate]
  );
}
