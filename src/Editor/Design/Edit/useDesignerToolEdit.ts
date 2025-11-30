import { useMemo, useCallback } from "react";
import useEdit from "./useEdit";
import useCreatedTheme from "./useCreatedTheme";
import { getNestedValue, type SerializableValue } from "../compiler";

export default function useDesignerToolEdit(path: string, scheme?: string | null) {
  const isSchemeSpecific = scheme != null;

  // 🎯 CRITICAL FIX: Use actual MUI theme instead of intermediate compiler cache
  const actualTheme = useCreatedTheme((scheme || undefined) as 'light' | 'dark' | undefined);

  // NARROWER SUBSCRIPTIONS - only subscribe to relevant paths
  const codeValue = useEdit(useCallback((s) => s.codeOverridesFlattened[path], [path]));
  const globalEdit = useEdit(useCallback((s) => s.colorSchemeIndependentVisualToolEdits[path], [path]));
  const schemeEdit = useEdit(
    useCallback((s) => s.colorSchemes[scheme || ""]?.visualToolEdits[path], [scheme, path])
  );

  // Compose the authoritative 'value' (visual edits take precedence here for panels)
  const editValue = isSchemeSpecific ? schemeEdit : globalEdit;

  // 🎯 CRITICAL FIX: Get base value from ACTUAL MUI theme
  const baseValue = useMemo(() => {
    return getNestedValue(actualTheme, path) as SerializableValue | undefined;
  }, [actualTheme, path]);

  // Effective value is now the computed theme value
  const effectiveValue = baseValue;

  // Determine whether a visual edit or code override exists
  const hasVisualEdit = typeof editValue === "string" || !!editValue;
  const hasCodeOverride = !!codeValue;
  const canReset = hasVisualEdit || hasCodeOverride;

  // Get the appropriate actions
  const addGlobalEdit = useEdit((s) => s.addGlobalVisualEdit);
  const addSchemeEdit = useEdit((s) => s.addSchemeVisualEdit);
  const removeGlobalEdit = useEdit((s) => s.removeGlobalVisualEdit);
  const removeSchemeEdit = useEdit((s) => s.removeSchemeVisualEdit);

  return useMemo(
    () => ({
      // 🎯 value is now the ACTUAL computed MUI theme value
      value: effectiveValue,
      // Remove resolvedValue as it's redundant - baseValue is the template-derived value
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
      baseValue,
      scheme,
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
