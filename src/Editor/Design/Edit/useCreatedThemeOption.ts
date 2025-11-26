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
  // Subscribe to all relevant state slices with selectors
  const activeColorScheme = useEdit((s) => s.activeColorScheme);
  const baseThemeCode = useEdit((s) => s.baseThemeCode);
  const baseVisualToolEdits = useEdit(
    (s) => s.colorSchemeIndependentVisualToolEdits
  );
  const codeOverridesDsl = useEdit((s) => s.codeOverridesDsl);
  const lightMode = useEdit((s) => s.colorSchemes.light);
  const darkMode = useEdit((s) => s.colorSchemes.dark);

  const targetScheme = colorScheme ?? activeColorScheme;
  const { visualToolEdits } = targetScheme === "light" ? lightMode : darkMode;

  return useMemo(() => {
    // Parse base theme code to ThemeOptions
    const baseTheme = parseThemeCode(baseThemeCode);
    if (!baseTheme) {
      console.error("Failed to parse base theme code");
      return {};
    }

    // Extract scheme-specific options if template uses colorSchemes
    const template = extractThemeOptionsForScheme(baseTheme, targetScheme);

    // Resolve DSL to executable ThemeOptions (only if DSL exists)
    const codeOverrides =
      Object.keys(codeOverridesDsl).length > 0
        ? transformDslToThemeOptions(codeOverridesDsl, {
            template,
            colorScheme: targetScheme,
            spacingFactor: 8, // TODO: get from template if available
          })
        : {};

    // Resolve all layers
    return createThemeOptionsFromEdits({
      template,
      baseVisualToolEdits,
      colorSchemeVisualToolEdits: visualToolEdits,
      codeOverrides: codeOverrides,
      colorScheme: targetScheme,
    });
  }, [
    baseThemeCode,
    baseVisualToolEdits,
    codeOverridesDsl,
    visualToolEdits,
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
