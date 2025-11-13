import previewsRegistry from "../../Previews/registry";
import { useThemeDesignTheme, useThemeDesignStore } from "../../ThemeDesign";
// import FullscreenPreviewButton from "./Controls/FullscreenPreviewButton";
import { useRef, useState, useEffect } from "react";
import { Box, CssBaseline, Paper, ThemeProvider } from "@mui/material";
import {
  // BreakpointSimulationToggles,
  useBreakpointSimulation,
  spoofThemeBreakpoints,
} from "./BreakpointSimulation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function BoardSurface() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const previewId = useThemeDesignStore((state) => state.activePreviewId);
  const PreviewComponent = previewsRegistry[previewId]?.component;

  const [availableWidth, setAvailableWidth] = useState<number>(0);
  const { simulatedBreakpoint, getMaxWidth, getMinWidth, getScale } =
    useBreakpointSimulation();

  const theme = useThemeDesignTheme();
  const breakpointSpoofedTheme = spoofThemeBreakpoints(theme, simulatedBreakpoint);

  // Track available width for scaling
  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        setAvailableWidth(wrapperRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const scale = getScale(availableWidth);

  if (!PreviewComponent) {
    return (
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#d32f2f",
          fontSize: "16px",
        }}
      >
        Component "{previewId}" not found in registry
      </Box>
    );
  }

  return (
    <ThemeProvider theme={breakpointSpoofedTheme}>
      <CssBaseline />
      <Box
        ref={wrapperRef}
        sx={{
          width: "100%",
          height: "calc(100dvh - var(--header-height) - var(--toolbar-height))",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "auto",
          p: 1,
        }}
      >
        <PanelGroup direction="horizontal">
          <Panel defaultSize={100} minSize={30}>
            <Paper
              ref={containerRef}
              role="presentation"
              sx={(theme) => ({
                position: "relative",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                boxShadow: 0,
                border: 2,
                borderStyle: "dotted",
                borderColor: "primary.dark",
                maxWidth: getMaxWidth(),
                minWidth: getMinWidth(),
                height: "100%",
                marginRight: 0.2,
                width: simulatedBreakpoint ? getMaxWidth() : "100%",
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                transition:
                  "max-width 0.3s ease-in-out, min-width 0.3s ease-in-out, width 0.3s ease-in-out, transform 0.3s ease-in-out",

                // Scrollbar styling: WebKit and Firefox
                // Thin thumb and track matching primary palette
                "::-webkit-scrollbar": {
                  width: 5,
                  height: 5,
                },
                "::-webkit-scrollbar-track": {
                  background:
                    theme.palette.mode === "dark"
                      ? `${theme.palette.primary.main}15`
                      : `${theme.palette.primary.main}10`,
                  borderRadius: theme.shape.borderRadius,
                },
                "::-webkit-scrollbar-thumb": {
                  background: theme.palette.primary.main,
                  // borderRadius: theme.shape.borderRadius,
                  border: `2px solid ${
                    theme.palette.mode === "dark"
                      ? `${theme.palette.primary.main}15`
                      : `${theme.palette.primary.main}10`
                  }`,
                },
              })}
            >
              {/* <Box sx={{ position: "sticky", top: 0, zIndex: 1, py: 0.4 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <BreakpointSimulationToggles mouseOverPreview={mouseOverPreview} />
              <FullscreenPreviewButton
                containerRef={containerRef}
                mouseOverPreview={mouseOverPreview}
              />
            </Box>
          </Box> */}

              <PreviewComponent />
            </Paper>
          </Panel>
          <PanelResizeHandle />
          <Panel />
        </PanelGroup>
      </Box>
    </ThemeProvider>
  );
}
