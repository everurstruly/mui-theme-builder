import previewsRegistry from "../../Previews/registry";
import { useRef, useState, useEffect, type RefObject } from "react";
import { Box, CssBaseline, Paper, Stack, ThemeProvider } from "@mui/material";
import {
  useBreakpointSimulation,
  spoofThemeBreakpoints,
} from "./BreakpointSimulation";
import useCurrent from "../../Design/Current/useCurrent";
import useCreatedTheme from "../../Design/Current/useCreatedTheme";

export type PlainSurfaceControls = {
  containerRef: RefObject<HTMLDivElement | null>;

  leftControls?: React.ReactNode;
  rightControls?: React.ReactNode;
  topControls?: React.ReactNode;
};

export default function PlainSurface({
  containerRef,

  leftControls,
  rightControls,
  topControls,
}: PlainSurfaceControls) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const previewId = useCurrent((s) => s.activePreviewId);
  const PreviewComponent = previewsRegistry[previewId]?.component;

  const [availableWidth, setAvailableWidth] = useState<number>(0);
  const { simulatedBreakpoint, getMaxWidth, getScale } = useBreakpointSimulation();

  const theme = useCreatedTheme();
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
      <Stack
        ref={wrapperRef}
        sx={{
          height: "calc(100dvh - var(--header-height) - var(--toolbar-height))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
          p: 2,
        }}
      >
        <Paper
          ref={containerRef}
          role="presentation"
          sx={[
            (theme) => ({
              position: "relative",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              boxShadow: 0,
              border: 2,
              borderStyle: "dotted",
              borderColor: theme.palette.primary.dark,
              maxWidth: getMaxWidth(),
              height: "100%",
              width: simulatedBreakpoint ? getMaxWidth() : "auto",
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              scrollbarWidth: "thin",
              transition:
                "max-width 0.3s ease-in-out, min-width 0.3s ease-in-out, width 0.3s ease-in-out, transform 0.3s ease-in-out",
            }),
          ]}
        >
          <PreviewComponent />

          {topControls && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1400,
                pointerEvents: "auto",
              }}
            >
              {topControls}
            </Box>
          )}

          {leftControls && (
            <Box
              sx={{
                position: "absolute",
                left: 8,
                bottom: 8,
                zIndex: 1400,
                pointerEvents: "auto",
              }}
            >
              {leftControls}
            </Box>
          )}

          {rightControls && (
            <Box
              sx={{
                position: "absolute",
                right: 8,
                bottom: 8,
                zIndex: 1400,
                pointerEvents: "auto",
              }}
            >
              {rightControls}
            </Box>
          )}
        </Paper>
      </Stack>
    </ThemeProvider>
  );
}
