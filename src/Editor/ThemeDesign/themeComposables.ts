import type { ThemeComposable } from './types';

/**
 * Registry of theme composables (previously called presets).
 * These are reusable theme modifications that can be toggled on/off.
 * Unlike templates, composables are applied on top of the base theme.
 */
const THEME_COMPOSABLES: ThemeComposable[] = [
  {
    id: 'dense-spacing',
    label: 'Dense Spacing',
    description: 'Reduces spacing throughout the theme for a more compact layout',
    getOptions: () => ({
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
    }),
  },
  {
    id: 'rounded-corners',
    label: 'Extra Rounded Corners',
    description: 'Applies more pronounced border radius to all components',
    getOptions: () => ({
      shape: {
        borderRadius: 16,
      },
    }),
  },
  {
    id: 'elevated-surfaces',
    label: 'Elevated Surfaces',
    description: 'Adds prominent shadows to paper components for depth',
    getOptions: () => ({
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
    }),
  },
  {
    id: 'high-contrast',
    label: 'High Contrast Mode',
    description: 'Enhances contrast for better accessibility',
    getOptions: (colorScheme: 'light' | 'dark') => ({
      palette: {
        primary: {
          main: colorScheme === 'dark' ? '#ffffff' : '#000000',
        },
        text: {
          primary: colorScheme === 'dark' ? '#ffffff' : '#000000',
          secondary: colorScheme === 'dark' ? '#e0e0e0' : '#333333',
        },
      },
    }),
  },
  {
    id: 'large-text',
    label: 'Large Text (Accessibility)',
    description: 'Increases base font size by 25% for better readability',
    getOptions: () => ({
      typography: {
        fontSize: 17.5, // 14 * 1.25
      },
    }),
  },
  
  // === Density Composables ===
  {
    id: 'dense-buttons',
    label: 'Dense Buttons',
    description: 'Applies size="small" as default for all buttons',
    getOptions: () => ({
      components: {
        MuiButton: {
          defaultProps: {
            size: 'small',
          },
        },
      },
    }),
  },
  {
    id: 'dense-inputs',
    label: 'Dense Inputs',
    description: 'Applies margin="dense" as default for all input components',
    getOptions: () => ({
      components: {
        MuiFilledInput: {
          defaultProps: {
            margin: 'dense',
          },
        },
        MuiFormControl: {
          defaultProps: {
            margin: 'dense',
          },
        },
        MuiFormHelperText: {
          defaultProps: {
            margin: 'dense',
          },
        },
        MuiInputBase: {
          defaultProps: {
            margin: 'dense',
          },
        },
        MuiInputLabel: {
          defaultProps: {
            margin: 'dense',
          },
        },
        MuiOutlinedInput: {
          defaultProps: {
            margin: 'dense',
          },
        },
        MuiTextField: {
          defaultProps: {
            margin: 'dense',
          },
        },
      },
    }),
  },
  {
    id: 'dense-icon-buttons',
    label: 'Dense Icon Buttons',
    description: 'Applies size="small" as default for all icon buttons',
    getOptions: () => ({
      components: {
        MuiIconButton: {
          defaultProps: {
            size: 'small',
          },
        },
      },
    }),
  },
  {
    id: 'dense-tables',
    label: 'Dense Tables',
    description: 'Applies size="small" as default for all tables',
    getOptions: () => ({
      components: {
        MuiTable: {
          defaultProps: {
            size: 'small',
          },
        },
      },
    }),
  },
  {
    id: 'dense-lists',
    label: 'Dense Lists',
    description: 'Applies dense prop as default for all list items',
    getOptions: () => ({
      components: {
        MuiListItem: {
          defaultProps: {
            dense: true,
          },
        },
      },
    }),
  },
  {
    id: 'dense-toolbars',
    label: 'Dense Toolbars',
    description: 'Applies variant="dense" as default for all toolbars',
    getOptions: () => ({
      components: {
        MuiToolbar: {
          defaultProps: {
            variant: 'dense',
          },
        },
      },
    }),
  },
];

/**
 * Retrieves a composable by its ID.
 * 
 * @param id - Composable ID
 * @returns ThemeComposable object
 * @throws Error if composable not found
 */
export function getThemeComposable(id: string): ThemeComposable {
  const composable = THEME_COMPOSABLES.find((c) => c.id === id);
  
  if (!composable) {
    throw new Error(
      `Unknown theme composable: "${id}". Available: ${THEME_COMPOSABLES.map((c) => c.id).join(', ')}`
    );
  }
  
  return composable;
}

/**
 * Lists all available theme composables.
 */
export function listThemeComposables(): ThemeComposable[] {
  return [...THEME_COMPOSABLES];
}

