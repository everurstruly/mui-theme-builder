import { useRef, useState, useLayoutEffect, useCallback } from "react";
import useCanvasZoomPanSurfaceStore from "./zoomPanSurfaceStore";
import useCanvasObjectViewport from "../ObjectViewport/useCanvasObjectViewport";
import {
  computeTranslatePosition,
  computeAlignedPosition,
  computeDragPosition,
  clampZoom,
} from "./zoomPanLogic";
import type { ViewAlignmentAdjustment } from "./zoomPanSurfaceStore";

export function useCanvasZoomPanSurface(
  externalRef?: React.RefObject<HTMLDivElement | null>
) {
  // Provide an internal fallback ref if none is given
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = externalRef ?? internalRef;

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{
    x: number;
    y: number;
    // store the absolute position at drag start
    startPosition: { x: number; y: number };
  } | null>(null);

  const zoom = useCanvasZoomPanSurfaceStore((s) => s.zoom);
  const setZoom = useCanvasZoomPanSurfaceStore((s) => s.setZoom);
  const zoomIn = useCanvasZoomPanSurfaceStore((s) => s.zoomIn);
  const zoomOut = useCanvasZoomPanSurfaceStore((s) => s.zoomOut);
  const position = useCanvasZoomPanSurfaceStore((s) => s.position);
  const setPosition = useCanvasZoomPanSurfaceStore((s) => s.setPosition);
  const setPositionPreserve = useCanvasZoomPanSurfaceStore((s) => s.setPositionPreserve);
  const alignment = useCanvasZoomPanSurfaceStore((s) => s.alignment);
  const { width } = useCanvasObjectViewport();

  const scale = zoom / 100;

  const getTranslatePosition = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const contentWidth = width || 0;
    return computeTranslatePosition(
      containerWidth,
      contentWidth,
      scale,
      position,
      alignment
    );
  }, [alignment, position, scale, width, containerRef]);

  const [translatePosition, setTranslatePosition] =
    useState(getTranslatePosition);

  /** Handle zoom with Ctrl + wheel */
  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    const newZoom = clampZoom(zoom + delta, 20, 300);
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

  /** Handle panning */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startPosition: { x: position.x, y: position.y },
    };
    containerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;

    const newPos = computeDragPosition(
      { x: dragStart.current.x, y: dragStart.current.y },
      { x: e.clientX, y: e.clientY },
      dragStart.current.startPosition
    );

    setPosition(newPos.x, newPos.y);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    containerRef.current.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    dragStart.current = null;
  };

  /**
   * Apply aligned position when alignment mode changes to center/start.
   * Hook reacts to alignment changes and computes the correct visual position.
   */
  useLayoutEffect(() => {
    if (alignment === "pan") {
      return; // In pan mode, position is controlled by user drag
    }

    const containerWidth = containerRef.current?.clientWidth || 0;
    const contentWidth = width || 0;
    const aligned = computeAlignedPosition(
      containerWidth,
      contentWidth,
      scale,
      alignment as ViewAlignmentAdjustment
    );
    // Apply the aligned position without switching the alignment mode back to 'pan'.
    setPositionPreserve(aligned.x, aligned.y);
  }, [alignment, containerRef, scale, setPositionPreserve, width]);

  /**
   * Update translatePosition for rendering whenever container size or content changes.
   * Uses ResizeObserver to catch container size changes.
   */
  useLayoutEffect(() => {
    const updateTranslate = () => {
      setTranslatePosition(getTranslatePosition());
    };

    // Initial update
    updateTranslate();

    const el = containerRef.current;
    if (!el) return;

    // Watch for container size changes
    const ro = new ResizeObserver(updateTranslate);
    ro.observe(el);

    return () => ro.disconnect();
  }, [getTranslatePosition, containerRef]);

  return {
    ref: containerRef,
    scale,
    isDragging,
    translatePosition,
    handleWheel,
    handleDoubleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
