import { useShallow } from "zustand/react/shallow";
import { type ThemeOptions } from "@mui/material";
import { useMemo } from "react";
import useCurrent from "./useCurrent";
import {
  parseThemeCode,
  transformDslToThemeOptions,
  createThemeOptionsFromEdits,
} from "../compiler";

export default function useCreatedThemeOption(
  colorScheme?: "light" | "dark"
): ThemeOptions {
  const activeColorScheme = useCurrent((s) => s.activeColorScheme);
  const baseThemeSourceCode = useCurrent((s) => s.baseThemeOptionSource);
  const neutralEdits = useCurrent(useShallow((s) => s.neutralEdits));
  const codeOverridesDsl = useCurrent(useShallow((s) => s.codeOverridesDsl));
  const targetScheme = colorScheme ?? activeColorScheme;
  const schemeEdits = useCurrent(
    useShallow((s) => s.schemeEdits?.[targetScheme] ?? {})
  );

  return useMemo(() => {
    const { colorSchemes, ...baseTheme } = parseThemeCode(baseThemeSourceCode) ?? {};
    baseTheme.palette = {
      mode: targetScheme,
      ...((colorSchemes as any) || {})[targetScheme]?.palette,
    };

    const codeOverrides = transformDslToThemeOptions(codeOverridesDsl, {
      template: baseTheme,
      colorScheme: targetScheme,
    });

    return createThemeOptionsFromEdits({
      template: baseTheme,
      baseVisualToolEdits: neutralEdits,
      colorSchemeVisualToolEdits: schemeEdits?.designer,
      codeOverrides,
      colorScheme: targetScheme,
    });
  }, [
    baseThemeSourceCode,
    neutralEdits,
    schemeEdits,
    codeOverridesDsl,
    targetScheme,
  ]);
}

// extractThemeOptionsForScheme intentionally removed — logic consolidated into useCreatedThemeOption
