import { Box } from "@mui/material";
import React from "react";

type FrameWrapper = {
  children: React.ReactNode;
};

// Frame wrapper: can be intrinsic or fixed; will not force parent bigger
export default function FrameWrapper({ children }: FrameWrapper) {
  return (
    <Box
      sx={{
        boxSizing: "border-box", // include padding/border in size calculations
        paddingBottom: "calc(var(--toolbar-height))", // reserve space for likely bottom toolbar
        maxWidth: "100%", // critical: never exceed available width
        flexShrink: 0, // don't let flex try to squeeze this box horizontally — scroll will appear instead
      }}
    >
      {children}
    </Box>
  );
}
