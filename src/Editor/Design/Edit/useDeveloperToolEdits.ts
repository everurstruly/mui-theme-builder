import { useMemo } from "react";
import { useEdit } from "./useEdit";

/**
 * Hook for accessing code overrides state.
 * Provides read-only access to source, error, and override status.
 *
 * @returns Code overrides state
 *
 * @example
 * function StatusBadge() {
 *   const { hasOverrides, error } = useDeveloperToolEdits();
 *   return hasOverrides ? <Badge color="warning">Code Active</Badge> : null;
 * }
 */
export default function useDeveloperToolEdits() {
  const source = useEdit((s) => s.codeOverridesSource);
  const error = useEdit((s) => s.codeOverridesError);
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
