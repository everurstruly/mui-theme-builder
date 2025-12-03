import { useCallback, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import useCreatedThemeOption from "../useCreatedThemeOption";
import transformToDualScheme from "./transformToDualScheme";
import useExportOptions from "./useExportOptions";
import { useTitle } from "../Modify/useTitle";

const THEME_PROPERTIES_ORDER = [
  "colorSchemes",
  "palette",
  "typography",
  "spacing",
  "breakpoints",
  "zIndex",
  "transitions",
  "components",
  "shape",
  "shadows",
  "mixins",
];

export default function useExport() {
  const { title } = useTitle();
  const mode = useExportOptions((state) => state.mode);
  const colorScheme = useExportOptions((state) => state.colorScheme);
  const language = useExportOptions((state) => state.language);
  const setMode = useExportOptions((state) => state.setMode);
  const setColorScheme = useExportOptions((state) => state.setColorScheme);
  const setLanguage = useExportOptions((state) => state.setLanguage);

  const lightThemeOptions = useCreatedThemeOption("light");
  const darkThemeOptions = useCreatedThemeOption("dark");

  // 1. Dual Theme Options (Only created once light/dark options change)
  const dualThemeOptions = useMemo(
    () =>
      transformToDualScheme({ light: lightThemeOptions, dark: darkThemeOptions }),
    [lightThemeOptions, darkThemeOptions]
  );

  // 2. Merged Themes (Created from theme options)
  // Optimization: Create a function to conditionally create the theme only when needed.
  // Although the useMemo approach is fine, combining them into one useMemo
  // that depends on the structuredTheme logic (below) is more explicit.
  // However, keeping them separate for clarity and to align with the original structure:
  const lightThemeMerged = useMemo(
    () => createTheme(lightThemeOptions),
    [lightThemeOptions]
  );
  const darkThemeMerged = useMemo(
    () => createTheme(darkThemeOptions),
    [darkThemeOptions]
  );
  const dualThemeMerged = useMemo(
    () => createTheme(dualThemeOptions),
    [dualThemeOptions]
  );

  // 3. Select the Structured Theme based on current state
  // Use a stable, single source for the Theme Options regardless of mode/scheme
  const themeOptionsToExport = useMemo(() => {
    // If mode is 'merged', we want to export the merged theme object.
    if (mode === "merged") {
      if (colorScheme === "dual") return dualThemeMerged;
      if (colorScheme === "light") return lightThemeMerged;
      return darkThemeMerged;
    }

    // If mode is 'diff', we want to export the theme *options*.
    if (colorScheme === "dual") return dualThemeOptions;
    if (colorScheme === "light") return lightThemeOptions;
    return darkThemeOptions;
  }, [
    mode,
    colorScheme,
    dualThemeOptions,
    lightThemeOptions,
    darkThemeOptions,
    dualThemeMerged,
    lightThemeMerged,
    darkThemeMerged,
  ]);

  const getExportCode = useCallback(() => {
    // Type assertion is moved here to ensure we pass a clean object to sortByKeysSequence
    const themeToExport = themeOptionsToExport as Record<string, unknown>;

    // 1. Sort the theme object keys
    const sortedTheme = sortByKeysSequence(
      themeToExport,
      THEME_PROPERTIES_ORDER // Use the constant
    );

    // Guard against empty theme (e.g., if one of the useCreatedThemeOption returns null/undefined)
    if (!sortedTheme || Object.keys(sortedTheme).length === 0) {
      return joinLines([
        "// No theme available",
        "// Please create a theme to export",
      ]);
    }

    // 2. Determine variable name and stringified value
    const variableName = mode === "merged" ? "mergedTheme" : "themeOptions";
    const variableValue = JSON.stringify(sortedTheme, null, 2);

    // 3. Format based on language
    const parts: string[] = [];
    let importLine: string;
    let typeAnnotation: string = "";

    if (language === "js") {
      importLine = "import { createTheme } from '@mui/material/styles';";
    } else if (language === "ts") {
      importLine =
        "import { createTheme, type ThemeOptions } from '@mui/material/styles';";
      // The variable to be exported is either ThemeOptions (for 'diff' mode) or Theme (for 'merged' mode - though createTheme returns ThemeOptions)
      // Since the input to createTheme is always ThemeOptions, we use ThemeOptions for consistency.
      typeAnnotation = ": ThemeOptions";
    } else {
      // Handle unhandled language (like the 'json' type if it existed)
      return joinLines([`// Export language '${language}' is not supported.`]);
    }

    parts.push(importLine, "");
    parts.push(
      `const ${variableName}${typeAnnotation} = createTheme(${variableValue});`
    );
    parts.push("", `export default ${variableName};`, "");

    return joinLines(parts);
  }, [themeOptionsToExport, mode, language]);

  const copyToClipboard = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API not available.");
      }
      await navigator.clipboard.writeText(getExportCode());
    } catch (err) {
      // Use a more descriptive error message
      console.error("Failed to copy export code to clipboard:", err);
      // Optional: Provide visual feedback to the user on failure
    }
  }, [getExportCode]);

  return {
    title,
    mode,
    colorScheme,
    language,
    setMode,
    setColorScheme,
    setLanguage,
    getExportCode,
    copyToClipboard,
  };
}

function sortByKeysSequence(
  obj: Record<string, unknown>,
  order: string[]
): Record<string, unknown> {
  const sortedObj: Record<string, unknown> = {};
  const remainingKeys = new Set(Object.keys(obj));

  // First, add keys in priority order
  for (const key of order) {
    if (key in obj) {
      sortedObj[key] = obj[key];
      remainingKeys.delete(key);
    }
  }

  // Then add remaining keys in alphabetical order
  for (const key of Array.from(remainingKeys).sort()) {
    sortedObj[key] = obj[key];
  }

  return sortedObj;
}

function joinLines(lines: string[]) {
  return lines.join("\n");
}
