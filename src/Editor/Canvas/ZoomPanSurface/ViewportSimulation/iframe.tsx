import { StrictMode, useEffect, useState, useMemo, Component } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { samplesRegistry } from "../../../Previews/registry";
import type { ErrorInfo, ReactNode } from "react";
import type { Root } from "react-dom/client";
import type { ThemeOptions } from "@mui/material/styles";
import {
  MESSAGE_IFRAME_READY,
  MESSAGE_MOUNT_COMPONENT,
  type MountComponentMessage,
  type PreviewMessage,
} from "./protocol";

// Extend window for root storage
declare global {
  interface Window {
    __reactRoot?: Root;
  }
}

type ViewportSimulationIframeConfigState = {
  props: Record<string, unknown>;
  themeOptions?: ThemeOptions;
  previewId: string | null;
  previewTitle: string | null;
};

export default function ViewportSimulationIframe() {
  const [config, setConfig] = useState<ViewportSimulationIframeConfigState>({
    themeOptions: undefined,
    previewId: null,
    previewTitle: null,
    props: {},
  });
  
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Memoize theme creation - only recreate when themeOptions actually change
  const theme = useMemo(() => {
    try {
      // Check if themeOptions is empty or has no meaningful content
      const hasThemeContent = 
        config.themeOptions && 
        Object.keys(config.themeOptions).length > 0 &&
        config.themeOptions.palette !== undefined;

      if (!hasThemeContent) {
        console.log("[iframe] Using default theme (no theme options provided)");
        return responsiveFontSizes(createTheme());
      }

      console.log("[iframe] Creating theme from options");
      let newTheme = createTheme(config.themeOptions);
      newTheme = responsiveFontSizes(newTheme);

      console.log("[iframe] Theme created:", {
        mode: newTheme.palette.mode,
        primaryColor: newTheme.palette.primary.main,
      });

      return newTheme;
    } catch (error) {
      console.error("[iframe] Error creating theme:", error);
      setRenderError(error instanceof Error ? error : new Error(String(error)));
      return responsiveFontSizes(createTheme()); // Fallback to default theme
    }
  }, [config.themeOptions]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<PreviewMessage>) => {
      // SECURITY: Validate origin to prevent unauthorized postMessages
      if (event.origin !== window.location.origin) {
        console.warn("[iframe] Ignoring message from untrusted origin:", event.origin);
        return;
      }

      if (event.data?.type === MESSAGE_MOUNT_COMPONENT) {
        const data = event.data as MountComponentMessage;
        const {
          theme: themeOpts,
          previewId: componentId,
          previewLabel: componentLabel,
          props = {},
        } = data;

        console.log("[iframe] Received MOUNT_COMPONENT:", {
          componentId,
          componentLabel,
          hasThemeOpts: !!themeOpts,
        });

        // Always update config with previewId, even if theme is missing
        try {
          setConfig({
            themeOptions: (themeOpts as ThemeOptions) || {},
            previewId: componentId || null,
            previewTitle: componentLabel || null,
            props,
          });
        } catch (error) {
          console.error("[iframe] Error updating config:", error);
          // Fallback to default theme
          setConfig({
            themeOptions: {},
            previewId: componentId || null,
            previewTitle: componentLabel || null,
            props,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Signal to parent that iframe is ready
    // Use explicit origin for symmetry and better security; parent validates origin.
    console.log("[iframe] Sending IFRAME_READY to parent");
    window.parent.postMessage({ type: MESSAGE_IFRAME_READY }, window.location.origin);

    return () => window.removeEventListener("message", handleMessage);
  }, []); // Empty deps - listener is stable

  const { previewId, props } = config;

  // Show render errors from theme creation
  if (renderError) {
    return (
      <StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              gap: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" color="error">
              Theme Error
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {renderError.message}
            </Typography>
          </Paper>
        </ThemeProvider>
      </StrictMode>
    );
  }

  // Always wrap in theme provider for consistent styling
  if (!previewId) {
    return (
      <StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Waiting for component...
            </Typography>
          </Box>
        </ThemeProvider>
      </StrictMode>
    );
  }

  // Look up component from local registry (iframe has its own copy of samplesRegistry)
  console.log("[iframe] Looking up component:", previewId);
  console.log("[iframe] Available components:", Object.keys(samplesRegistry));
  const Component = samplesRegistry[previewId]?.component;

  if (!Component) {
    console.error("[iframe] Component not found:", previewId);
    return (
      <StrictMode>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: 1,
              }}
            >
              <Typography variant="h6" color="error">
                Component not found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                "{previewId}" is not in the registry
              </Typography>
            </Box>
          </ThemeProvider>
        </ErrorBoundary>
      </StrictMode>
    );
  }

  return (
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...props} />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

// Mount the app - handle HMR properly
const rootElement = document.getElementById("root");
if (rootElement) {
  // Store root instance globally to reuse on HMR
  let rootInstance = window.__reactRoot;

  if (!rootInstance) {
    rootInstance = createRoot(rootElement);
    window.__reactRoot = rootInstance;
  }

  rootInstance.render(<ViewportSimulationIframe />);
}

// Error Boundary - Note: Must use class component as React doesn't support error boundaries with hooks yet
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[iframe ErrorBoundary] Caught error:", error);
    console.error("[iframe ErrorBoundary] Error info:", errorInfo);
    console.error("[iframe ErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 3,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="error">
            Error in component
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message}
          </Typography>
          <Box
            component="pre"
            sx={{
              fontSize: "12px",
              overflow: "auto",
              maxWidth: "100%",
              maxHeight: "300px",
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          >
            {this.state.error?.stack}
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

