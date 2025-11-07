/**
 * Theme Hydration Utilities
 *
 * Merges theme object with function strings to create a complete ThemeOptions
 */

import type { ThemeOptions } from "@mui/material";

/**
 * Set a nested value in an object using dot notation path
 */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Safely evaluate a function string
 * Returns the function or undefined if evaluation fails
 */
function evaluateFunctionString(
  fnCode: string
): ((...args: unknown[]) => unknown) | undefined {
  try {
    // Wrap in parentheses to ensure it's treated as an expression
    return eval(`(${fnCode})`);
  } catch (error) {
    console.error("[themeHydration] Failed to evaluate function:", error);
    console.error("Function code:", fnCode);
    return undefined;
  }
}

/**
 * Default minimal theme to prevent crashes
 */
const DEFAULT_THEME: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
};

/**
 * Merge with default theme to ensure critical properties exist
 */
function ensureThemeDefaults(theme: ThemeOptions | undefined): ThemeOptions {
  // If theme is empty or missing palette, use defaults
  if (!theme || Object.keys(theme).length === 0 || !theme.palette) {
    console.warn("[themeHydration] Theme is empty or invalid, using defaults");
    return { ...DEFAULT_THEME };
  }

  return theme;
}

/**
 * Hydrate theme by merging base theme with function overrides
 *
 * @param theme - Base theme object (serializable, no functions)
 * @param themeFunctions - Map of paths to function code strings
 * @returns Complete ThemeOptions with functions evaluated
 */
export function hydrateTheme(
  theme: ThemeOptions | undefined,
  themeFunctions: Record<string, string>
): ThemeOptions {
  const safeTheme = ensureThemeDefaults(theme);
  const hydrated = JSON.parse(JSON.stringify(safeTheme));

  for (const [path, fnCode] of Object.entries(themeFunctions)) {
    const fn = evaluateFunctionString(fnCode);
    if (fn) {
      setNestedValue(hydrated, path, fn);
    }
  }

  return hydrated;
}

/**
 * Hook to get the hydrated theme from workfile store
 * Use this instead of accessing theme directly when you need functions
 */
import { useMemo } from "react";
import useWorkfileStore from "./useWorkfileStore";

export default function useWorkfileHydratedTheme(): ThemeOptions {
  const themeModifications = useWorkfileStore((state) => state.themeModifications);
  const themeFunctionsModifications = useWorkfileStore(
    (state) => state.themeFunctionsModification
  );

  return useMemo(() => {
    return hydrateTheme(themeModifications, themeFunctionsModifications);
  }, [themeModifications, themeFunctionsModifications]);
}
