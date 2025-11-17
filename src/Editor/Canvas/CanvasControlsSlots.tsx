import React from "react";
import { Box } from "@mui/material";

type CanvasControlsSlotsProps = {
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  stretchedTop?: React.ReactNode;
};

export default function CanvasControlsSlots({
  bottomLeft: leftControls,
  bottomRight,
  stretchedTop: topControls,
}: CanvasControlsSlotsProps) {
  return (
    <>
      {/* Top center controls */}
      {topControls && (
        <Box
          sx={{
            position: "absolute",
            top: "0.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "auto",
          }}
        >
          {topControls}
        </Box>
      )}

      {/* Bottom-left controls */}
      {leftControls && (
        <Box
          sx={{
            position: "absolute",
            bottom: 2,
            left: 8,
            zIndex: 1400,
            pointerEvents: "auto",
          }}
        >
          {leftControls}
        </Box>
      )}

      {/* Bottom-right controls */}
      {bottomRight && (
        <Box
          sx={{
            position: "absolute",
            bottom: 2,
            right: 10,
            zIndex: 10,
            pointerEvents: "auto",
          }}
        >
          {bottomRight}
        </Box>
      )}
    </>
  );
}
