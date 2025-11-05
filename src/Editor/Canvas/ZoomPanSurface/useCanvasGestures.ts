/**
 * Canvas Gesture Handler
 * 
 * Handles all user gestures for canvas interaction:
 * - Wheel zoom (Ctrl+Wheel)
 * - Pointer dragging (pan)
 * - Double-click zoom
 * 
 * Separated from camera calculations for cleaner architecture.
 */

import { useRef, useCallback } from "react";
import useCanvasViewStore from "../canvasViewStore";
import { computeDragPosition } from "./zoomPanLogic";

export interface CanvasGestureHandlers {
  handleWheel: (e: React.WheelEvent) => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
}

export default function useCanvasGestures(
  containerRef: React.RefObject<HTMLDivElement | null>
): CanvasGestureHandlers {
  const dragStart = useRef<{
    x: number;
    y: number;
    startPosition: { x: number; y: number };
  } | null>(null);

  // Store selectors
  const zoom = useCanvasViewStore((s) => s.camera.zoom);
  const position = useCanvasViewStore((s) => s.camera.position);
  const setZoom = useCanvasViewStore((s) => s.setZoom);
  const zoomIn = useCanvasViewStore((s) => s.zoomIn);
  const zoomOut = useCanvasViewStore((s) => s.zoomOut);
  const setCameraPosition = useCanvasViewStore((s) => s.setCameraPosition);
  const setIsDragging = useCanvasViewStore((s) => s.setIsDragging);

  /** Handle zoom with Ctrl + wheel */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 5 : -5;
      setZoom(zoom + delta);
    },
    [zoom, setZoom]
  );

  /** Handle double click for zoom in/out */
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (e.shiftKey) {
        zoomOut();
      } else {
        zoomIn();
      }
    },
    [zoomIn, zoomOut]
  );

  /** Handle pan start */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        startPosition: { x: position.x, y: position.y },
      };
      containerRef.current.setPointerCapture(e.pointerId);
    },
    [containerRef, position, setIsDragging]
  );

  /** Handle pan move */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current) return;

      const newPos = computeDragPosition(
        { x: dragStart.current.x, y: dragStart.current.y },
        { x: e.clientX, y: e.clientY },
        dragStart.current.startPosition
      );

      setCameraPosition(newPos.x, newPos.y);
    },
    [setCameraPosition]
  );

  /** Handle pan end */
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      containerRef.current.releasePointerCapture(e.pointerId);
      setIsDragging(false);
      dragStart.current = null;
    },
    [containerRef, setIsDragging]
  );

  return {
    handleWheel,
    handleDoubleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
