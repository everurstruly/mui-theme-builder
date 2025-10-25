import {
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useCanvasZoomPanSurfaceStore, {
  type ViewAlignmentAdjustment,
} from "../zoomPanSurfaceStore";
import {
  AlignHorizontalCenterOutlined,
  AlignHorizontalLeftOutlined,
} from "@mui/icons-material";
import { useMemo, useCallback } from "react";
import CameraControlPopOver from "./CameraControlPopOver";

export default function CameraControls() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const zoom = useCanvasZoomPanSurfaceStore((state) => state.zoom);
  const zoomIn = useCanvasZoomPanSurfaceStore((state) => state.zoomIn);
  const zoomOut = useCanvasZoomPanSurfaceStore((state) => state.zoomOut);
  const cycleZoomPreset = useCanvasZoomPanSurfaceStore(
    (state) => state.cycleZoomPreset
  );
  const alignment = useCanvasZoomPanSurfaceStore((state) => state.alignment);
  const alignTo = useCanvasZoomPanSurfaceStore((state) => state.alignTo);

  const nextPosition = useMemo<ViewAlignmentAdjustment>(() => {
    const candidates = Object.keys(viewAlignments) as ViewAlignmentAdjustment[];
    const pick = candidates.find((c) => c !== alignment) ?? candidates[0];
    return pick;
  }, [alignment]);

  const nextLabel = viewAlignments[nextPosition].label;
  const IconComponent = viewAlignments[nextPosition].icon;

  const handleAlignmentClick = useCallback(
    () => alignTo(nextPosition),
    [alignTo, nextPosition]
  );

  return (
    <>
      <Tooltip title={nextLabel} arrow>
        <IconButton
          size="medium"
          onClick={handleAlignmentClick}
          aria-label={nextLabel}
          sx={{
            alignSelf: "stretch",
            borderRadius: 1,
            border: 1,
            borderColor: "rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(40px)",
          }}
        >
          <IconComponent fontSize="small" />
        </IconButton>
      </Tooltip>

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

const viewAlignments: Record<
  ViewAlignmentAdjustment,
  { icon: typeof AlignHorizontalCenterOutlined; label: string }
> = {
  center: {
    icon: AlignHorizontalCenterOutlined,
    label: "Align to Center",
  },
  start: {
    icon: AlignHorizontalLeftOutlined,
    label: "Align to Left",
  },
} as const;
