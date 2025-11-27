import { useCallback } from "react";
import { useEdit } from "./useEdit";

export function useDesignerEditTools() {
  const addGlobal = useEdit((s) => s.addGlobalVisualEdit);
  const addScheme = useEdit((s) => s.addSchemeVisualEdit);
  const removeGlobal = useEdit((s) => s.removeGlobalVisualEdit);
  const removeScheme = useEdit((s) => s.removeSchemeVisualEdit);
  const removeAll = useEdit((s) => s.clearVisualEdits);

  const addGlobalVisualEdit = useCallback(
    (path: string, value: any) => addGlobal(path, value),
    [addGlobal]
  );
  const addSchemeVisualEdit = useCallback(
    (scheme: string, path: string, value: any) => addScheme(scheme, path, value),
    [addScheme]
  );

  const removeGlobalVisualEdit = useCallback(
    (path: string) => removeGlobal(path),
    [removeGlobal]
  );
  const removeSchemeVisualEdit = useCallback(
    (scheme: string, path: string) => removeScheme(scheme, path),
    [removeScheme]
  );

  const removeAllVisualEdits = useCallback(
    (scope: "global" | "current-scheme" | "all", scheme: string) =>
      removeAll(scope, scheme),
    [removeAll]
  );

  return {
    addGlobalVisualEdit,
    addSchemeVisualEdit,
    removeGlobalVisualEdit,
    removeSchemeVisualEdit,
    removeAllVisualEdits,
  };
}

export type DesignerEditTools = ReturnType<typeof useDesignerEditTools>;
