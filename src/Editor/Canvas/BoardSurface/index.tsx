import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import previewsRegistry from "../../Previews/registry";
import { useRef, useState } from "react";
import { Box, CssBaseline, IconButton, Paper, Tooltip } from "@mui/material";
import { createTheme, ThemeProvider, type ThemeOptions } from "@mui/material/styles";

export type BoardSurfaceProps = {
  theme?: ThemeOptions;
  previewId: string;
};

export default function BoardSurface({ theme, previewId }: BoardSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const PreviewComponent = previewsRegistry[previewId]?.component;

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("[BoardSurface] Error toggling fullscreen:", error);
    }
  };

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
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <Paper
        ref={containerRef}
        role="presentation"
        sx={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: isFullscreen ? 24 : 2,
          transform: isFullscreen ? undefined : "scale(0.8) translateY(-4%)",
        }}
      >
        {/* Fullscreen button */}
        <Tooltip title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
          <IconButton
            onClick={handleFullscreen}
            size="small"
            sx={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            {isFullscreen ? (
              <FullscreenExitIcon fontSize="small" />
            ) : (
              <FullscreenIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <PreviewComponent />
      </Paper>
    </ThemeProvider>
  );
}
