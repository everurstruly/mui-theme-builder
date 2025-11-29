import { useRef, useMemo } from "react";
import { parseThemeCode, createThemeOptionsFromEdits, transformDslToThemeOptions, deepMerge } from "../compiler";
import { usePerformance } from "../../../utils/performanceMonitor";
import useEdit from "./useEdit";

export function useThemeCompilerCache() {
  const baseThemeCode = useEdit((s) => s.baseThemeCode);
  const baseVisualToolEdits = useEdit((s) => s.colorSchemeIndependentVisualToolEdits);
  const colorSchemes = useEdit((s) => s.colorSchemes);
  const codeOverridesDsl = useEdit((s) => s.codeOverridesDsl);
  const activeColorScheme = useEdit((s) => s.activeColorScheme);

  const cacheRef = useRef<{ cacheKey: string; compiledTheme: any }>({ cacheKey: "", compiledTheme: {} });

  const performance = usePerformance();

  return useMemo(() => {
    return performance.measure("theme-compilation", () => {
    const cacheKey = JSON.stringify({
      baseThemeCode,
      baseVisualToolEdits,
      colorSchemes,
      codeOverridesDsl,
      activeColorScheme,
    });

    // Defensive: ensure ref.current is initialized (avoids rare runtime undefined)
    if (!cacheRef.current) {
      cacheRef.current = { cacheKey: "", compiledTheme: null };
    }

    if (cacheRef.current.cacheKey === cacheKey) {
      return cacheRef.current.compiledTheme || {};
    }

    const baseTheme = parseThemeCode(baseThemeCode) ?? {};

    // If the parsed base theme uses `colorSchemes` structure, merge the
    // selected scheme onto the base for a consistent template shape.
    let baseTemplate = baseTheme;
    try {
      if (
        baseTheme &&
        typeof baseTheme === "object" &&
        (baseTheme as any).colorSchemes &&
        (baseTheme as any).colorSchemes[activeColorScheme]
      ) {
        const schemeOpts = (baseTheme as any).colorSchemes[activeColorScheme];
        const { colorSchemes, ...base } = baseTheme as any;
        void colorSchemes;
        baseTemplate = deepMerge(base || {}, schemeOpts || {});
      }
    } catch {
      baseTemplate = baseTheme;
    }

    const codeOverrides = transformDslToThemeOptions(codeOverridesDsl, {
      template: baseTemplate,
      colorScheme: activeColorScheme,
      spacingFactor: 8,
    });

    const compiledTheme = createThemeOptionsFromEdits({
      template: baseTemplate,
      baseVisualToolEdits,
      colorSchemeVisualToolEdits: colorSchemes[activeColorScheme]?.visualToolEdits ?? {},
      codeOverrides,
      colorScheme: activeColorScheme,
    });

      cacheRef.current = { cacheKey, compiledTheme };
      return compiledTheme || {};
    });
  }, [baseThemeCode, baseVisualToolEdits, colorSchemes, codeOverridesDsl, activeColorScheme, performance]);
}
