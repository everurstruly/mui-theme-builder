import type { ThemeOptions } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * Modern Theme Template
 * 
 * A clean, modern theme with vibrant colors and rounded corners.
 * Emphasizes whitespace and contemporary design patterns.
 */

const purple = {
  50: "hsl(270, 100%, 98%)",
  100: "hsl(270, 100%, 95%)",
  200: "hsl(270, 95%, 88%)",
  300: "hsl(270, 90%, 78%)",
  400: "hsl(270, 85%, 65%)",
  500: "hsl(270, 80%, 55%)",
  600: "hsl(270, 75%, 45%)",
  700: "hsl(270, 70%, 35%)",
  800: "hsl(270, 80%, 25%)",
  900: "hsl(270, 90%, 15%)",
};

const cyan = {
  50: "hsl(185, 100%, 97%)",
  100: "hsl(185, 95%, 90%)",
  200: "hsl(185, 90%, 80%)",
  300: "hsl(185, 85%, 65%)",
  400: "hsl(185, 80%, 50%)",
  500: "hsl(185, 85%, 40%)",
  600: "hsl(185, 90%, 30%)",
  700: "hsl(185, 95%, 22%)",
  800: "hsl(185, 98%, 16%)",
  900: "hsl(185, 100%, 10%)",
};

const slate = {
  50: "hsl(210, 40%, 98%)",
  100: "hsl(210, 35%, 94%)",
  200: "hsl(210, 30%, 88%)",
  300: "hsl(210, 25%, 75%)",
  400: "hsl(210, 20%, 60%)",
  500: "hsl(210, 18%, 45%)",
  600: "hsl(210, 20%, 32%)",
  700: "hsl(210, 25%, 22%)",
  800: "hsl(210, 30%, 12%)",
  900: "hsl(210, 35%, 8%)",
};

const modernTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: purple[500],
          light: purple[300],
          dark: purple[700],
          contrastText: "#ffffff",
        },
        secondary: {
          main: cyan[500],
          light: cyan[300],
          dark: cyan[700],
          contrastText: "#ffffff",
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
          main: cyan[500],
          light: cyan[300],
          dark: cyan[700],
        },
        success: {
          main: "#10b981",
          light: "#34d399",
          dark: "#059669",
        },
        grey: slate,
        divider: alpha(slate[300], 0.3),
        background: {
          default: "#fafafa",
          paper: "#ffffff",
        },
        text: {
          primary: slate[900],
          secondary: slate[600],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: purple[400],
          light: purple[200],
          dark: purple[600],
          contrastText: "#ffffff",
        },
        secondary: {
          main: cyan[400],
          light: cyan[200],
          dark: cyan[600],
          contrastText: "#ffffff",
        },
        error: {
          main: "#f87171",
          light: "#fca5a5",
          dark: "#ef4444",
        },
        warning: {
          main: "#fbbf24",
          light: "#fcd34d",
          dark: "#f59e0b",
        },
        info: {
          main: cyan[400],
          light: cyan[200],
          dark: cyan[600],
        },
        success: {
          main: "#34d399",
          light: "#6ee7b7",
          dark: "#10b981",
        },
        grey: slate,
        divider: alpha(slate[700], 0.3),
        background: {
          default: slate[900],
          paper: slate[800],
        },
        text: {
          primary: slate[50],
          secondary: slate[300],
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "sans-serif"',
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
};

export default modernTheme;
