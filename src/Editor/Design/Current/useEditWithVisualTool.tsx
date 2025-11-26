import useDesignCreatedTheme from "./useCreatedTheme";
import { useMemo } from "react";
import { useDesignStore } from "./currentStore";
import { getNestedValue, type SerializableValue } from "../compiler";

// NOTE: This hook no longer decides whether a path is scheme-specific.
// Callers must explicitly pass a `scheme` when they intend scheme-scoped edits.
export default function useEditWithVisualTool(path: string, scheme?: string | null) {
  const theme = useDesignCreatedTheme();
  const codeFlattened = useDesignStore((s) => s.codeOverridesFlattened);
  
  // Determine if this usage intends scheme-specific edits. Caller must provide `scheme`.
  const isSchemeSpecific = scheme != null;
  
  // Get the appropriate edit value
  const getGlobalEdit = useDesignStore((s) => s.getGlobalVisualEdit);
  const getSchemeEdit = useDesignStore((s) => s.getSchemeVisualEdit);
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
  const addGlobalEdit = useDesignStore((s) => s.addGlobalVisualEdit);
  const addSchemeEdit = useDesignStore((s) => s.addSchemeVisualEdit);
  const removeGlobalEdit = useDesignStore((s) => s.removeGlobalVisualEdit);
  const removeSchemeEdit = useDesignStore((s) => s.removeSchemeVisualEdit);

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
