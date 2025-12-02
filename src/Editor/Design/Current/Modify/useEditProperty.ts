import useCurrent from "../useCurrent";
import { useMemo } from "react";
import useCreatedTheme from "../useCreatedTheme";
import { getNestedValue, type SerializableValue } from "../../compiler";
import { getEditScope } from "./themePathUtils";
import { useShallow } from "zustand/react/shallow";

export default function useEditProperty(path: string) {
  const activeScheme = useCurrent((s) => s.activeColorScheme);
  const actualTheme = useCreatedTheme(activeScheme);
  const scope = getEditScope(path);

  const codeOverride = useCurrent(useShallow((s) => s.codeOverridesEdits?.[path]));
  const editValue = useCurrent(
    useShallow((s) =>
      scope === "scheme"
        ? s.schemeEdits[activeScheme]?.designer?.[path]
        : s.neutralEdits?.[path]
    )
  );

  const effectiveValue = useMemo(() => {
    return getNestedValue(actualTheme, path) as SerializableValue | undefined;
  }, [actualTheme, path]);

  const addGlobal = useCurrent((s) => s.addNeutralDesignerEdit);
  const addScheme = useCurrent((s) => s.addSchemeDesignerEdit);
  const removeGlobal = useCurrent((s) => s.removeNeutralDesignerEdit);
  const removeScheme = useCurrent((s) => s.removeSchemeDesignerEdit);

  const setValue = (v: SerializableValue) => {
    if (scope === "scheme") {
      addScheme(activeScheme, path, v);
    } else {
      addGlobal(path, v);
    }
  };

  const reset = () => {
    if (scope === "scheme") {
      removeScheme(activeScheme, path);
    } else {
      removeGlobal(path);
    }
  };

  return {
    value: effectiveValue,
    userEdit: editValue,
    isCodeControlled: !!codeOverride,
    isModified: !!editValue || !!codeOverride,
    setValue,
    reset,
  } as const;
}
