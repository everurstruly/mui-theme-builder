import { useEditWithVisualTool } from "../../Design";

export default function useResolvedPaletteShade(path: string) {
  const { value, resolvedValue, setValue, reset, hasVisualEdit, hasCodeOverride } =
    useEditWithVisualTool(path);

  return {
    value: value ?? resolvedValue,
    isResolved: !value && resolvedValue,
    setValue,
    reset,
    hasVisualEdit,
    hasCodeOverride,
  };
}
