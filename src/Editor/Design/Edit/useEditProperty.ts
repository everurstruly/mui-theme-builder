import useEdit from "./useEdit";
import { useMemo } from "react";
import useCreatedTheme from "./useCreatedTheme";
import { getNestedValue, type SerializableValue } from "../compiler";
import { getEditScope } from "../utilities/themePathUtils";
import { useShallow } from "zustand/react/shallow";

export default function useEditProperty(path: string) {
  const activeScheme = useEdit((s) => s.activeColorScheme);
  const actualTheme = useCreatedTheme(activeScheme);
  const scope = getEditScope(path);

  const codeOverride = useEdit(useShallow((s) => s.codeOverridesEdits?.[path]));
  const editValue = useEdit(
    useShallow((s) =>
      scope === "scheme"
        ? s.schemeEdits[activeScheme]?.designer?.[path]
        : s.neutralEdits?.[path]
    )
  );

  const effectiveValue = useMemo(() => {
    return getNestedValue(actualTheme, path) as SerializableValue | undefined;
  }, [actualTheme, path]);

  const addGlobal = useEdit((s) => s.addGlobalDesignerEdit);
  const addScheme = useEdit((s) => s.addSchemeDesignerEdit);
  const removeGlobal = useEdit((s) => s.removeGlobalDesignerEdit);
  const removeScheme = useEdit((s) => s.removeSchemeDesignerEdit);

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
