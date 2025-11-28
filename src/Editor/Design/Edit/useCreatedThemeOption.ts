import { type ThemeOptions } from "@mui/material";
import { useMemo } from "react";
import useEdit from "./useEdit";

import {
  createThemeOptionsFromEdits,
  deepMerge,
  parseThemeCode,
  transformDslToThemeOptions,
} from "../compiler";

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
  const activeColorScheme = useEdit((s) => s.activeColorScheme);
  const baseThemeCode = useEdit((s) => s.baseThemeCode);
  const baseVisualToolEdits = useEdit(
    (s) => s.colorSchemeIndependentVisualToolEdits
  );
  const codeOverridesDsl = useEdit((s) => s.codeOverridesDsl);
  const lightModeVisual = useEdit((s) => s.colorSchemes.light?.visualToolEdits);
  const darkModeVisual = useEdit((s) => s.colorSchemes.dark?.visualToolEdits);

  const targetScheme = colorScheme ?? activeColorScheme;

  return useMemo(() => {
    const baseTheme = parseThemeCode(baseThemeCode) ?? {};
    const baseThemeOption = extractThemeOptionsForScheme(baseTheme, targetScheme);
    const designerToolEdits =
      targetScheme === "light" ? lightModeVisual : darkModeVisual ?? {};
    const codeOverrides = transformDslToThemeOptions(codeOverridesDsl, {
      template: baseThemeOption,
      colorScheme: targetScheme,
      spacingFactor: 8, // TODO: get from template if available
    });

    return createThemeOptionsFromEdits({
      template: baseThemeOption,
      baseVisualToolEdits,
      colorSchemeVisualToolEdits: designerToolEdits,
      codeOverrides: codeOverrides,
      colorScheme: targetScheme,
    });
  }, [
    baseThemeCode,
    baseVisualToolEdits,
    codeOverridesDsl,
    lightModeVisual,
    darkModeVisual,
    targetScheme,
  ]);
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
