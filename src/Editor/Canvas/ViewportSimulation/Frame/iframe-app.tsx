/**
 * This module runs inside the iframe and handles mounting React components
 * with the theme passed from the parent window.
 */

import { StrictMode, useEffect, useState, Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { Theme, ThemeOptions } from "@mui/material/styles";
import { samplesRegistry } from "../../../Samples/registry";

// Extend window for root storage
declare global {
  interface Window {
    __reactRoot?: Root;
  }
}

type MessageData = {
  type: string;
  mountId?: number;
  theme?: ThemeOptions;
  componentId?: string;
  componentLabel?: string;
  registryData?: Record<
    string,
    { id: string; label: string; description: string }
  >;
  registryComponentIds?: string[];
  props?: Record<string, unknown>;
};

// Error Boundary
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
    console.error("Error in iframe app:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            color: "#d32f2f",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h3>Error in iframe component</h3>
          <p>{this.state.error?.message}</p>
          <pre style={{ fontSize: "12px", overflow: "auto" }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function IframeApp() {
  const [config, setConfig] = useState<{
    theme: Theme;
    componentId: string | null;
    componentLabel: string | null;
    registryData: Record<
      string,
      { id: string; label: string; description: string }
    > | null;
    props: Record<string, unknown>;
  }>({
    theme: createTheme(),
    componentId: null,
    componentLabel: null,
    registryData: null,
    props: {},
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent<MessageData>) => {
      if (event.data?.type === "MOUNT_COMPONENT") {
        const {
          theme: themeOpts,
          componentId,
          componentLabel,
          registryData,
          props = {},
        } = event.data;

        console.log("[iframe] Received MOUNT_COMPONENT:", {
          componentId,
          componentLabel,
          registryData,
          props,
          themeOpts,
        });

        if (themeOpts) {
          try {
            let theme = createTheme(themeOpts as ThemeOptions);
            theme = responsiveFontSizes(theme);
            setConfig({
              theme,
              componentId: componentId || null,
              componentLabel: componentLabel || null,
              registryData: registryData || null,
              props,
            });
            console.log(
              "[iframe] Component config updated:",
              componentId,
              componentLabel
            );
          } catch (error) {
            console.error("[iframe] Error creating theme:", error);
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Signal to parent that iframe is ready
    console.log("[iframe] Sending IFRAME_READY to parent");
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const { theme, componentId, componentLabel, registryData, props } = config;

  if (!componentId) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "system-ui, sans-serif",
          color: "#666",
        }}
      >
        Waiting for component...
      </div>
    );
  }

  // Validate component exists in registry data sent from parent
  if (!registryData || !registryData[componentId]) {
    return (
      <StrictMode>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                fontFamily: "system-ui, sans-serif",
                color: "#d32f2f",
              }}
            >
              Component "{componentLabel || componentId}" not in registry
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </StrictMode>
    );
  }

  // Look up component from local registry (iframe has its own copy)
  const Component = samplesRegistry[componentId]?.component;

  if (!Component) {
    return (
      <StrictMode>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                fontFamily: "system-ui, sans-serif",
                color: "#d32f2f",
              }}
            >
              Component "{componentLabel || componentId}" could not be loaded
            </div>
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

  rootInstance.render(<IframeApp />);
}

// Export for Fast Refresh
export default IframeApp;
