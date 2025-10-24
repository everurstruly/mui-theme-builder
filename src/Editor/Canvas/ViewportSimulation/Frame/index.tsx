import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { samplesRegistry } from "../../../Samples/registry";

type ViewportSimulationFrameProps = {
  width: number;
  height: number;
  /**
   * Component to render - must be registered in the provided registry.
   * Pass the component name as a string (e.g., "DashboardExample")
   */
  component: string;
  /** Props to pass to the component */
  componentProps?: Record<string, unknown>;
  /** Custom registry to use. If not provided, uses default samplesRegistry */
  registry?: Record<
    string,
    {
      id: string;
      label: string;
      component: React.ComponentType<Record<string, unknown>>;
    }
  >;
  className?: string;
  style?: React.CSSProperties;
  bordered?: boolean;
};

/**
 * ViewportSimulationFrame renders a component in an iframe with a controlled viewport size.
 *
 * Components inside see the iframe's window dimensions (not the parent window),
 * so media queries and useMediaQuery work based on the simulated viewport.
 *
 * **Multi-Registry Support:**
 * By default, uses the samplesRegistry. But you can pass a custom registry
 * to render components from different registries!
 *
 * Usage:
 * ```tsx
 * // Default registry
 * <ViewportSimulationFrame width={375} height={667} component="DashboardExample" />
 *
 * // Custom registry
 * <ViewportSimulationFrame
 *   width={375}
 *   height={667}
 *   component="MyCustomComponent"
 *   registry={myCustomRegistry}
 * />
 * ```
 *
 * **How it works:**
 * 1. Canvas layer looks up component in the provided registry
 * 2. Canvas validates component exists
 * 3. Canvas sends componentId and registry metadata to iframe via postMessage
 * 4. Iframe receives registry info and looks up component in its own copy
 * 5. Each React instance (parent & iframe) has independent component trees
 * 6. Hooks work correctly because each instance manages its own ThemeProvider
 */
export default function ViewportSimulationFrame({
  width,
  height,
  component,
  componentProps = {},
  registry = samplesRegistry,
  className,
  style,
  bordered = false,
}: ViewportSimulationFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const mountIdRef = useRef(0);

  // Resolve component from provided registry on Canvas side
  const resolvedComponent = useMemo(() => {
    const metadata = registry[component];
    if (!metadata) {
      console.warn(
        `[ViewportSimulationFrame] Component "${component}" not found in registry`
      );
      return null;
    }
    return metadata;
  }, [component, registry]);

  const sendUpdate = useCallback(() => {
    if (!ready || !iframeRef.current || !resolvedComponent) return;

    const iframe = iframeRef.current;
    const win = iframe.contentWindow;
    if (!win) return;

    mountIdRef.current++;

    // Serialize registry: strip out component functions and keep only metadata
    const registryData = Object.entries(registry).reduce(
      (acc, [id, metadata]) => {
        acc[id] = {
          id: metadata.id,
          label: metadata.label,
          description:
            ((metadata as Record<string, unknown>).description as string) || "",
        };
        return acc;
      },
      {} as Record<string, { id: string; label: string; description: string }>
    );

    const message = {
      type: "MOUNT_COMPONENT",
      mountId: mountIdRef.current,
      theme: serializeTheme(theme),
      componentId: component, // Send ID for iframe to look up
      componentLabel: resolvedComponent.label, // Send label for debugging
      registryData, // Send registry metadata
      registryComponentIds: Object.keys(registry), // Send list of available components
      props: {
        ...componentProps,
        // Inject viewport dimensions as props
        __viewportWidth: width,
        __viewportHeight: height,
      },
    };

    console.log("[ViewportSimulationFrame] Sending MOUNT_COMPONENT:", message);

    // Send theme, component ID, registry info, and viewport dimensions to iframe
    win.postMessage(message, "*");
  }, [
    ready,
    theme,
    component,
    resolvedComponent,
    componentProps,
    width,
    height,
    registry,
  ]);

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
    if (ready && resolvedComponent) {
      sendUpdate();
    }
  }, [ready, resolvedComponent, sendUpdate]);

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
        ...(bordered && { border: "2px solid #444" }),
      }}
    >
      {!resolvedComponent && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            color: "#d32f2f",
          }}
        >
          Component "{component}" not found
        </Box>
      )}
      {resolvedComponent && (
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
      )}
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
