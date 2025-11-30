import { useMemo, useCallback } from "react";
import useEdit from "./useEdit";
import useCreatedTheme from "./useCreatedTheme";
import { getNestedValue, type SerializableValue } from "../compiler";

export default function useDesignerToolEdit(path: string, scheme?: string | null) {
  const isSchemeSpecific = scheme != null;

  // 🎯 CRITICAL FIX: Use actual MUI theme instead of intermediate compiler cache
  const actualTheme = useCreatedTheme((scheme || undefined) as 'light' | 'dark' | undefined);

  // NARROWER SUBSCRIPTIONS - only subscribe to relevant paths
  const codeValue = useEdit(useCallback((s) => s.codeOverridesEdits[path], [path]));
  const globalEdit = useEdit(useCallback((s) => s.neutralEdits[path], [path]));
  const schemeEdit = useEdit(
    useCallback((s) => s.schemeEdits[scheme || ""]?.designer[path], [scheme, path])
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
  const hasDesignerEdit = typeof editValue === "string" || !!editValue;
  const hasCodeOverride = !!codeValue;
  const canReset = hasDesignerEdit || hasCodeOverride;

  // Get the appropriate actions
  const addGlobalEdit = useEdit((s) => s.addGlobalDesignerEdit);
  const addSchemeEdit = useEdit((s) => s.addSchemeDesignerEdit);
  const removeGlobalEdit = useEdit((s) => s.removeGlobalDesignerEdit);
  const removeSchemeEdit = useEdit((s) => s.removeSchemeDesignerEdit);

  return useMemo(
    () => ({
      // 🎯 value is now the ACTUAL computed MUI theme value
      value: effectiveValue,
      // Remove resolvedValue as it's redundant - baseValue is the template-derived value
      baseValue,
      hasCodeOverride,
      hasDesignerEdit,
      canReset,
      isModified: hasCodeOverride || hasDesignerEdit,
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
      hasDesignerEdit,
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
