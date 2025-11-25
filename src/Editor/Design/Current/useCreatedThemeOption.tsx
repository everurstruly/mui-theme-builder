import createThemeOptionsFromEdits from "../domainSpecificLanguage/createThemeOptionsFromEdits";
import { useDesignStore } from "./designStore";
import { parseThemeCode } from "../domainSpecificLanguage/codeParser";
import { transformDslToThemeOptions } from "../domainSpecificLanguage/dslToThemeOptionsTransformer";
import { extractThemeOptionsForScheme } from "../../Templates/registry";
import { type ThemeOptions } from "@mui/material";
import { useMemo } from "react";

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
  const activeColorScheme = useDesignStore((s) => s.activeColorScheme);
  const baseThemeCode = useDesignStore((s) => s.baseThemeCode);
  const baseVisualToolEdits = useDesignStore(
    (s) => s.colorSchemeIndependentVisualToolEdits
  );
  const codeOverridesDsl = useDesignStore((s) => s.codeOverridesDsl);
  const lightMode = useDesignStore((s) => s.light);
  const darkMode = useDesignStore((s) => s.dark);

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
