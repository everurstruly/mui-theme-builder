import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import React from "react";
import { Box, CircularProgress, Typography, Alert, Paper } from "@mui/material";
import type { ThemeOptions } from "@mui/material/styles";
import { samplesRegistry } from "../../../Previews/registry";
import {
  MESSAGE_IFRAME_READY,
  MESSAGE_MOUNT_COMPONENT,
  type MountComponentMessage,
  type PreviewMessage,
} from "./protocol";

type ViewportSimulationIFrameProps = {
  width: number;
  height: number;
  previewId: string;
  workfileTheme: ThemeOptions;
  previewComponentProps?: Record<string, unknown>;
  previewRegistry?: Record<
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

const iframePageFileLocation =
  "/src/Editor/Canvas/ZoomPanSurface/ViewportSimulation/iframe.html";

export default function ViewportSimulationIFrame({
  width,
  height,
  previewId,
  workfileTheme,
  previewComponentProps = {},
  previewRegistry = samplesRegistry,
  className,
  style,
  bordered = false,
}: ViewportSimulationIFrameProps) {
  const mountIdRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [ready, setReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const resolvedPreview = useMemo(() => {
    const metadata = previewRegistry[previewId];
    if (!metadata) {
      console.warn(
        `[ViewportSimulationFrame] Preview "${previewId}" not found in registry`
      );
      return null;
    }
    return metadata;
  }, [previewId, previewRegistry]);

  const sendUpdate = useCallback(() => {
    if (!ready || !iframeRef.current || !resolvedPreview) return;

    const iframe = iframeRef.current;
    const win = iframe.contentWindow;
    if (!win) return;

    mountIdRef.current++;

    const message: MountComponentMessage = {
      mountId: mountIdRef.current,
      type: MESSAGE_MOUNT_COMPONENT,
      theme: workfileTheme,
      previewId: previewId, // Send ID for iframe to look up
      previewLabel: resolvedPreview.label, // Send label for debugging
      registryPreviewIds: Object.keys(previewRegistry), // Send list of available components
      props: {
        ...previewComponentProps,
        // Inject viewport dimensions as props
        __viewportWidth: width,
        __viewportHeight: height,
      },
    };

    console.log("[ViewportSimulationFrame] Sending MOUNT_COMPONENT:", message);

    // Send theme, component ID, registry info, and viewport dimensions to iframe
    // Use specific origin instead of wildcard for security
    win.postMessage(message, window.location.origin);
  }, [
    ready,
    workfileTheme,
    previewId,
    resolvedPreview,
    previewComponentProps,
    width,
    height,
    previewRegistry,
  ]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    // Set timeout to show warning if iframe doesn't respond within 5 seconds
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
      console.warn(
        "[ViewportSimulationFrame] Iframe handshake timeout - iframe may have failed to load"
      );
    }, 5000);

    // Defensive ordering: attach listener BEFORE setting iframe.src
    // so we don't miss a quick IFRAME_READY post from the content.
    const handleMessage = (event: MessageEvent<PreviewMessage>) => {
      // Helpful debug info to diagnose missing-handshake issues
      // (inspect both event.origin and whether event.source is our iframe)
      try {
        // Note: iframeRef.current may change, so read a local reference
        const currentIframe = iframeRef.current;
        console.debug("[ViewportSimulationFrame] message received", {
          origin: event.origin,
          data: event.data,
        });

        const expectedOrigin = window.location.origin;
        const isSameOrigin = event.origin === expectedOrigin;
        const isFromIframe =
          !!currentIframe && event.source === currentIframe.contentWindow;

        if (!isSameOrigin) {
          console.warn(
            "[ViewportSimulationFrame] Ignoring message from origin",
            event.origin,
            "expected",
            expectedOrigin
          );
          return;
        }

        if (!isFromIframe) {
          console.warn(
            "[ViewportSimulationFrame] Ignoring message - not from our iframe",
            event.source
          );
          return;
        }

        if (event.data?.type === MESSAGE_IFRAME_READY) {
          console.log("[ViewportSimulationFrame] Received IFRAME_READY");
          setReady(true);
          setLoadingTimeout(false); // Clear timeout warning if we receive ready signal
        }
      } catch (err) {
        console.error("[ViewportSimulationFrame] Error handling message:", err);
      }
    };

    window.addEventListener("message", handleMessage);

    // Now set the iframe src (after listener attached)
    // Load the HTML file from ViewportSimulation folder
    iframe.src = iframePageFileLocation;

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeoutId);
    };
  }, []); // Only run once on mount

  // Send update when ready, component changes, or theme changes
  useEffect(() => {
    if (ready && resolvedPreview) {
      console.log("[ViewportSimulationFrame] Config changed, updating iframe");
      sendUpdate();
    }
  }, [ready, resolvedPreview, workfileTheme, sendUpdate]);

  return (
    <Paper
      className={className}
      style={style}
      sx={{
        width,
        height,
        overflow: "hidden",
        border: "none",
        display: "block",
        position: "relative",
        ...(bordered && { border: "2px solid #444" }),
      }}
    >
      {!resolvedPreview && (
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
          Component "{previewId}" not found
        </Box>
      )}

      {resolvedPreview && !ready && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "background.default",
            zIndex: 10,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Loading preview...
          </Typography>
          {loadingTimeout && (
            <Alert severity="warning" sx={{ mt: 2, maxWidth: "80%" }}>
              Preview is taking longer than expected. Check console for errors.
            </Alert>
          )}
        </Box>
      )}

      {resolvedPreview && (
        <iframe
          ref={iframeRef}
          title="Viewport Simulation"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.2s ease-in",
            // Prevent rendering artifacts
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      )}
    </Paper>
  );
}
