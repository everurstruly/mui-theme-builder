import createThemeOptionsFromEdits from "./createThemeOptionsFromEdits";
import type { ThemeOptions } from "@mui/material";
import { useDesignStore } from "./designStore";
import { useMemo } from "react";

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
  const activeColorScheme = useDesignStore((s) => s.activeColorScheme);
  const targetScheme = colorScheme ?? activeColorScheme;

  const baseVisualToolEdits = useDesignStore(
    (s) => s.colorSchemeIndependentVisualToolEdits
  );
  const lightMode = useDesignStore((s) => s.light);
  const darkMode = useDesignStore((s) => s.dark);

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
