import { forwardRef, useMemo, useRef, useState } from "react";
import { Box, CssBaseline, IconButton, Tooltip } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { ThemeProvider } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { samplesRegistry } from "../../Samples/registry";

export type BoardSurfaceProps = {
  /** Component ID to render (must exist in registry) */
  component: string;
  /** Optional theme to apply. If not provided, uses MUI default theme */
  theme?: Theme;
  /** Custom registry. If not provided, uses samplesRegistry */
  registry?: Record<
    string,
    {
      id: string;
      label: string;
      component: React.ComponentType<Record<string, unknown>>;
    }
  >;
  /** Props to pass to the component */
  componentProps?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * BoardSurface - Simple, direct component rendering surface
 *
 * Unlike ZoomPanSurface (which has zoom, pan, controls) and ViewportSimulation
 * (which uses iframe), BoardSurface renders the component directly with minimal overhead.
 *
 * Perfect for:
 * - Fullscreen preview mode
 * - Quick component inspection
 * - Responsive layout testing at actual viewport size
 *
 * Usage:
 * ```tsx
 * const boardRef = useRef<HTMLDivElement>(null);
 * <BoardSurface
 *   ref={boardRef}
 *   component="DashboardExample"
 *   theme={currentTheme}
 * />
 *
 * // Fullscreen:
 * boardRef.current?.requestFullscreen();
 * ```
 */
const BoardSurface = forwardRef<HTMLDivElement, BoardSurfaceProps>(
  (
    {
      component,
      theme,
      registry = samplesRegistry,
      componentProps = {},
      className,
      style,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Resolve component from registry
    const resolvedComponent = useMemo(() => {
      const metadata = registry[component];
      if (!metadata) {
        console.warn(
          `[BoardSurface] Component "${component}" not found in registry`
        );
        return null;
      }
      return metadata.component;
    }, [component, registry]);

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

    // Error state
    if (!resolvedComponent) {
      return (
        <Box
          ref={ref || containerRef}
          className={className}
          style={style}
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
          Component "{component}" not found in registry
        </Box>
      );
    }

    const Component = resolvedComponent;

    if (!theme) {
      return (
        <Box
          ref={ref || containerRef}
          className={className}
          style={style}
          role="presentation"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Fullscreen button */}
          <Tooltip
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
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

          <CssBaseline />
          <Component {...componentProps} />
        </Box>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <Box
          ref={ref || containerRef}
          className={className}
          style={style}
          role="presentation"
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Fullscreen button */}
          <Tooltip
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
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

          <CssBaseline />
          <Component {...componentProps} />
        </Box>
      </ThemeProvider>
    );
  }
);

BoardSurface.displayName = "BoardSurface";

export default BoardSurface;
