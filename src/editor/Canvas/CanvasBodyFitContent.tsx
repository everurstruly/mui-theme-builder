import React, { useRef, useLayoutEffect, useState } from "react";
import { Box } from "@mui/material";
import ScreenSizeControls from "./ScreenSizeControls";

type CanvasBodyFitContentProps = {
  children: React.ReactNode;
};

const frameWidth = 1440;

export default function CanvasBodyFitContent({
  children,
}: CanvasBodyFitContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const newScale = Math.min(containerWidth / frameWidth, 1);
      setScale(newScale);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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
          alignItems: "flex-start", // ensures top alignment
          position: "relative",
        }}
      >
        <Box
          sx={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: frameWidth,
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
