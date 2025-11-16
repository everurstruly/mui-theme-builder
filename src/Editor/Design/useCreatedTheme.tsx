import { useMemo } from "react";
import { useCreatedThemeOption } from ".";
import { createTheme, type Theme } from "@mui/material";

export default function useCreatedTheme(
  colorScheme?: "light" | "dark"
): Theme {
  const themeOptions = useCreatedThemeOption(colorScheme);
  return useMemo(() => {
    return createTheme(themeOptions);
  }, [themeOptions]);
}
