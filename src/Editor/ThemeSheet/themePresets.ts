import type { ThemeOptions } from '@mui/material/styles';
import type { ThemePreset } from './types';

/**
 * Registry of theme presets.
 * These are reusable theme modifications that can be toggled on/off.
 * Unlike templates, presets are applied on top of the base theme.
 */
const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'dense-spacing',
    label: 'Dense Spacing',
    value: {
      spacing: 4,
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              paddingTop: 4,
              paddingBottom: 4,
            },
          },
        },
      },
    },
  },
  {
    id: 'rounded-corners',
    label: 'Extra Rounded Corners',
    value: {
      shape: {
        borderRadius: 16,
      },
    },
  },
  {
    id: 'elevated-surfaces',
    label: 'Elevated Surfaces',
    value: {
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow:
                '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
            },
          },
        },
      },
    },
  },
  {
    id: 'high-contrast',
    label: 'High Contrast Mode',
    value: (baseTheme: ThemeOptions): ThemeOptions => {
      return {
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          primary: {
            main: baseTheme.palette?.mode === 'dark' ? '#ffffff' : '#000000',
          },
          text: {
            primary: baseTheme.palette?.mode === 'dark' ? '#ffffff' : '#000000',
            secondary: baseTheme.palette?.mode === 'dark' ? '#e0e0e0' : '#333333',
          },
        },
      };
    },
  },
  {
    id: 'large-text',
    label: 'Large Text (Accessibility)',
    value: (baseTheme: ThemeOptions): ThemeOptions => {
      const typo = baseTheme.typography;
      const currentSize =
        typo && typeof typo === 'object' && 'fontSize' in typo ? (typo.fontSize as number) : 14;
      return {
        ...baseTheme,
        typography: {
          ...baseTheme.typography,
          fontSize: currentSize * 1.25,
        },
      };
    },
  },
];

/**
 * Retrieves a preset by its ID.
 * 
 * @param id - Preset ID
 * @returns ThemePreset object
 * @throws Error if preset not found
 */
export function getThemePreset(id: string): ThemePreset {
  const preset = THEME_PRESETS.find((p) => p.id === id);
  
  if (!preset) {
    throw new Error(
      `Unknown theme preset: "${id}". Available: ${THEME_PRESETS.map((p) => p.id).join(', ')}`
    );
  }
  
  return preset;
}

/**
 * Lists all available theme presets.
 */
export function listThemePresets(): ThemePreset[] {
  return [...THEME_PRESETS];
}

