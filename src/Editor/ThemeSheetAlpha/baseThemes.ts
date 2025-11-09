import type { ThemeOptions } from '@mui/material/styles';

/**
 * Light mode palette definitions for each base theme
 */
const LIGHT_PALETTES: Record<string, ThemeOptions['palette']> = {
  default: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  
  dark: {
    mode: 'light',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  
  ios: {
    mode: 'light',
    primary: {
      main: '#007aff',
    },
    secondary: {
      main: '#5856d6',
    },
    background: {
      default: '#f2f2f7',
      paper: '#ffffff',
    },
  },
  
  material3: {
    mode: 'light',
    primary: {
      main: '#6750a4',
    },
    secondary: {
      main: '#625b71',
    },
    background: {
      default: '#fffbfe',
      paper: '#fffbfe',
    },
  },
};

/**
 * Dark mode palette definitions for each base theme
 */
const DARK_PALETTES: Record<string, ThemeOptions['palette']> = {
  default: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  
  dark: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
  },
  
  ios: {
    mode: 'dark',
    primary: {
      main: '#0a84ff',
    },
    secondary: {
      main: '#5e5ce6',
    },
    background: {
      default: '#000000',
      paper: '#1c1c1e',
    },
  },
  
  material3: {
    mode: 'dark',
    primary: {
      main: '#d0bcff',
    },
    secondary: {
      main: '#ccc2dc',
    },
    background: {
      default: '#1c1b1f',
      paper: '#2b2930',
    },
  },
};

/**
 * Registry of built-in base themes.
 * These are immutable starting points that users can build upon.
 * Each theme has both light and dark palette definitions.
 */
const BASE_THEMES: Record<string, ThemeOptions> = {
  default: {
    palette: LIGHT_PALETTES.default,
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 8,
  },

  dark: {
    palette: LIGHT_PALETTES.dark,
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 8,
  },

  ios: {
    palette: {
      ...LIGHT_PALETTES.ios,
      primary: {
        main: '#007aff',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", sans-serif',
      fontSize: 17,
    },
    shape: {
      borderRadius: 10,
    },
    spacing: 8,
  },

  material3: {
    palette: LIGHT_PALETTES.material3,
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 4,
  },
};

/**
 * Retrieves a static base theme by reference ID.
 * Applies the appropriate palette based on the current color scheme.
 * @param ref - Theme reference ID (e.g., 'default', 'ios')
 * @param colorScheme - Color scheme to apply ('light' or 'dark')
 * @returns ThemeOptions object, or throws if not found
 */
export const getStaticBaseThemeOptions = (
  ref: string,
  colorScheme: 'light' | 'dark' = 'light'
): ThemeOptions => {
  const theme = BASE_THEMES[ref];
  if (!theme) {
    throw new Error(
      `Unknown base theme reference: "${ref}". Available: ${Object.keys(BASE_THEMES).join(', ')}`
    );
  }

  // Get the appropriate palette for the color scheme
  const palette = colorScheme === 'dark' ? DARK_PALETTES[ref] : LIGHT_PALETTES[ref];

  // Return a deep copy with the correct palette
  return JSON.parse(JSON.stringify({ ...theme, palette }));
};

/**
 * Lists all available base theme IDs.
 */
export const listBaseThemeIds = (): string[] => {
  return Object.keys(BASE_THEMES);
};
