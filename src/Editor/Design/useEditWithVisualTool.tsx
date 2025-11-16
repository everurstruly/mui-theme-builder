import useDesignCreatedTheme from "./useDesignCreatedTheme";
import { useMemo } from "react";
import { useDesignStore, type SerializableValue } from "./designStore";
import { getNestedValue } from "./shared";

export default function useEditWithVisualTool(path: string) {
  const theme = useDesignCreatedTheme();
  const codeFlattened = useDesignStore((s) => s.codeOverridesFlattened);
  const getDesignToolEdit = useDesignStore((s) => s.getDesignToolEdit);
  
  const codeValue = codeFlattened[path];
  const autoResolvedValue = getNestedValue(theme, path);
  const editValue = getDesignToolEdit(path);

  const value = codeValue ?? editValue;
  const hasVisualEdit = !!editValue;
  const hasCodeOverride = !!codeValue;

  const setVisualEdit = useDesignStore((s) => s.addDesignToolEdit);
  const resetPath = useDesignStore((s) => s.removeDesignToolEdit);

  return useMemo(
    () => ({
      value,
      resolvedValue: autoResolvedValue,
      hasCodeOverride,
      hasVisualEdit,
      isModified: hasCodeOverride || hasVisualEdit,
      setValue: (value: SerializableValue) => setVisualEdit(path, value),
      reset: () => resetPath(path),
    }),
    [
      value,
      autoResolvedValue,
      hasCodeOverride,
      hasVisualEdit,
      setVisualEdit,
      path,
      resetPath,
    ]
  );
}
