import CanvasZoomPanSurfaceControls from "./ZoomPanSurfaceControls";
import ViewportSimulationControls from "../ViewportSimulation/ViewportSimulationControls";
import React, { useRef } from "react";
import { Box } from "@mui/material";
import { useCanvasZoomPanSurface } from "./useZoomPanSurface";
import useZoomPanStore from "./zoomPanSurfaceStore";

type CanvasBodyZoomPanProps = {
  children: React.ReactNode;
};

export default function CanvasBodyZoomPan({
  children,
}: CanvasBodyZoomPanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragLock = useZoomPanStore((state) => state.dragLock);
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
        onWheel={dragLock ? handleWheel : undefined}
        // onDoubleClick={handleDoubleClick}
        onPointerDown={dragLock ? handlePointerDown : undefined}
        onPointerMove={dragLock ? handlePointerMove : undefined}
        onPointerUp={dragLock ? handlePointerUp : undefined}
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          cursor: dragLock ? (isDragging ? "grabbing" : "grab") : "default",
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
            pointerEvents: dragLock ? "none" : "auto", // When locked (pan mode), disable pointer events on content
            "& > *": {
              pointerEvents: dragLock ? "none" : "auto", // Apply to children (iframe) as well
            },
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
