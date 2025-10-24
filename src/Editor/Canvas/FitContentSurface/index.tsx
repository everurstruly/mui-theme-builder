import React from "react";
import { Box } from "@mui/material";

type CanvasBodyFitContentProps = {
  children: React.ReactNode;
};

/**
 * Legacy surface - use ZoomPanSurface instead
 * @deprecated
 */
export default function CanvasBodyFitContent({
  children,
}: CanvasBodyFitContentProps) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        position: "relative",
        paddingBlock: "5rem", // give more canvas panning freedom
      }}
    >
      <Box
        sx={{
          width: "auto",
          height: "auto",
          pointerEvents: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
