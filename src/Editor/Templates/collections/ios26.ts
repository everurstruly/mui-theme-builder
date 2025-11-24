import type { ThemeOptions } from '@mui/material/styles';

// iOS 26 inspired ThemeOptions for the editor templates collection
// This file exports a ThemeOptions object tuned for a soft, modern iOS-like look:
// - muted background, elevated card surfaces
// - rounded shapes, subtle shadows
// - system-like typography and accent color

const ios26: ThemeOptions & Record<string, any> = {
  palette: {
    mode: 'light',
    primary: {
      main: '#0a84ff', // iOS blue accent
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5e5ce6',
    },
    background: {
      default: '#f4f6fb', // soft system background
      paper: '#ffffff',
    },
    text: {
      primary: '#111111',
      secondary: '#6b7280',
    },
    divider: '#e6e9ef',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Noto Sans',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 16px',
          boxShadow: 'none',
        },
        containedPrimary: {
          boxShadow:
            '0 1px 2px rgba(10,132,255,0.12), 0 1px 0 rgba(0,0,0,0.02) inset',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 14,
        },
        elevation1: {
          boxShadow:
            '0 6px 12px rgba(17,24,39,0.06), 0 1px 2px rgba(17,24,39,0.02)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
          color: '#111827',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          backgroundColor: 'rgba(17,24,39,0.9)',
        },
      },
    },
  },
  // custom metadata useful for the editor templates
  name: 'iOS 26',
  description: 'Soft, rounded, system-style theme inspired by modern iOS design',
  preview: {
    colors: {
      primary: '#0a84ff',
      background: '#f4f6fb',
      surface: '#ffffff',
      text: '#111111',
    },
  },
};

export default ios26;
