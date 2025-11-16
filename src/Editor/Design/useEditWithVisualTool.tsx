import useDesignCreatedTheme from "./useDesignCreatedTheme";
import { useMemo } from "react";
import { useDesignStore, type SerializableValue } from "./designStore";
import { getNestedValue } from "./shared";

export default function useEditWithVisualTool(path: string) {
  const theme = useDesignCreatedTheme();
  const codeFlattened = useDesignStore((s) => s.codeOverridesFlattened);

  const getDesignToolEdit = useDesignStore((s) => s.getDesignToolEdit);
  
  const codeValue = codeFlattened[path];
  const resolvedValue = getNestedValue(theme as Record<string, any>, path);
  const editValue = getDesignToolEdit(path);

  const value = codeValue ?? editValue ?? resolvedValue;
  const hasVisualEdit = !!editValue;
  const hasCodeOverride = path in codeFlattened;

  const setVisualEdit = useDesignStore((s) => s.addDesignToolEdit);
  const resetPath = useDesignStore((s) => s.removeDesignToolEdit);

  return useMemo(
    () => ({
      value,
      resolvedValue,
      hasCodeOverride,
      hasVisualEdit,
      isModified: hasCodeOverride || hasVisualEdit,
      setValue: (value: SerializableValue) => setVisualEdit(path, value),
      reset: () => resetPath(path),
    }),
    [
      value,
      resolvedValue,
      hasCodeOverride,
      hasVisualEdit,
      setVisualEdit,
      path,
      resetPath,
    ]
  );
}
