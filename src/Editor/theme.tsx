import { createTheme } from "@mui/material";

const editorTheme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        mode: "dark",
        primary: { main: "#0A84FF" },
        background: {
          // darker default for app chrome; keep papers slightly translucent
          default: "#0B0B0C",
          paper: "rgba(18,18,18,.9)",
        },
        text: {
          primary: "rgba(255,255,255,0.92)",
          secondary: "rgba(255,255,255,0.7)",
        },
        divider: "rgba(255,255,255,0.06)",
        action: {
          hover: "rgba(255,255,255,0.06)",
          selected: "rgba(255,255,255,0.04)",
          active: "rgba(255,255,255,0.08)",
        },
        tonalOffset: 0.04,
      },
    },
    light: {
      palette: {
        mode: "light",
        primary: { main: "#0A84FF" },
        background: {
          default: "#F6F7F8",
          paper: "rgba(255,255,255,0.8)",
        },
        action: {
          hover: "rgba(0,0,0,0.06)",
          selected: "rgba(0,0,0,0.04)",
          active: "rgba(0,0,0,0.08)",
        },
        tonalOffset: 0.05,
      },
    },
  },
  shape: { borderRadius: 6 },
  transitions: { duration: { standard: 200 } },
  typography: {
    body2: {
      fontSize: 14,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.7625rem",
    },
    allVariants: {
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          transition: 'box-shadow .18s ease, transform .18s ease, background-color .12s ease',
          '&:focus-visible': {
            outline: '3px solid rgba(10,132,255,0.08)',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          borderRadius: 10,
          background:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(10,132,255,0.32)',
          },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }: any) => ({
          borderRadius: 12,
          background:
            theme.palette.mode === "dark"
              ? "rgba(20,20,20,0.5)"
              : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(16,24,40,0.08)",
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(16,24,40,0.04)"
              : "1px solid rgba(255,255,255,0.04)",
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          paddingTop: theme.spacing(2),
          maxHeight: "70vh",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.2) transparent"
              : "rgba(0,0,0,0.2) transparent",
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)",
            borderRadius: 4,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          // borderRadius: 12,
          backdropFilter: "blur(8px)",
          background:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.8)"
              : "rgba(18,18,18,0.96)",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 6px 18px rgba(16,24,40,0.06)"
              : "0 6px 20px rgba(0,0,0,0.6)",
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(16,24,40,0.04)"
              : "1px solid rgba(255,255,255,0.04)",
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.text?.secondary ?? 'rgba(255,255,255,0.74)'
              : theme.palette.text?.secondary ?? 'rgba(0,0,0,0.6)',
          opacity: 0.92,
        }),
        sizeSmall: ({ theme }: any) => ({
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.text?.secondary ?? 'rgba(255,255,255,0.74)'
              : theme.palette.text?.secondary ?? 'rgba(0,0,0,0.6)',
          opacity: 0.92,
        }),
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.text?.secondary ?? 'rgba(255,255,255,0.74)'
              : theme.palette.text?.secondary ?? 'rgba(0,0,0,0.6)',
          opacity: 0.92,
          transition: 'color .12s ease, opacity .12s ease',
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: 999,
          paddingBlock: 8,
        },
        containedPrimary: {
          background: "linear-gradient(180deg, #0A84FF, #0060D6)",
          color: "#fff",
          "&:hover": {
            boxShadow: "0 6px 18px rgba(10,132,255,0.16)",
          },
        },
        outlined: {
          borderRadius: 10,
          borderColor: "rgba(0,0,0,0.06)",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        grouped: {
          border: "none",
        },
        groupedHorizontal: {
          "&:not(:last-of-type)": {
            borderRight: "none",
          },
        },
        groupedVertical: {
          "&:not(:last-of-type)": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        track: ({ theme }: any) => ({
          borderRadius: 16,
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.06)"
              : "rgba(255,255,255,0.12)",
        }),
        thumb: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        },
      },
    },
  },
});

export default editorTheme;
