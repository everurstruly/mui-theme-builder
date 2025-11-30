import { Box } from "@mui/material";
import { Component, type ReactNode } from "react";
import ViewportSimulation from "./ViewportSimulation";
import type { ThemeOptions } from "@mui/material/styles";

export interface CanvasViewportProps {
  previewId: string;
  workfileTheme: ThemeOptions;
  width: number;
  height: number;
  scale: number;
  translatePosition: { x: number; y: number };
  isDragging: boolean;
  dragLock: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Log to console for diagnostics
    console.error('[Viewport ErrorBoundary] Caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#d32f2f' }}>Preview failed to render: {this.state.error?.message}</div>
        </Box>
      );
    }
    return this.props.children as ReactNode;
  }
}

const CanvasViewport = function CanvasViewport({
  previewId,
  workfileTheme,
  width,
  height,
  scale,
  translatePosition,
  isDragging,
  dragLock,
}: CanvasViewportProps) {
  return (
    <Box
      sx={{
        transform: `translate(${translatePosition.x}px, ${translatePosition.y}px) scale(${scale})`,
        transformOrigin: "top left",
        transition: isDragging ? "none" : "transform 0.1s ease-out",
        width: "fit-content",
        height: "fit-content",
        pointerEvents: dragLock ? "none" : "auto", // When locked (pan mode), disable pointer events on content
        // Prevent rendering artifacts during transforms
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        "& > *": {
          pointerEvents: dragLock ? "none" : "auto", // Apply to children (iframe) as well
        },
      }}
    >
      <ErrorBoundary>
        <ViewportSimulation
          bordered
          width={width}
          height={height}
          previewId={previewId}
          workfileTheme={workfileTheme}
        />
      </ErrorBoundary>
    </Box>
  );
};

export default CanvasViewport;

