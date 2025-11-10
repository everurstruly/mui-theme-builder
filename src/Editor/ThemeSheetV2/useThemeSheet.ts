import { deepmerge } from "@mui/utils";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { useThemeSheetStore } from "./themeSheetStore";
import { getStaticThemeOptionsTemplate } from "./themeOptionsTemplates";

export const useThemeSheet = () => {
  const colorScheme = useThemeSheetStore((state) => state.colorScheme);
  const selectedThemeOptionsTemplateId = useThemeSheetStore(
    (state) => state.selectedThemeOptionsTemplateId
  );
  const themeOptionsUserEdits = useThemeSheetStore(
    (state) => state.themeOptionsUserEdits
  );

  const themeOptions = useMemo(() => {
    console.log("Recalculating... theme options with:", {
      colorScheme,
      selectedThemeOptionsTemplateId,
      themeOptionsUserEdits,
    });
    
    return deepmerge(
      getStaticThemeOptionsTemplate(selectedThemeOptionsTemplateId, colorScheme),
      themeOptionsUserEdits
    );
  }, [colorScheme, selectedThemeOptionsTemplateId, themeOptionsUserEdits]);

  const theme = useMemo(() => {
    try {
      return createTheme(themeOptions);
    } catch (error) {
      console.error("[useThemePreview] Failed to create theme:", error);
      return createTheme(); // Fallback to default MUI theme
    }
  }, [themeOptions]);

  return {
    theme,
    themeOptions,
  };
};

