import type { ThemeOptions } from "@mui/material";
import { useMemo } from "react";
import useCurrentDesign from "./useCurrent";
import { createThemeOptionsFromEdits } from "../compiler";

/**
 * Hook for accessing merged theme preview without code overrides.
 * Used for diff comparison in code editor.
 *
 * @param colorScheme - Optional color scheme override (defaults to active scheme)
 * @returns Merged theme preview (excludes code overrides)
 *
 * @example
 * function DiffViewer() {
 *   const mergedPreview = useDesignedEditsResolvedThemeOptions();
 *   return <pre>{JSON.stringify(mergedPreview, null, 2)}</pre>;
 * }
 */
export default function useVisualToolEditsThemeOptions(
  colorScheme?: "light" | "dark"
): ThemeOptions {
  const activeColorScheme = useCurrentDesign((s) => s.activeColorScheme);
  const targetScheme = colorScheme ?? activeColorScheme;

  const baseVisualToolEdits = useCurrentDesign(
    (s) => s.colorSchemeIndependentVisualToolEdits
  );
  const lightMode = useCurrentDesign((s) => s.colorSchemes.light);
  const darkMode = useCurrentDesign((s) => s.colorSchemes.dark);

  const { visualToolEdits } = targetScheme === "light" ? lightMode : darkMode;

  return useMemo(() => {
    return createThemeOptionsFromEdits({
      template: {},
      baseVisualToolEdits: baseVisualToolEdits,
      colorSchemeVisualToolEdits: visualToolEdits,
      codeOverrides: {},
      colorScheme: targetScheme,
    });
  }, [baseVisualToolEdits, visualToolEdits, targetScheme]);
}
