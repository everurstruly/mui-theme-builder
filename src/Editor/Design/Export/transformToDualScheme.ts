import type { ThemeOptions } from "@mui/material";

type DualSchemeThemeOption = Omit<ThemeOptions, "palette"> & {
  colorSchemes: ThemeOptions["colorSchemes"];
};

export default function transformToDualScheme({
  light,
  dark,
}: {
  light: ThemeOptions;
  dark: ThemeOptions;
}): DualSchemeThemeOption {
  const { palette: lightPaletteInput, ...lightRest } = light;
  const { mode: lightMode, ...lightPalette } = lightPaletteInput ?? {};

  const { palette: darkPaletteInput, ...darkRest } = dark;
  const { mode: darkMode, ...darkPalette } = darkPaletteInput ?? {};

  void lightMode;
  void darkMode;

  const mergedBase = lightRest ?? darkRest ?? {};

  return {
    ...mergedBase,
    colorSchemes: {
      light: { palette: lightPalette },
      dark: { palette: darkPalette },
    },
  };
}
