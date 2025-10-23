import { Box } from "@mui/material";
import React from "react";
import CanvasViewportControls from "./CanvasViewportControls";

type CanvasBodyContainContentProps = {
  children: React.ReactNode;
};

export default function CanvasBodyContainContent({
  children,
}: CanvasBodyContainContentProps) {
  return (
    <>
      <Box
        sx={() => ({
          boxSizing: "border-box",
          flex: "1 1 auto",
          minWidth: 0,
          overflow: "overlay", // overlay scrollbars (non-standard; works in Chromium/WebKit)
          height: "100%",

          padding: 0,
          backgroundColor: "transparent",

          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",

          // custom scrollbars with blurred thumb background (Chromium/WebKit)
          scrollbarWidth: "thin" /* Firefox */,
          scrollbarColor: "rgba(0,0,0,0.25) transparent",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            // semi-transparent so the blur effect behind the thumb is visible
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: "999px",
            // enable backdrop blur for Chromium / Safari
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            // small transparent border so the blur doesn't bleed to the edges
            border: "1px solid rgba(0,0,0,0.0)",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.48)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        })}
      >
        {children}
      </Box>

      <CanvasViewportControls />
    </>
  );
}
