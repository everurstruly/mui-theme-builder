import { useMemo } from "react";
import { useDesignCreatedThemeOption } from ".";
import { createTheme, type Theme } from "@mui/material";

export default function useDesignCreatedTheme(
  colorScheme?: "light" | "dark"
): Theme {
  const themeOptions = useDesignCreatedThemeOption(colorScheme);
  return useMemo(() => {
    return createTheme(themeOptions);
  }, [themeOptions]);
}
