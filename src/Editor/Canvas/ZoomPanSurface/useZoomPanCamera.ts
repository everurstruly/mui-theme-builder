/**
 * Canvas Camera Hook
 * 
 * Manages camera state and transformations for the canvas view.
 * Focuses on calculating positions, scale, and alignment.
 * 
 * Gesture handling is in useCanvasGestures.
 */

import { useRef, useState, useLayoutEffect, useCallback } from "react";
import useCanvasViewStore from "../canvasViewStore";
import {
  computeTranslatePosition,
  computeAlignedPosition,
} from "./zoomPanLogic";
import type { ViewAlignment } from "../canvasViewStore";

export interface CanvasCameraState {
  ref: React.RefObject<HTMLDivElement | null>;
  scale: number;
  isDragging: boolean;
  translatePosition: { x: number; y: number };
}

export default function useCanvasZoomPanCamera(
  externalRef?: React.RefObject<HTMLDivElement | null>
): CanvasCameraState {
  // Provide an internal fallback ref if none is given
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = externalRef ?? internalRef;

  // New unified store selectors
  const zoom = useCanvasViewStore((s) => s.camera.zoom);
  const position = useCanvasViewStore((s) => s.camera.position);
  const setCameraPositionPreserveAlignment = useCanvasViewStore(
    (s) => s.setCameraPositionPreserveAlignment
  );
  const alignment = useCanvasViewStore((s) => s.camera.alignment);
  const isDragging = useCanvasViewStore((s) => s.camera.isDragging);
  const width = useCanvasViewStore((s) => s.viewport.width);
  const height = useCanvasViewStore((s) => s.viewport.height);

  const scale = zoom / 100;

  const getTranslatePosition = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const containerHeight = containerRef.current?.clientHeight || 0;
    const contentWidth = width || 0;
    const contentHeight = height || 0;
    return computeTranslatePosition(
      containerWidth,
      contentWidth,
      containerHeight,
      contentHeight,
      scale,
      position,
      alignment
    );
  }, [alignment, position, scale, width, height, containerRef]);

  const [translatePosition, setTranslatePosition] =
    useState(getTranslatePosition);

  /**
   * Apply aligned position when alignment mode changes to center/start.
   * Hook reacts to alignment changes and computes the correct visual position.
   */
  useLayoutEffect(() => {
    if (alignment === "pan") {
      return; // In pan mode, position is controlled by user drag
    }

    const containerWidth = containerRef.current?.clientWidth || 0;
    const containerHeight = containerRef.current?.clientHeight || 0;
    const contentWidth = width || 0;
    const contentHeight = height || 0;
    const aligned = computeAlignedPosition(
      containerWidth,
      contentWidth,
      containerHeight,
      contentHeight,
      scale,
      alignment as Exclude<ViewAlignment, "pan">
    );
    // Apply the aligned position without switching the alignment mode back to 'pan'.
    setCameraPositionPreserveAlignment(aligned.x, aligned.y);
  }, [alignment, containerRef, scale, setCameraPositionPreserveAlignment, width, height]);

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
  };
}

