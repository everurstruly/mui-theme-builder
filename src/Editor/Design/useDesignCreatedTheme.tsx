import { useMemo } from "react";
import { useResolvedThemeOptions } from ".";
import { createTheme, type Theme } from "@mui/material";

export default function useDesignCreatedTheme(colorScheme?: "light" | "dark"): Theme {
  const themeOptions = useResolvedThemeOptions(colorScheme);

  return useMemo(() => {
    try {
      return createTheme(themeOptions);
    } catch (error) {
      console.error("[useThemeDesignTheme] Failed to create theme:", error);
      return createTheme();
    }
  }, [themeOptions]);
}
