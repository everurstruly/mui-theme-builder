import type { ThemeOptions } from "@mui/material/styles";
import { useThemeSheetStore } from "./themeSheetStore";

const lightModePalettes = {
  default: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  } as ThemeOptions["palette"],

  dark: {
    mode: "light",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  } as ThemeOptions["palette"],

  ios: {
    mode: "light",
    primary: {
      main: "#007aff",
    },
    secondary: {
      main: "#5856d6",
    },
  } as ThemeOptions["palette"],

  material3: {
    mode: "light",
    primary: {
      main: "#6750a4",
    },
    secondary: {
      main: "#625b71",
    },
    background: {
      default: "#fffbfe",
      paper: "#fffbfe",
    },
  } as ThemeOptions["palette"],
};

export type ThemeOptionTemplateId = keyof typeof lightModePalettes;

const darkModePalettes: Record<ThemeOptionTemplateId, ThemeOptions["palette"]> = {
  default: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },

  dark: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#000000",
      paper: "#1a1a1a",
    },
  },

  ios: {
    mode: "dark",
    primary: {
      main: "#0a84ff",
    },
    secondary: {
      main: "#5e5ce6",
    },
  },

  material3: {
    mode: "dark",
    primary: {
      main: "#d0bcff",
    },
    secondary: {
      main: "#ccc2dc",
    },
    background: {
      default: "#1c1b1f",
      paper: "#2b2930",
    },
  },
} as const;

export const themeOptionsTemplatesToMetadata: Record<
  ThemeOptionTemplateId,
  { label: string; description: string }
> = {
  default: {
    label: "Material UI Default",
    description: "The default Material UI theme.",
  },
  dark: {
    label: "Material UI Dark",
    description: "A dark theme for Material UI.",
  },
  ios: {
    label: "Apple iOS",
    description: "A theme inspired by Apple iOS.",
  },
  material3: {
    label: "Material Design 3",
    description: "The latest Material Design 3 theme.",
  },
} as const;

export const themeOptionsTemplateIds = Object.keys(
  lightModePalettes
) as Array<ThemeOptionTemplateId>;

export const getStaticThemeOptionsTemplate = (
  templateId: ThemeOptionTemplateId,
  colorScheme?: "light" | "dark"
): ThemeOptions => {
  const colorMode =
    colorScheme || useThemeSheetStore.getState().colorScheme || "light";

  // Get the appropriate palette for the color scheme
  const palette =
    colorMode === "dark"
      ? darkModePalettes[templateId]
      : lightModePalettes[templateId];

  // Return a deep copy with the correct palette
  return JSON.parse(JSON.stringify({ palette }));
};

export const listThemeOptionsTemplateIds = () => themeOptionsTemplateIds;
