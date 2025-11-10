import { Button, ButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useCanvasViewStore from "../../canvasViewStore";
import CameraControlPopOver from "./CameraControlPopOver";

export default function CameraControls() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const zoom = useCanvasViewStore((s) => s.camera.zoom);
  const zoomIn = useCanvasViewStore((s) => s.zoomIn);
  const zoomOut = useCanvasViewStore((s) => s.zoomOut);
  const cycleZoomPreset = useCanvasViewStore((s) => s.cycleZoomPreset);

  return (
    <>
      {isLargeScreen ? (
        <ButtonGroup
          size="large" // equivalent of size="medium" of ToggleButtonGroup
          sx={{
            borderRadius: 1,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(40px)",
          }}
        >
          <Button
            onClick={zoomOut}
            sx={{
              borderColor: "rgba(0,0,0,0.1)",
              paddingInline: 1,
            }}
          >
            <RemoveIcon />
          </Button>

          <Button
            onClick={cycleZoomPreset}
            aria-label={`Zoom level ${zoom} percent`}
            sx={{
              textTransform: "none",
              borderColor: "rgba(0,0,0,0.1)",
              paddingInline: 2,
            }}
          >
            {zoom}%
          </Button>

          <Button
            onClick={zoomIn}
            sx={{
              borderColor: "rgba(0,0,0,0.1)",
              paddingInline: 1,
            }}
          >
            <AddIcon />
          </Button>
        </ButtonGroup>
      ) : (
        <CameraControlPopOver />
      )}
    </>
  );
}

