import type { ThemeOptions } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * Material Design Theme Template
 * 
 * The default Material Design theme with light and dark color schemes.
 * Uses the standard Material Design color palette and spacing.
 */

const brand = {
  50: "hsl(210, 100%, 95%)",
  100: "hsl(210, 100%, 92%)",
  200: "hsl(210, 100%, 80%)",
  300: "hsl(210, 100%, 65%)",
  400: "hsl(210, 98%, 48%)",
  500: "hsl(210, 98%, 42%)",
  600: "hsl(210, 98%, 55%)",
  700: "hsl(210, 100%, 35%)",
  800: "hsl(210, 100%, 16%)",
  900: "hsl(210, 100%, 21%)",
};

const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 20%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 6%)",
  900: "hsl(220, 35%, 3%)",
};

const materialTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: brand[400],
          light: brand[200],
          dark: brand[700],
          contrastText: brand[50],
        },
        secondary: {
          main: brand[300],
          light: brand[100],
          dark: brand[600],
        },
        error: {
          main: "#d32f2f",
          light: "#ef5350",
          dark: "#c62828",
        },
        warning: {
          main: "#ed6c02",
          light: "#ff9800",
          dark: "#e65100",
        },
        info: {
          main: "#0288d1",
          light: "#03a9f4",
          dark: "#01579b",
        },
        success: {
          main: "#2e7d32",
          light: "#4caf50",
          dark: "#1b5e20",
        },
        grey: gray,
        divider: alpha(gray[300], 0.4),
        background: {
          default: "#ffffff",
          paper: gray[50],
        },
        text: {
          primary: gray[800],
          secondary: gray[600],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: brand[400],
          light: brand[300],
          dark: brand[700],
          contrastText: brand[50],
        },
        secondary: {
          main: brand[500],
          light: brand[300],
          dark: brand[800],
        },
        error: {
          main: "#f44336",
          light: "#e57373",
          dark: "#d32f2f",
        },
        warning: {
          main: "#ffa726",
          light: "#ffb74d",
          dark: "#f57c00",
        },
        info: {
          main: "#29b6f6",
          light: "#4fc3f7",
          dark: "#0288d1",
        },
        success: {
          main: "#66bb6a",
          light: "#81c784",
          dark: "#388e3c",
        },
        grey: gray,
        divider: alpha(gray[700], 0.4),
        background: {
          default: gray[900],
          paper: gray[800],
        },
        text: {
          primary: gray[100],
          secondary: gray[400],
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8,
};

export default materialTheme;
