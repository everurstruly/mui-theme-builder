import type { ThemeOptions } from '@mui/material/styles';

/**
 * A composable is a reusable theme modification that can be toggled on/off.
 * Examples: "Dark Mode", "Dense Spacing", "Rounded Corners"
 */
export interface Composable {
  id: string;
  label: string;
  /** Either static ThemeOptions or a function that transforms the base theme */
  value: ThemeOptions | ((base: ThemeOptions) => ThemeOptions);
}

/**
 * Registry of appearance composables.
 * These are reusable theme modifications that can be toggled on/off.
 */
const COMPOSABLES: Composable[] = [
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
    value: (base: ThemeOptions): ThemeOptions => {
      return {
        ...base,
        palette: {
          ...base.palette,
          primary: {
            main: base.palette?.mode === 'dark' ? '#ffffff' : '#000000',
          },
          text: {
            primary: base.palette?.mode === 'dark' ? '#ffffff' : '#000000',
            secondary: base.palette?.mode === 'dark' ? '#e0e0e0' : '#333333',
          },
        },
      };
    },
  },
  {
    id: 'large-text',
    label: 'Large Text (Accessibility)',
    value: (base: ThemeOptions): ThemeOptions => {
      const typo = base.typography;
      const currentSize =
        typo && typeof typo === 'object' && 'fontSize' in typo ? (typo.fontSize as number) : 14;
      return {
        ...base,
        typography: {
          ...base.typography,
          fontSize: currentSize * 1.25,
        },
      };
    },
  },
];

/**
 * Retrieves a composable by its ID.
 * @param id - Composable ID
 * @returns Composable object, or throws if not found
 */
export const getComposableById = (id: string): Composable => {
  const composable = COMPOSABLES.find((c) => c.id === id);
  if (!composable) {
    throw new Error(
      `Unknown composable ID: "${id}". Available: ${COMPOSABLES.map((c) => c.id).join(', ')}`
    );
  }
  return composable;
};

/**
 * Lists all available composables.
 */
export const listComposables = (): Composable[] => {
  return [...COMPOSABLES];
};

