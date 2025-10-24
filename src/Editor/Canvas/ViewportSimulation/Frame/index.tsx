import { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

type ViewportSimulationFrameProps = {
  width: number;
  height: number;
  /**
   * Component to render - must be registered in iframe registry.
   * Pass the component name as a string (e.g., "DashboardExample")
   */
  component: string;
  /** Props to pass to the component */
  componentProps?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * ViewportSimulationFrame renders a component in an iframe with a controlled viewport size.
 * Components inside see the iframe's window dimensions (not the parent window),
 * so media queries and useMediaQuery work based on the simulated viewport.
 *
 * Usage:
 * <ViewportSimulationFrame width={375} height={667} component="DashboardExample" />
 */
export default function ViewportSimulationFrame({
  width,
  height,
  component,
  componentProps = {},
  className,
  style,
}: ViewportSimulationFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const mountIdRef = useRef(0);

  const sendUpdate = useCallback(() => {
    if (!ready || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const win = iframe.contentWindow;
    if (!win) return;

    mountIdRef.current++;

    const message = {
      type: "MOUNT_COMPONENT",
      mountId: mountIdRef.current,
      theme: serializeTheme(theme),
      component,
      props: {
        ...componentProps,
        // Inject viewport dimensions as props
        __viewportWidth: width,
        __viewportHeight: height,
      },
    };

    console.log("[ViewportSimulationFrame] Sending MOUNT_COMPONENT:", message);

    // Send theme, component info, and viewport dimensions to iframe
    win.postMessage(message, "*");
  }, [ready, theme, component, componentProps, width, height]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Set iframe src to the standalone HTML page
    iframe.src = "/iframe-viewport.html";

    // Wait for iframe to signal it's ready
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "IFRAME_READY") {
        console.log("[ViewportSimulationFrame] Received IFRAME_READY");
        setReady(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []); // Only run once on mount

  // Send initial update when ready
  useEffect(() => {
    if (ready) {
      sendUpdate();
    }
  }, [ready, sendUpdate]);

  return (
    <Box
      className={className}
      style={style}
      sx={{
        width,
        height,
        overflow: "hidden",
        border: "none",
        display: "block",
      }}
    >
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Viewport Simulation"
      />
    </Box>
  );
}

function serializeTheme(theme: Theme): Record<string, unknown> {
  // Serialize theme to a plain object (remove functions, circular refs)
  // Be careful with nested objects that may have circular references
  try {
    return {
      palette: JSON.parse(JSON.stringify(theme.palette)),
      typography: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontWeightLight: theme.typography.fontWeightLight,
        fontWeightRegular: theme.typography.fontWeightRegular,
        fontWeightMedium: theme.typography.fontWeightMedium,
        fontWeightBold: theme.typography.fontWeightBold,
      },
      spacing: theme.spacing(1), // Just send the base unit
      breakpoints: {
        values: theme.breakpoints.values,
      },
      shape: theme.shape,
      shadows: theme.shadows,
      direction: theme.direction,
    };
  } catch (error) {
    console.error("Error serializing theme:", error);
    return {};
  }
}
