import { createTheme, type Theme } from "@mui/material";
import { deepMerge } from "../compiler";
import useCreatedTheme from "./useCreatedTheme";
import { useMemo } from "react";

const defaultTheme = createTheme();

// prevents interference from parent themes by merging created theme over default theme 
export default function useCreatedThemePreview() {
  const createdTheme = useCreatedTheme();
  const mergedTheme = useMemo(() => {
    return deepMerge(defaultTheme as any, createdTheme as any) as unknown as Theme;
  }, [createdTheme]);
  return mergedTheme;
}
