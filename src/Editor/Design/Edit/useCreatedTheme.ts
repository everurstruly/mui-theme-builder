import { useMemo } from "react";
import { createTheme, type Theme } from "@mui/material";
import useCreatedThemeOption from "./useCreatedThemeOption";

export default function useCreatedTheme(colorScheme?: "light" | "dark"): Theme {
  const themeOptions = useCreatedThemeOption(colorScheme);
  return useMemo(() => {
    try {
      return createTheme(themeOptions);
    } catch (err) {
      console.error("createTheme failed for user ThemeOptions:", err);
      console.log("themeOptions:", themeOptions);
      return createTheme();
    }
  }, [themeOptions]);
}
