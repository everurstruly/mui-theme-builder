import useDesignCreatedTheme from "./useCreatedTheme";
import { useMemo } from "react";
import { useEdit } from "./useEdit";
import { getNestedValue, type SerializableValue } from "../compiler";

export default function useEditWithDesignerTool(path: string, scheme?: string | null) {
  const theme = useDesignCreatedTheme();
  const codeFlattened = useEdit((s) => s.codeOverridesFlattened);
  
  // Determine if this usage intends scheme-specific edits. Caller must provide `scheme`.
  const isSchemeSpecific = scheme != null;
  
  // Get the appropriate edit value
  const getGlobalEdit = useEdit((s) => s.getGlobalVisualEdit);
  const getSchemeEdit = useEdit((s) => s.getSchemeVisualEdit);
  const editValue = isSchemeSpecific 
    ? getSchemeEdit(scheme as string, path)
    : getGlobalEdit(path);

  const codeValue = codeFlattened[path];
  const autoResolvedValue = getNestedValue(theme, path) as SerializableValue;

  const value = codeValue ?? editValue;
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
      value,
      resolvedValue: autoResolvedValue,
      hasCodeOverride,
      hasVisualEdit,
      canReset,
      isModified: hasCodeOverride || hasVisualEdit,
      setValue: (value: SerializableValue) => 
        isSchemeSpecific 
          ? addSchemeEdit(scheme as string, path, value)
          : addGlobalEdit(path, value),
      reset: () => 
        isSchemeSpecific
          ? removeSchemeEdit(scheme as string, path)
          : removeGlobalEdit(path),
    }),
    [
      value,
      scheme,
      autoResolvedValue,
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
