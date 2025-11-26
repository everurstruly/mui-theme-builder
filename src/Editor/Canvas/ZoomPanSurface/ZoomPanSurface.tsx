import useCanvasView from "../useCanvasView";
import ZoomPanSurfaceControls from "./ZoomPanSurfaceControls";
import CanvasViewport from "./ZoomPanSurfaceViewport";
import useCanvasZoomPanCamera from "./useZoomPanCamera";
import useCanvasGestures from "./useCanvasGestures";
import useCanvasKeyboardShortcuts from "./useCanvasKeyboardShortcuts";
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import useEdit from "../../Design/Edit/useEdit";
import useCreatedThemeOption from "../../Design/Edit/useCreatedThemeOption";

type ZoomPanSurfaceProps = {
  /** Custom registry. If not provided, uses samplesRegistry */
  registry?: Record<
    string,
    {
      id: string;
      label: string;
      component: React.ComponentType<Record<string, unknown>>;
    }
  >;
  /** Custom controls to render at the bottom-left. If not provided, uses default ZoomPanSurfaceControls */
  leftControls?: React.ReactNode;
  /** Custom controls to render at the bottom-right. If not provided, uses default zoom/alignment controls */
  rightControls?: React.ReactNode;
  /** Custom controls to render at the top. If not provided, no top controls are rendered */
  topControls?: React.ReactNode;
  /** Whether to render default controls. Set to false to use only custom slots */
  showDefaultControls?: boolean;
};

export default function ZoomPanSurface({
  leftControls,
  rightControls,
  topControls,
  showDefaultControls = true,
}: ZoomPanSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const component = useEdit((s) => s.activePreviewId);
  const themeOptions = useCreatedThemeOption();

  // New unified store selectors
  const width = useCanvasView((s) => s.viewport.width);
  const height = useCanvasView((s) => s.viewport.height);
  const dragLock = useCanvasView((s) => s.camera.dragLock);
  const setCameraAlignment = useCanvasView((s) => s.setCameraAlignment);
  const zoomToFit = useCanvasView((s) => s.zoomToFit);

  // Camera calculations (positions, scale)
  const { scale, isDragging, translatePosition } =
    useCanvasZoomPanCamera(containerRef);

  // Gesture handlers (wheel, pointer events)
  const {
    handleWheel,
    // handleDoubleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCanvasGestures(containerRef);

  // Enable keyboard shortcuts
  useCanvasKeyboardShortcuts();

  // Memoized cursor style based on drag state
  const cursorStyle = useMemo(() => {
    if (!dragLock) return "default";
    return isDragging ? "grabbing" : "grab";
  }, [dragLock, isDragging]);

  // Auto-fit zoom when viewport size changes
  const handleAutoFit = useCallback(() => {
    const container = containerRef.current;
    if (!container || !width || !height) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Use the store's zoomToFit method
    zoomToFit(containerWidth, containerHeight);
    setCameraAlignment("center"); // Center align when fitting
  }, [width, height, zoomToFit, setCameraAlignment]);

  // Only auto-fit on initial mount, not on every dimension change
  useEffect(() => {
    handleAutoFit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return (
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
        cursor: cursorStyle,
        userSelect: dragLock ? "none" : "auto", // Only prevent selection when pan mode is active
        touchAction: dragLock ? "none" : "auto", // Only prevent touch when pan mode is active
      }}
    >
      <CanvasViewport
        previewId={component}
        workfileTheme={themeOptions}
        width={width}
        height={height}
        scale={scale}
        translatePosition={translatePosition}
        isDragging={isDragging}
        dragLock={dragLock}
      />

      {/* Top controls slot */}
      {topControls && (
        <Box
          sx={{
            position: "absolute",
            top: ".5rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {topControls}
        </Box>
      )}

      {/* Default or custom controls */}
      {showDefaultControls ? (
        <ZoomPanSurfaceControls leftSlot={leftControls} rightSlot={rightControls} />
      ) : (
        <>
          {leftControls}
          {rightControls}
        </>
      )}
    </Box>
  );
}

