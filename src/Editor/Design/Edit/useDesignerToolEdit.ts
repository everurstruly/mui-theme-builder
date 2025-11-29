import { useMemo, useCallback } from "react";
import { useEdit } from "./useEdit";
import { getNestedValue, type SerializableValue } from "../compiler";
import { useThemeCompilerCache } from "./useThemeCompilerCache";

export default function useDesignerToolEdit(path: string, scheme?: string | null) {
  const isSchemeSpecific = scheme != null;

  // USE CACHE FOR FASTER BASE VALUE LOOKUPS
  const compilerCache = useThemeCompilerCache();

  // NARROWER SUBSCRIPTIONS - only subscribe to relevant paths
  const codeValue = useEdit(useCallback((s) => s.codeOverridesFlattened[path], [path]));
  const globalEdit = useEdit(useCallback((s) => s.colorSchemeIndependentVisualToolEdits[path], [path]));
  const schemeEdit = useEdit(
    useCallback((s) => s.colorSchemes[scheme || ""]?.visualToolEdits[path], [scheme, path])
  );

  // Compose the authoritative 'value' (code overrides take precedence,
  // then visual edits, then the base/template value)
  const editValue = isSchemeSpecific ? schemeEdit : globalEdit;
  // Get base value from cache (faster than full theme resolution)
  const baseValue = useMemo(() => {
    const theme = compilerCache;
    return getNestedValue(theme, path) as SerializableValue | undefined;
  }, [compilerCache, path]);

  // Ensure effectiveValue always falls back to the base/template value when
  // no code override or visual edit exists.
  const effectiveValue = (codeValue ?? editValue ?? baseValue) as
    | SerializableValue
    | undefined;

  // Determine whether a visual edit or code override exists
  const hasVisualEdit = typeof editValue === "string" || !!editValue;
  const hasCodeOverride = !!codeValue;

  const canReset = hasVisualEdit || hasCodeOverride;

  // Get the appropriate actions (stable function identities from store)
  const addGlobalEdit = useEdit((s) => s.addGlobalVisualEdit);
  const addSchemeEdit = useEdit((s) => s.addSchemeVisualEdit);
  const removeGlobalEdit = useEdit((s) => s.removeGlobalVisualEdit);
  const removeSchemeEdit = useEdit((s) => s.removeSchemeVisualEdit);

  return useMemo(
    () => ({
      // `value` is the effective value consumers should display/use
      value: effectiveValue,
      // `resolvedValue` kept as the base/template-derived value for reference
      resolvedValue: baseValue,
      baseValue,
      hasCodeOverride,
      hasVisualEdit,
      canReset,
      isModified: hasCodeOverride || hasVisualEdit,
      setValue: (v: SerializableValue) =>
        isSchemeSpecific
          ? addSchemeEdit(scheme as string, path, v)
          : addGlobalEdit(path, v),
      reset: () =>
        isSchemeSpecific
          ? removeSchemeEdit(scheme as string, path)
          : removeGlobalEdit(path),
    }),
    [
      effectiveValue,
      scheme,
      baseValue,
      hasCodeOverride,
      hasVisualEdit,
      canReset,
      isSchemeSpecific,
      addGlobalEdit,
      addSchemeEdit,
      removeGlobalEdit,
      removeSchemeEdit,
      path,
    ]
  );
}
