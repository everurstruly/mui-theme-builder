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

// Extend window for root storage
declare global {
  interface Window {
    __reactRoot?: Root;
  }
}

// Component registry - add your components here
import DashboardExample from "../../../Samples/DashboardExample";

const COMPONENT_REGISTRY: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  DashboardExample,
};

type MessageData = {
  type: string;
  mountId?: number;
  theme?: ThemeOptions;
  component?: string;
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
    component: string | null;
    props: Record<string, unknown>;
  }>({
    theme: createTheme(),
    component: null,
    props: {},
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent<MessageData>) => {
      if (event.data?.type === "MOUNT_COMPONENT") {
        const { theme: themeOpts, component, props = {} } = event.data;

        console.log("[iframe] Received MOUNT_COMPONENT:", {
          component,
          props,
          themeOpts,
        });

        if (themeOpts) {
          try {
            let theme = createTheme(themeOpts as ThemeOptions);
            theme = responsiveFontSizes(theme);
            setConfig({ theme, component: component || null, props });
            console.log("[iframe] Component mounted successfully:", component);
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

  const { theme, component, props } = config;

  if (!component) {
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

  const Component = COMPONENT_REGISTRY[component];

  if (!Component) {
    return (
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
        Component "{component}" not found in registry
      </div>
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
