/**
 * ViewportFrameContent.tsx
 *
 * Runs INSIDE the iframe (content context).
 *
 * RESPONSIBILITIES:
 * - Mounts a React app that listens for MOUNT_COMPONENT messages from parent
 * - Creates a ThemeProvider and renders the requested component
 * - Validates all incoming messages (check origin, message type)
 * - Provides error boundaries and fallback UI
 *
 * RELATED FILES (follow the flow):
 * 1. ViewportSimulation.tsx ← entry point (the component you import)
 * 2. ViewportFrameHost.tsx ← runs in parent (manages iframe + posts messages to THIS file)
 * 3. public/iframe-viewport.html ← loads THIS FILE inside the iframe
 * 4. ViewportFrameContent.tsx ← THIS FILE (runs inside the iframe)
 * 5. protocol.ts ← shared message types (used by ViewportFrameHost.tsx and THIS file)
 *
 * HANDSHAKE:
 * [This file mounts] → validates it can access its own registry → posts IFRAME_READY to parent
 *   ↓
 * [Parent receives IFRAME_READY] → parent becomes ready
 *   ↓
 * [Parent posts MOUNT_COMPONENT] → with { componentId, theme, registry metadata, props }
 *   ↓
 * [This file receives MOUNT_COMPONENT] → validates origin + message type → renders component
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

// Message payload types are defined in `protocol.ts` and imported above.

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
    const handleMessage = (event: MessageEvent<PreviewMessage>) => {
      // Validate origin to prevent unauthorized postMessages
      if (event.origin !== window.location.origin) {
        console.warn(
          "[iframe] Ignoring message from untrusted origin:",
          event.origin
        );
        return;
      }

      if (event.data?.type === MESSAGE_MOUNT_COMPONENT) {
        const data = event.data as MountComponentMessage;
        const { theme: themeOpts, componentId, componentLabel, registryData, props = {} } = data;

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
    // Use explicit origin for symmetry and better security; parent validates origin.
    console.log("[iframe] Sending IFRAME_READY to parent");
    window.parent.postMessage({ type: MESSAGE_IFRAME_READY }, window.location.origin);

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
