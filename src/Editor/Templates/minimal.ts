import type { ThemeOptions } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * Minimal Theme Template
 * 
 * A minimalist theme with subtle colors and tight spacing.
 * Focuses on content with reduced visual noise.
 */

const neutral = {
  50: "hsl(0, 0%, 98%)",
  100: "hsl(0, 0%, 96%)",
  200: "hsl(0, 0%, 90%)",
  300: "hsl(0, 0%, 80%)",
  400: "hsl(0, 0%, 60%)",
  500: "hsl(0, 0%, 45%)",
  600: "hsl(0, 0%, 35%)",
  700: "hsl(0, 0%, 25%)",
  800: "hsl(0, 0%, 15%)",
  900: "hsl(0, 0%, 10%)",
};

const accent = {
  50: "hsl(200, 20%, 98%)",
  100: "hsl(200, 20%, 94%)",
  200: "hsl(200, 20%, 86%)",
  300: "hsl(200, 20%, 72%)",
  400: "hsl(200, 20%, 55%)",
  500: "hsl(200, 25%, 42%)",
  600: "hsl(200, 30%, 32%)",
  700: "hsl(200, 35%, 24%)",
  800: "hsl(200, 40%, 16%)",
  900: "hsl(200, 45%, 10%)",
};

const minimalTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: neutral[900],
          light: neutral[700],
          dark: neutral[900],
          contrastText: "#ffffff",
        },
        secondary: {
          main: accent[600],
          light: accent[400],
          dark: accent[800],
          contrastText: "#ffffff",
        },
        error: {
          main: "#dc2626",
          light: "#ef4444",
          dark: "#991b1b",
        },
        warning: {
          main: "#d97706",
          light: "#f59e0b",
          dark: "#92400e",
        },
        info: {
          main: accent[600],
          light: accent[400],
          dark: accent[800],
        },
        success: {
          main: "#059669",
          light: "#10b981",
          dark: "#065f46",
        },
        grey: neutral,
        divider: alpha(neutral[300], 0.2),
        background: {
          default: "#ffffff",
          paper: neutral[50],
        },
        text: {
          primary: neutral[900],
          secondary: neutral[600],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: neutral[50],
          light: neutral[100],
          dark: neutral[200],
          contrastText: neutral[900],
        },
        secondary: {
          main: accent[400],
          light: accent[300],
          dark: accent[600],
          contrastText: neutral[900],
        },
        error: {
          main: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
        },
        warning: {
          main: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        info: {
          main: accent[400],
          light: accent[300],
          dark: accent[600],
        },
        success: {
          main: "#10b981",
          light: "#34d399",
          dark: "#059669",
        },
        grey: neutral,
        divider: alpha(neutral[700], 0.2),
        background: {
          default: neutral[900],
          paper: neutral[800],
        },
        text: {
          primary: neutral[50],
          secondary: neutral[400],
        },
      },
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", "system-ui", "-apple-system", "sans-serif"',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.015em",
    },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      letterSpacing: "0",
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      letterSpacing: "0",
    },
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 6,
};

export default minimalTheme;
