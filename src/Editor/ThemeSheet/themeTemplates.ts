import type { ThemeOptions } from '@mui/material/styles';

/**
 * Light mode palette definitions for each theme template
 */
const LIGHT_PALETTES: Record<string, ThemeOptions['palette']> = {
  material: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  
  materialDark: {
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
 * Dark mode palette definitions for each theme template
 */
const DARK_PALETTES: Record<string, ThemeOptions['palette']> = {
  material: {
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
  
  materialDark: {
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
 * Registry of built-in theme templates.
 * These are immutable starting points that users can build upon.
 * Each template has both light and dark palette definitions.
 */
const THEME_TEMPLATES: Record<string, ThemeOptions> = {
  material: {
    palette: LIGHT_PALETTES.material,
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 8,
  },

  materialDark: {
    palette: LIGHT_PALETTES.materialDark,
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 8,
  },

  ios: {
    palette: LIGHT_PALETTES.ios,
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
 * Metadata for each theme template (used in UI)
 */
export const THEME_TEMPLATE_METADATA: Record<
  string,
  { label: string; description: string }
> = {
  material: {
    label: 'Material UI',
    description: 'The default Material UI theme.',
  },
  materialDark: {
    label: 'Material UI Dark',
    description: 'Material UI with darker background.',
  },
  ios: {
    label: 'Apple iOS',
    description: 'A theme inspired by Apple iOS design system.',
  },
  material3: {
    label: 'Material Design 3',
    description: 'The latest Material Design 3 (Material You) theme.',
  },
};

/**
 * Available theme template IDs
 */
export type ThemeTemplateId = keyof typeof THEME_TEMPLATES;

/**
 * Retrieves a theme template by ID.
 * Applies the appropriate palette based on the color scheme.
 * 
 * @param templateId - Template ID (e.g., 'material', 'ios')
 * @param colorScheme - Color scheme to apply ('light' or 'dark')
 * @returns ThemeOptions object, or throws if not found
 */
export function getThemeTemplate(
  templateId: string,
  colorScheme: 'light' | 'dark' = 'light'
): ThemeOptions {
  const template = THEME_TEMPLATES[templateId];
  
  if (!template) {
    throw new Error(
      `Unknown theme template: "${templateId}". Available: ${Object.keys(THEME_TEMPLATES).join(', ')}`
    );
  }

  // Get the appropriate palette for the color scheme
  const palette = colorScheme === 'dark' ? DARK_PALETTES[templateId] : LIGHT_PALETTES[templateId];

  // Return a deep copy with the correct palette
  return JSON.parse(JSON.stringify({ ...template, palette }));
}

/**
 * Lists all available theme template IDs.
 */
export function listThemeTemplateIds(): ThemeTemplateId[] {
  return Object.keys(THEME_TEMPLATES) as ThemeTemplateId[];
}
