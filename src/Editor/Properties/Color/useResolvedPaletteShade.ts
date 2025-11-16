import {
  useDesignedEditsResolvedThemeOptions,
  useThemeDesignEditValue,
  useThemeDesignTheme,
} from "../../Design";
import { getNestedValue } from "../../Design/shared";

export default function useResolvedPaletteShade(path: string) {
  const { value, setValue, reset, hasVisualEdit, hasCodeOverride } =
    useThemeDesignEditValue(path);

  const resolvedTheme = useThemeDesignTheme();
  const resolvedThemeOptions = useDesignedEditsResolvedThemeOptions();

  const expectedShade = getNestedValue(resolvedThemeOptions as any, path);
  const resolvedShade = getNestedValue(resolvedTheme as any, path);
  const isResolved = resolvedShade && !expectedShade;

  return {
    value: value ?? resolvedShade,
    isResolved,
    setValue,
    reset,
    hasVisualEdit,
    hasCodeOverride,
  };
}
