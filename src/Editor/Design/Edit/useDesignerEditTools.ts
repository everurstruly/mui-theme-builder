import { useCallback } from "react";
import useEdit from "./useEdit";

export function useDesignerEditTools() {
  const addGlobal = useEdit((s) => s.addGlobalDesignerEdit);
  const addScheme = useEdit((s) => s.addSchemeDesignerEdit);
  const removeGlobal = useEdit((s) => s.removeGlobalDesignerEdit);
  const removeScheme = useEdit((s) => s.removeSchemeDesignerEdit);
  const removeAll = useEdit((s) => s.clearDesignerEdits);

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
