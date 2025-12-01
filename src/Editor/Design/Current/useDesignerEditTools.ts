import { useCallback } from "react";
import useCurrent from "./useCurrent";

export function useDesignerEditTools() {
  const addGlobal = useCurrent((s) => s.addNeutralDesignerEdit);
  const addScheme = useCurrent((s) => s.addSchemeDesignerEdit);
  const removeGlobal = useCurrent((s) => s.removeNeutralDesignerEdit);
  const removeScheme = useCurrent((s) => s.removeSchemeDesignerEdit);
  const removeAll = useCurrent((s) => s.clearDesignerEdits);

  const addGlobalDesignerEdit = useCallback(
    (path: string, value: any) => addGlobal(path, value),
    [addGlobal]
  );
  const addSchemeDesignerEdit = useCallback(
    (scheme: string, path: string, value: any) => addScheme(scheme, path, value),
    [addScheme]
  );

  const removeGlobalDesignerEdit = useCallback(
    (path: string) => removeGlobal(path),
    [removeGlobal]
  );
  const removeSchemeDesignerEdit = useCallback(
    (scheme: string, path: string) => removeScheme(scheme, path),
    [removeScheme]
  );

  const removeAllDesignerEdits = useCallback(
    (scope: "global" | "current-scheme" | "all", scheme: string) =>
      removeAll(scope, scheme),
    [removeAll]
  );

  return {
    addGlobalDesignerEdit,
    addSchemeDesignerEdit,
    removeGlobalDesignerEdit,
    removeSchemeDesignerEdit,
    removeAllDesignerEdits,
  };
}

export type DesignerEditTools = ReturnType<typeof useDesignerEditTools>;
