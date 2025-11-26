import { useMemo } from "react";
import { useDesignStore } from "./currentStore";

/**
 * Hook for accessing code overrides state.
 * Provides read-only access to source, error, and override status.
 * 
 * @returns Code overrides state
 * 
 * @example
 * function StatusBadge() {
 *   const { hasOverrides, error } = useCodeOverridesState();
 *   return hasOverrides ? <Badge color="warning">Code Active</Badge> : null;
 * }
 */
export default function useCodeOverridesState() {
  const source = useDesignStore((s) => s.codeOverridesSource);
  const error = useDesignStore((s) => s.codeOverridesError);
  const hasOverrides = source.length > 0;

  return useMemo(
    () => ({
      /** Current saved code override source */
      source,

      /** Parse/evaluation error, if any */
      error,

      /** True if there are code overrides applied */
      hasOverrides,
    }),
    [source, error, hasOverrides]
  );
}
