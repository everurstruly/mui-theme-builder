import { Box } from "@mui/material";
import { memo } from "react";
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

const CanvasViewport = memo(function CanvasViewport({
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
      <ViewportSimulation
        bordered
        width={width}
        height={height}
        previewId={previewId}
        workfileTheme={workfileTheme}
      />
    </Box>
  );
});

export default CanvasViewport;
