import { useCallback, useMemo } from 'react';
import useEdit from './useEdit';
import useCreatedTheme from './useCreatedTheme';
import { getNestedValue, type SerializableValue } from '../compiler';
import { getEditScope } from '../utilities/themePathUtils';

export default function useThemeEdit(path: string) {
  const activeScheme = useEdit((s) => s.activeColorScheme);
  const actualTheme = useCreatedTheme((activeScheme as 'light' | 'dark') || undefined);

  const scope = getEditScope(path);

  const userEdit = useEdit(
    useCallback(
      (s) =>
        scope === 'scheme'
          ? s.colorSchemes[activeScheme]?.visualToolEdits?.[path]
          : s.colorSchemeIndependentVisualToolEdits?.[path],
      [scope, activeScheme, path]
    )
  );

  const codeOverride = useEdit(useCallback((s) => s.codeOverridesFlattened?.[path], [path]));

  const value = useMemo(() => {
    return getNestedValue(actualTheme, path) as SerializableValue | undefined;
  }, [actualTheme, path]);

  const addGlobal = useEdit((s) => s.addGlobalVisualEdit);
  const addScheme = useEdit((s) => s.addSchemeVisualEdit);
  const removeGlobal = useEdit((s) => s.removeGlobalVisualEdit);
  const removeScheme = useEdit((s) => s.removeSchemeVisualEdit);

  const setValue = (v: SerializableValue) => {
    if (scope === 'scheme') {
      addScheme(activeScheme, path, v);
    } else {
      addGlobal(path, v);
    }
  };

  const reset = () => {
    if (scope === 'scheme') {
      removeScheme(activeScheme, path);
    } else {
      removeGlobal(path);
    }
  };

  return {
    value,
    userEdit,
    isCodeControlled: !!codeOverride,
    isModified: !!userEdit || !!codeOverride,
    setValue,
    reset,
  } as const;
}
