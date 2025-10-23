import { useRef, useState, useLayoutEffect, useCallback } from "react";
import useZoomPanStore from "./zoomPanStore";
import useCanvasViewport from "./Viewport/useCanvasViewport";

export function useZoomPan(
  externalRef?: React.RefObject<HTMLDivElement | null>
) {
  // Provide an internal fallback ref if none is given
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = externalRef ?? internalRef;

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
  const alignedPosition = useZoomPanStore((s) => s.alignment);
  const alignTo = useZoomPanStore((s) => s.alignTo);
  const { width } = useCanvasViewport();

  const scale = zoom / 100;

  const getTranslatePosition = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const contentWidth = width || 0;
    let x = pan.x;

    switch (alignedPosition) {
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
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: pan.x, oy: pan.y };
    containerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan(dragStart.current.ox + dx, dragStart.current.oy + dy);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    containerRef.current.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    dragStart.current = null;
  };

  /** Reapply alignment when container resizes */
  useLayoutEffect(() => {
    const handleResize = () => alignTo(alignedPosition);
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
