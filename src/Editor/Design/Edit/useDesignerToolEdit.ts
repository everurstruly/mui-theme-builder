import { useMemo } from "react";
import { useEdit } from "./useEdit";
import { getNestedValue, type SerializableValue } from "../compiler";
import useCreatedTheme from "./useCreatedTheme";

export default function useDesignerToolEdit(path: string, scheme?: string | null) {
  const isSchemeSpecific = scheme != null;
  const theme = useCreatedTheme();

  // Narrow selectors — subscribe only to the minimal pieces needed
  const codeValue = useEdit((s) => s.codeOverridesFlattened[path]);
  const globalEdit = useEdit((s) => s.colorSchemeIndependentVisualToolEdits[path]);
  const schemeEdit = useEdit(
    (s) => s.colorSchemes[scheme || ""]?.visualToolEdits[path]
  );

  // Compose the authoritative 'value' (code overrides take precedence)
  const editValue = isSchemeSpecific ? schemeEdit : globalEdit;
  const value = codeValue ?? editValue;

  // Determine whether a visual edit or code override exists
  const hasVisualEdit = typeof editValue === "string" || !!editValue;
  const hasCodeOverride = !!codeValue;

  const resolvedValue = useMemo(() => {
    return getNestedValue(theme, path);
  }, [theme, path]);

  const canReset = hasVisualEdit || hasCodeOverride;

  // Get the appropriate actions (stable function identities from store)
  const addGlobalEdit = useEdit((s) => s.addGlobalVisualEdit);
  const addSchemeEdit = useEdit((s) => s.addSchemeVisualEdit);
  const removeGlobalEdit = useEdit((s) => s.removeGlobalVisualEdit);
  const removeSchemeEdit = useEdit((s) => s.removeSchemeVisualEdit);

  return useMemo(
    () => ({
      value,
      resolvedValue,
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
      value,
      scheme,
      resolvedValue,
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
