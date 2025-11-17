import { useMemo } from "react";
import { useCreatedThemeOption } from ".";
import { createTheme, type Theme } from "@mui/material";

export default function useCreatedTheme(
  colorScheme?: "light" | "dark"
): Theme {
  const themeOptions = useCreatedThemeOption(colorScheme);
  return useMemo(() => {
    try {
      return createTheme(themeOptions);
    } catch (err) {
      // Fail-safe: if an invalid value makes it into ThemeOptions (for example
      // an unsupported color like the identifier `red`) we must not let the
      // entire app crash. Log the error and fall back to the default theme.
      // The pre-apply validator should catch these issues; this is a runtime
      // safety net.
      // eslint-disable-next-line no-console
      console.error('createTheme failed for user ThemeOptions:', err);
      return createTheme();
    }
  }, [themeOptions]);
}
