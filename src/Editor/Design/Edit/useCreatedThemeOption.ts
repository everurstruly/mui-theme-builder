import { type ThemeOptions } from "@mui/material";
import { useMemo } from "react";
import useEdit from "./useEdit";
import { useThemeCompilerCache } from "./useThemeCompilerCache";

import { deepMerge } from "../compiler";

/**
 * Internal hook that resolves ThemeOptions from all layers.
 * Used by useCreatedTheme to compute the final theme.
 *
 * @param colorScheme - Target color scheme (defaults to active scheme)
 * @returns Resolved ThemeOptions ready for createTheme()
 */

export default function useCreatedThemeOption(
  colorScheme?: "light" | "dark"
): ThemeOptions {
  const compiledTheme = useThemeCompilerCache();

  const activeColorScheme = useEdit((s) => s.activeColorScheme);
  const targetScheme = colorScheme ?? activeColorScheme;

  return useMemo(() => {
    return extractThemeOptionsForScheme(compiledTheme, targetScheme);
  }, [compiledTheme, targetScheme]);
}

/**
 * Resolve a ThemeOptions for a specific color scheme when templates use the
 * `colorSchemes` structure. If template already is a flat ThemeOptions (old
 * format), it will be returned as-is.
 */
function extractThemeOptionsForScheme(
  themeOptions: ThemeOptions,
  scheme: "light" | "dark"
): ThemeOptions {
  if (
    themeOptions.colorSchemes &&
    typeof themeOptions.colorSchemes === "object" &&
    scheme in themeOptions.colorSchemes
  ) {
    const schemeOpts = (themeOptions.colorSchemes as Record<string, any>)[scheme] as
      | Record<string, any>
      | undefined;

    const { colorSchemes, ...base } = themeOptions as Record<string, any>;

    if (schemeOpts) {
      void colorSchemes;
      return deepMerge(base as Record<string, any>, schemeOpts) as ThemeOptions;
    }
  }

  // Fallback: return template as-is
  return themeOptions;
}
