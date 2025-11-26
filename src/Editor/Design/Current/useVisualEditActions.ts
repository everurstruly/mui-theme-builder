import { useCallback } from 'react';
import { useDesignStore } from './currentStore';

/** Hook that returns explicit visual edit action helpers.
 * These functions are explicit: callers must decide whether an edit
 * is global or scheme-specific. This avoids runtime routing inside
 * the store and keeps actions dumb.
 */
export function useVisualEditActions() {
  const addGlobal = useDesignStore((s) => s.addGlobalVisualEdit);
  const addScheme = useDesignStore((s) => s.addSchemeVisualEdit);
  const removeGlobal = useDesignStore((s) => s.removeGlobalVisualEdit);
  const removeScheme = useDesignStore((s) => s.removeSchemeVisualEdit);
  const removeAll = useDesignStore((s) => s.clearVisualEdits);

  const addGlobalVisualEdit = useCallback((path: string, value: any) => addGlobal(path, value), [addGlobal]);
  const addSchemeVisualEdit = useCallback((scheme: string, path: string, value: any) => addScheme(scheme, path, value), [addScheme]);

  const removeGlobalVisualEdit = useCallback((path: string) => removeGlobal(path), [removeGlobal]);
  const removeSchemeVisualEdit = useCallback((scheme: string, path: string) => removeScheme(scheme, path), [removeScheme]);

  const removeAllVisualEdits = useCallback((scope: 'global' | 'current-scheme' | 'all', scheme: string) => removeAll(scope, scheme), [removeAll]);

  return {
    addGlobalVisualEdit,
    addSchemeVisualEdit,
    removeGlobalVisualEdit,
    removeSchemeVisualEdit,
    removeAllVisualEdits,
  };
}

export type VisualEditActions = ReturnType<typeof useVisualEditActions>;
