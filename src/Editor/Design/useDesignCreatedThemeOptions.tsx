import createThemeOptionsFromEdits from "./createThemeOptionsFromEdits";
import { useDesignStore } from "./designStore";
import { transformDslToThemeOptions } from "./domainSpecificLanguage/dslToThemeOptionsTransformer";
import { getDesignTemplate } from "./designTemplates";
import { type ThemeOptions } from "@mui/material";
import { useMemo } from "react";

/**
 * Internal hook that resolves ThemeOptions from all layers.
 * Used by useThemeDesignTheme to compute the final theme.
 *
 * @param colorScheme - Target color scheme (defaults to active scheme)
 * @returns Resolved ThemeOptions ready for createTheme()
 */
export default function useDesignCreatedThemeOptions(
  colorScheme?: "light" | "dark"
): ThemeOptions {
  // Subscribe to all relevant state slices with selectors
  const activeColorScheme = useDesignStore((s) => s.activeColorScheme);
  const templateId = useDesignStore((s) => s.selectedTemplateId.id);
  const baseDesignToolEdits = useDesignStore(
    (s) => s.colorSchemeIndependentDesignToolEdits
  );
  const codeOverridesDsl = useDesignStore((s) => s.codeOverridesDsl);
  const lightMode = useDesignStore((s) => s.light);
  const darkMode = useDesignStore((s) => s.dark);

  const targetScheme = colorScheme ?? activeColorScheme;
  const { designToolEdits } = targetScheme === "light" ? lightMode : darkMode;

  return useMemo(() => {
    // Get base template
    const template = getDesignTemplate(templateId, targetScheme);

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
      baseDesignToolEdits,
      colorSchemeDesignToolEdits: designToolEdits,
      codeOverrides: codeOverrides,
      colorScheme: targetScheme,
    });
  }, [
    templateId,
    baseDesignToolEdits,
    codeOverridesDsl,
    designToolEdits,
    targetScheme,
  ]);
}
