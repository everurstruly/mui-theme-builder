import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import useZoomPanStore from "./zoomPanStore";
import ZoomPanControls from "./ZoomPanControls";
import CanvasViewportControls from "./CanvasViewportControls";

type CanvasBodyZoomPanProps = {
  children: React.ReactNode;
};

export default function CanvasBodyZoomPan({
  children,
}: CanvasBodyZoomPanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);

  const zoom = useZoomPanStore((s) => s.zoom);
  const setZoom = useZoomPanStore((s) => s.setZoom);
  const pan = useZoomPanStore((s) => s.pan);
  const setPan = useZoomPanStore((s) => s.setPan);
  const zoomIn = useZoomPanStore((s) => s.zoomIn);
  const zoomOut = useZoomPanStore((s) => s.zoomOut);

  /** Handle zoom with Ctrl + wheel */
  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();

    const delta = e.deltaY < 0 ? 10 : -10; // percentage change
    const newZoom = Math.min(300, Math.max(20, zoom + delta));
    setZoom(newZoom);
  };

  /** Handle double click for zoom in/out */
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.shiftKey) {
      zoomOut();
    } else {
      zoomIn();
    }
  };

  /** Start dragging for panning */
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: pan.x,
      oy: pan.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  /** Apply pan movement */
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan(dragStart.current.ox + dx, dragStart.current.oy + dy);
  };

  /** End drag */
  const handlePointerUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  /** Derived scale */
  const scale = zoom / 100;

  return (
    <>
      <Box
        ref={containerRef}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
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
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "top left",
            transition: isDragging ? "none" : "transform 0.05s linear",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          {children}
        </Box>
      </Box>

      <CanvasViewportControls />
      <ZoomPanControls />
    </>
  );
}
