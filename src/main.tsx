import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./global.css";
import HomePage from "./pages/index";
import EditorPage from "./pages/editor";
import ViewportPage from "./pages/editor.viewport";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
import EditorGlobalKeyboardShortcuts from "./Editor/Properties/KeyboardShortcuts";
import { StorageProvider } from "./Editor/Design/storage";
import { InitializationWrapper } from "./InitializationWrapper";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      defaultMode="dark"
      theme={responsiveFontSizes(
        createTheme({
          colorSchemes: {
            dark: true,
            light: {
              palette: {
                background: {
                  paper: "#f8f8f8",
                },
              },
            },
          },
          typography: {
            body2: {
              fontSize: 14,
            },
            button: {
              textTransform: "none",
              fontSize: ".75rem !important",
            },
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  boxShadow: "none",
                  borderRadius: "10px",
                  variants: [
                    {
                      props: { variant: "outlined" },
                      style: {
                        "& .MuiSvgIcon-root": {
                          fontSize: "18px",
                        },
                      },
                    },
                    {
                      props: { variant: "outlined", color: "inherit" },
                      style: {
                        borderColor: "#ccc",
                      },
                    },
                  ],
                },
              },
            },
            MuiDialog: {
              styleOverrides: {
                paper: {
                  borderRadius: "18px",
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
          },
        })
      )}
    >
      <CssBaseline />
      <StorageProvider>
        <InitializationWrapper>
          <EditorGlobalKeyboardShortcuts />
          <BrowserRouter>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/editor/viewport" element={<ViewportPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="*" element={<EditorPage />} />
            </Routes>
          </BrowserRouter>
        </InitializationWrapper>
      </StorageProvider>
    </ThemeProvider>
  </StrictMode>
);
