import { Box } from "@mui/material";
import useEditorUiStore from "../useEditorStore";

type CanvasFrameProps = {
  controls?: {
    bottomLeft?: React.ReactNode;
    bottomRight?: React.ReactNode;
    bottomCenter?: React.ReactNode;
    stretchedTop?: React.ReactNode;
  };
  children: React.ReactNode;
};

const controlsZIndex = 10;
const defaultControlsPosition = {
  bottom: ".625rem",
  right: ".875rem",
  top: ".875rem",
  left: ".875rem",
};

export default function CanvasFrame({ controls = {}, children }: CanvasFrameProps) {
  const setMouseOverCanvas = useEditorUiStore((state) => state.setMouseOverCanvas);

  return (
    <Box
      onMouseEnter={() => setMouseOverCanvas(true)}
      onMouseLeave={() => setMouseOverCanvas(false)}
      sx={(t) => ({
        position: "relative", // acts as the board/wrapper for surfaces
        flexGrow: 1,
        minWidth: 0, // <-- ensure this flex child can shrink
        overflow: "hidden", // <-- contain expansion, create clip/scroll context
        height: "100%",
        maxWidth: "var(--canvas-max-width)",
        border: "1px solid",
        borderColor: t.palette.divider,
        // borderRightColor: mouseOverPropertiesPanel ? "text.secondary" : "divider",
        // backgroundColor: "#f5f5f5",
        // backgroundColor: mouseOverPropertiesPanel ? "#eee" : "#f5f5f5",
        backgroundColor: t.palette.background.default,
        backgroundImage: `
            radial-gradient(circle at center, ${
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)"
            } 1px, transparent 1px)
          `,
        backgroundSize: "12px 12px",
        backgroundPosition: "0 0",
        transition: "border-color 500ms ease",
      })}
    >
      {children}

      {controls.stretchedTop && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: defaultControlsPosition.top,
            transform: "translateX(-50%)",
            zIndex: controlsZIndex,
            pointerEvents: "auto",
          }}
        >
          {controls.stretchedTop}
        </Box>
      )}

      {controls.bottomLeft && (
        <Box
          sx={{
            position: "absolute",
            bottom: defaultControlsPosition.bottom,
            left: defaultControlsPosition.left,
            zIndex: controlsZIndex,
            pointerEvents: "auto",
          }}
        >
          {controls.bottomLeft}
        </Box>
      )}

      
      {controls.bottomCenter && (
        <Box
          sx={{
            position: "absolute",
            bottom: defaultControlsPosition.bottom,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: controlsZIndex,
            pointerEvents: "auto",
          }}
        >
          {controls.bottomCenter}
        </Box>
      )}

      {controls.bottomRight && (
        <Box
          sx={{
            position: "absolute",
            bottom: defaultControlsPosition.bottom,
            right: defaultControlsPosition.right,
            zIndex: controlsZIndex,
            pointerEvents: "auto",
          }}
        >
          {controls.bottomRight}
        </Box>
      )}
    </Box>
  );
}
