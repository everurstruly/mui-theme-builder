import type { ThemeOptions } from "@mui/material";

type DualSchemeThemeOption = Exclude<ThemeOptions, "palette"> & {
  colorSchemes: {
    light: { palette: ThemeOptions["palette"] };
    dark: { palette: ThemeOptions["palette"] };
  };
};

export default function transformToDualScheme({
  light,
  dark,
}: {
  light: ThemeOptions;
  dark: ThemeOptions;
}): DualSchemeThemeOption {
  const { palette: lightPalette, ...lightRest } = light;
  const { palette: darkPalette, ...darkRest } = dark;

  return {
    ...lightRest,
    ...darkRest,
    colorSchemes: {
      light: { palette: lightPalette },
      dark: { palette: darkPalette },
    },
  };
}
