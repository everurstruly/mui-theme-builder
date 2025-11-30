import { type ThemeOptions } from "@mui/material";
import { useMemo, useRef } from "react";
import useEdit from "./useEdit";
import { deepMerge } from "../compiler";
import { parseThemeCode, transformDslToThemeOptions, createThemeOptionsFromEdits } from "../compiler";

export default function useCreatedThemeOption(
  colorScheme?: "light" | "dark"
): ThemeOptions {
  const baseThemeCode = useEdit((s) => s.baseThemeCode);
  const baseVisualToolEdits = useEdit((s) => s.colorSchemeIndependentVisualToolEdits);
  const colorSchemes = useEdit((s) => s.colorSchemes);
  const codeOverridesDsl = useEdit((s) => s.codeOverridesDsl);
  const activeColorScheme = useEdit((s) => s.activeColorScheme);
  
  const targetScheme = colorScheme ?? activeColorScheme;
  
  // 🎯 ADD CACHING here instead of separate hook
  const cacheRef = useRef<{ cacheKey: string; themeOptions: ThemeOptions }>({ 
    cacheKey: "", 
    themeOptions: {} 
  });

  return useMemo(() => {
    const cacheKey = JSON.stringify({
      baseThemeCode,
      baseVisualToolEdits,
      colorSchemes,
      codeOverridesDsl,
      targetScheme,
    });

    if (cacheRef.current.cacheKey === cacheKey) {
      return cacheRef.current.themeOptions;
    }

    // Original logic from useThemeCompilerCache
    const baseTheme = parseThemeCode(baseThemeCode) ?? {};
    let baseTemplate = baseTheme;
    
    // Handle colorSchemes structure
    try {
      if (
        baseTheme &&
        typeof baseTheme === "object" &&
        (baseTheme as any).colorSchemes &&
        (baseTheme as any).colorSchemes[targetScheme]
      ) {
        const schemeOpts = (baseTheme as any).colorSchemes[targetScheme];
        const { colorSchemes, ...base } = baseTheme as any;
        baseTemplate = deepMerge(base || {}, schemeOpts || {});
      }
    } catch {
      baseTemplate = baseTheme;
    }

    const codeOverrides = transformDslToThemeOptions(codeOverridesDsl, {
      template: baseTemplate,
      colorScheme: targetScheme,
      spacingFactor: 8,
    });

    const themeOptions = createThemeOptionsFromEdits({
      template: baseTemplate,
      baseVisualToolEdits,
      colorSchemeVisualToolEdits: colorSchemes[targetScheme]?.visualToolEdits ?? {},
      codeOverrides,
      colorScheme: targetScheme,
    });

    cacheRef.current = { cacheKey, themeOptions };
    return themeOptions;
  }, [baseThemeCode, baseVisualToolEdits, colorSchemes, codeOverridesDsl, targetScheme]);
}

// extractThemeOptionsForScheme intentionally removed — logic consolidated into useCreatedThemeOption
