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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      theme={responsiveFontSizes(
        createTheme({
          palette: {
            text: {
              primary: "#444",
            },
          },
          colorSchemes: {
            dark: true,
            light: true,
          },
          typography: {
            htmlFontSize: 16,

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
                  borderRadius: 2,
                  variants: [
                    {
                      props: { variant: "outlined" },
                      style: {
                        // FIXME: OVERRIDE NOT APPLIED
                        "& .MuiSvgIcon-root": {
                          fontSize: 18,
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
          },
        })
      )}
    >
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/editor/viewport" element={<ViewportPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
