import React from "react";
import { Box } from "@mui/material";
import ScreenSizeControls from "./CanvasViewportControls";
import useCanvasViewport from "./useCanvasViewport";

type CanvasBodyFitContentProps = {
  children: React.ReactNode;
};

export default function CanvasBodyFitContent({
  children,
}: CanvasBodyFitContentProps) {
  const { containerRef, scale, width } = useCanvasViewport();

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "relative",
          paddingTop: "4rem", // give more alignment freedom
        }}
      >
        <Box
          sx={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: width,
            height: "auto",
            pointerEvents: "auto",
          }}
        >
          {children}
        </Box>
      </Box>

      <ScreenSizeControls />
    </>
  );
}
