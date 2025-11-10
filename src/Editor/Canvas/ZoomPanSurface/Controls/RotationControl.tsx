/**
 * RotationControl
 * 
 * Rotates the viewport by swapping width and height.
 * Useful for testing portrait/landscape orientations.
 */

import { IconButton, Tooltip } from "@mui/material";
import { ScreenRotation } from "@mui/icons-material";
import useCanvasViewStore from "../../canvasViewStore";

export default function RotationControl() {
  const rotateViewport = useCanvasViewStore((s) => s.rotateViewport);
  const { width, height } = useCanvasViewStore((s) => s.viewport);

  return (
    <Tooltip
      title={`Rotate viewport (${width}×${height} → ${height}×${width})`}
      arrow
    >
      <IconButton
        onClick={rotateViewport}
        size="medium"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          },
        }}
        aria-label="rotate viewport"
      >
        <ScreenRotation fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

