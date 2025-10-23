import { useRef, useState, useLayoutEffect, useCallback } from "react";
import useCanvasZoomPanSurfaceStore from "./zoomPanSurfaceStore";
import useCanvasObjectViewport from "../ObjectViewport/useCanvasObjectViewport";

export function useCanvasZoomPanSurface(
  externalRef?: React.RefObject<HTMLDivElement | null>
) {
  // Provide an internal fallback ref if none is given
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = externalRef ?? internalRef;

  const [isDragging, setIsDragging] = useState(false);
  // Ref mirror of isDragging to use inside high-frequency handlers and avoid
  // reading stale state or causing extra renders while dragging.
  const isDraggingRef = useRef(false);
  const dragStart = useRef<{
    x: number;
    y: number;
    // ox/oy store the applied translate origin (alignment + pan) at drag start
    ox: number;
    oy: number;
  } | null>(null);

  const zoom = useCanvasZoomPanSurfaceStore((s) => s.zoom);
  const setZoom = useCanvasZoomPanSurfaceStore((s) => s.setZoom);
  const pan = useCanvasZoomPanSurfaceStore((s) => s.pan);
  const setPan = useCanvasZoomPanSurfaceStore((s) => s.setPan);
  const zoomIn = useCanvasZoomPanSurfaceStore((s) => s.zoomIn);
  const zoomOut = useCanvasZoomPanSurfaceStore((s) => s.zoomOut);
  const alignedPosition = useCanvasZoomPanSurfaceStore((s) => s.alignment);
  const alignTo = useCanvasZoomPanSurfaceStore((s) => s.alignTo);
  const { width } = useCanvasObjectViewport();

  const scale = zoom / 100;

  const getTranslatePosition = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const contentWidth = width || 0;
    return computeTranslate(
      containerWidth,
      contentWidth,
      scale,
      pan,
      alignedPosition
    );
  }, [alignedPosition, pan, scale, width, containerRef]);

  const [translatePosition, setTranslatePosition] =
    useState(getTranslatePosition);

  /** Handle zoom with Ctrl + wheel */
  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    const newZoom = Math.min(300, Math.max(20, zoom + delta));
    setZoom(newZoom);
  };

  /** Handle double click for zoom in/out */
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.shiftKey) zoomOut();
    else zoomIn();
  };

  /** Handle panning */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    // record that we're dragging and capture the pointer
    setIsDragging(true);
    isDraggingRef.current = true;

    // record the currently applied translate (includes alignment + pan)
    const applied = getTranslatePosition();
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: applied.x,
      oy: applied.y,
    };
    containerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragStart.current) return;

    // delta from drag start
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // new applied translate (what the UI should show) = originApplied + delta
    const newAppliedX = dragStart.current.ox + dx;
    const newAppliedY = dragStart.current.oy + dy;

    // compute alignment offset (what alignment contributes when pan === 0)
    const containerWidth = containerRef.current?.clientWidth || 0;
    const contentWidth = width || 0;
    const alignOffset = computeAlignmentOffset(
      containerWidth,
      contentWidth,
      scale,
      alignedPosition
    );

    // convert applied translate back to the pan value expected by the store
    const newPanX = newAppliedX - alignOffset.x;
    const newPanY = newAppliedY; // vertical alignment not currently modified

    setPan(newPanX, newPanY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    containerRef.current.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    isDraggingRef.current = false;
    dragStart.current = null;
  };

  /** Reapply alignment when container resizes */
  useLayoutEffect(() => {
    const handleResize = () => {
      if (alignedPosition === "pan") {
        return;
      }

      alignTo(alignedPosition);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [alignedPosition, alignTo, containerRef]);

  useLayoutEffect(() => {
    setTranslatePosition(getTranslatePosition());

    const el = containerRef.current;
    if (!el) return;

    // update whenever the container size changes
    const ro = new ResizeObserver(() => {
      setTranslatePosition(getTranslatePosition());
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, [getTranslatePosition, containerRef]);

  return {
    ref: containerRef, // expose for internal/fallback use
    zoom,
    scale,
    pan,
    isDragging,
    translatePosition,
    handleWheel,
    handleDoubleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}

/**
 * Compute the translate position (applied transform) given inputs.
 * This is a pure helper so it can be tested independently.
 */
function computeTranslate(
  containerWidth: number,
  contentWidth: number,
  scale: number,
  pan: { x: number; y: number },
  alignment: string
) {
  let x = pan.x;

  switch (alignment) {
    case "start":
      x = 0;
      break;
    case "center":
      x = (containerWidth - contentWidth * scale) / 2;
      break;
    default:
      break;
  }

  return { x, y: pan.y };
}

/**
 * Compute alignment offset (applied translate when pan === {x:0,y:0}).
 */
function computeAlignmentOffset(
  containerWidth: number,
  contentWidth: number,
  scale: number,
  alignment: string
) {
  return computeTranslate(
    containerWidth,
    contentWidth,
    scale,
    { x: 0, y: 0 },
    alignment
  );
}
