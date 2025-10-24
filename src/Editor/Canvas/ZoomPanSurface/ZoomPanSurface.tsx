import CanvasZoomPanSurfaceControls from "./ZoomPanSurfaceControls";
import ViewportSimulationControls from "../ViewportSimulation/ViewportSimulationControls";
import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useCanvasZoomPanSurface } from "./useZoomPanSurface";
import useZoomPanStore from "./zoomPanSurfaceStore";
import useViewportStore from "../ViewportSimulation/viewportSimulationStore";

type CanvasBodyZoomPanProps = {
  children: React.ReactNode;
};

export default function CanvasBodyZoomPan({
  children,
}: CanvasBodyZoomPanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragLock = useZoomPanStore((state) => state.dragLock);
  const setZoom = useZoomPanStore((state) => state.setZoom);
  const alignTo = useZoomPanStore((state) => state.alignTo);
  const viewportWidth = useViewportStore((state) => state.width);
  const viewportHeight = useViewportStore((state) => state.height);

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

  // Auto-fit zoom when viewport size changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !viewportWidth || !viewportHeight) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Add some padding (10% on each side)
    const paddingFactor = 0.9;
    const availableWidth = containerWidth * paddingFactor;
    const availableHeight = containerHeight * paddingFactor;

    // Calculate zoom to fit
    const scaleX = (availableWidth / viewportWidth) * 100;
    const scaleY = (availableHeight / viewportHeight) * 100;
    const fitZoom = Math.min(scaleX, scaleY, 100); // Don't zoom beyond 100%

    // Round to nearest 5 for cleaner values (e.g., 45, 50, 55 instead of 47.3)
    const roundedZoom = Math.round(fitZoom / 5) * 5;

    setZoom(roundedZoom);
    alignTo("center"); // Center align when fitting
  }, [viewportWidth, viewportHeight, setZoom, alignTo]);

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
          overflow: "clip", // Use clip instead of hidden for sharper edges
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
          {children}
        </Box>
      </Box>

      <ViewportSimulationControls />
      <CanvasZoomPanSurfaceControls />
    </>
  );
}
