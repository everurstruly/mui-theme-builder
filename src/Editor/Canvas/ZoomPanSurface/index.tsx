import CanvasZoomPanSurfaceControls from "./ZoomPanSurfaceControls";
import ViewportSimulationControls from "../ViewportSimulation/ViewportSimulationControls";
import React, { useRef } from "react";
import { Box } from "@mui/material";
import { useCanvasZoomPanSurface } from "./useZoomPanSurface";

type CanvasBodyZoomPanProps = {
  children: React.ReactNode;
};

export default function CanvasBodyZoomPan({
  children,
}: CanvasBodyZoomPanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    scale,
    isDragging,
    translatePosition,
    handleWheel,
    // handleDoubleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCanvasZoomPanSurface(containerRef);

  return (
    <>
      <Box
        ref={containerRef}
        onWheel={handleWheel}
        // onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <Box
          sx={{
            transform: `translate(${translatePosition.x}px, ${translatePosition.y}px) scale(${scale})`,
            transformOrigin: "top left",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          {children}
        </Box>
      </Box>

      <ViewportSimulationControls />
      <CanvasZoomPanSurfaceControls />
    </>
  );
}
