import { createTheme } from "@mui/material";

const editorTheme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        mode: "dark",
        primary: { main: "#0A84FF" },
        background: {
          default: "#0B0BC",
          paper: "rgba(18,18,18,0.72)",
        },
        text: {
          primary: "rgba(255,255,255,0.92)",
          secondary: "rgba(255,255,255,0.7)",
        },
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
          paper: "rgba(255,255,255,0.96)",
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
      fontSize: 13,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.8125rem",
    },
    allVariants: {
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.5)",
        }),
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          transition:
            "box-shadow .18s ease, transform .18s ease, background-color .12s ease",
          "&:focus-visible": {
            outline: "3px solid rgba(10,132,255,0.08)",
            outlineOffset: 2,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          borderRadius: 10,
          // stronger light-mode tint so inputs are readable inside light dialogs
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "rgba(16,24,40,0.04)",
          color: theme.palette.text.primary,
          "& .MuiInputBase-input": {
            color: theme.palette.text.primary,
            "&::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 1,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              theme.palette.mode === "dark" ? "transparent" : "rgba(16,24,40,0.06)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(16,24,40,0.08)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(10,132,255,0.32)",
            borderWidth: 1,
          },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }: any) => ({
          // stronger visual separation for dialogs
          borderRadius: 18,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(18,18,18,0.96)"
              : "rgba(255,255,255,0.94)",
          backdropFilter: "blur(12px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 20px 60px rgba(2,6,23,0.68)"
              : "0 12px 40px rgba(16,24,40,0.12)",
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(16,24,40,0.06)"
              : "1px solid rgba(255,255,255,0.06)",
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
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
    MuiDialogTitle: {
      styleOverrides: {
        root: () => ({
          display: "flex",
          alignItems: "center",
          py: 2,
          gap: 2,
          pb: 3,
        }),
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          padding: theme.spacing(3),
          columnGap: theme.spacing(1),
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
              ? "0 6px 12px rgba(16,24,40,0.06)"
              : "0 6px 18px rgba(0,0,0,0.2)",
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(16,24,40,0.04)"
              : "1px solid rgba(255,255,255,0.04)",
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: () => ({
          // don't set a global color here; we'll style the SvgIcon specifically
          opacity: 0.92,
        }),
        sizeSmall: () => ({
          opacity: 0.92,
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          color: theme.palette.text.primary,
          opacity: 0.96,
          textTransform: 'none',
          '&.Mui-selected': {
            color: theme.palette.primary.contrastText,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(10,132,255,0.16)'
                : theme.palette.primary.main,
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 6px 18px rgba(10,132,255,0.12)'
                : '0 6px 18px rgba(10,132,255,0.16)',
          },
        }),
        sizeSmall: ({ theme }: any) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          // default: inherit color so standalone icons keep their own color
          color: 'inherit',
          opacity: 0.92,
          transition: 'color .12s ease, opacity .12s ease',
          // Apply readable color only when ALL of the following are true:
          // 1) The SvgIcon is inside an IconButton that does NOT have any
          //    explicit built-in color class (primary/secondary/error/...)
          // 2) The SvgIcon itself does NOT have any built-in color class
          //    (so icons rendered with `color="error"` or similar keep their color)
          // 3) The SvgIcon does not have the opt-out class `.no-default-icon-color`
          // This makes the rule act strictly as a safe default and avoid
          // stomping on custom variants or explicit semantic colors.
          '.MuiIconButton-root:not(.MuiIconButton-colorPrimary):not(.MuiIconButton-colorSecondary):not(.MuiIconButton-colorError):not(.MuiIconButton-colorWarning):not(.MuiIconButton-colorInfo):not(.MuiIconButton-colorSuccess) &.MuiSvgIcon-root:not(.MuiSvgIcon-colorPrimary):not(.MuiSvgIcon-colorSecondary):not(.MuiSvgIcon-colorError):not(.MuiSvgIcon-colorWarning):not(.MuiSvgIcon-colorInfo):not(.MuiSvgIcon-colorSuccess):not(.no-default-icon-color)': {
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.text?.secondary ?? 'rgba(255,255,255,0.74)'
                : theme.palette.text?.secondary ?? 'rgba(0,0,0,0.6)',
            opacity: 0.92,
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: 999,
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
