import { Box, Button, ButtonGroup, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useZoomPanStore, {
  type ViewAlignmentAdjustment,
} from "./zoomPanSurfaceStore";
import {
  AlignHorizontalCenterOutlined,
  AlignHorizontalLeftOutlined,
} from "@mui/icons-material";
import { useMemo, useCallback } from "react";

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

export default function CanvasZoomPanSurfaceControls() {
  const zoom = useZoomPanStore((state) => state.zoom);
  const zoomIn = useZoomPanStore((state) => state.zoomIn);
  const zoomOut = useZoomPanStore((state) => state.zoomOut);
  const cycleZoomPreset = useZoomPanStore((state) => state.cycleZoomPreset);
  const alignment = useZoomPanStore((state) => state.alignment);
  const alignTo = useZoomPanStore((state) => state.alignTo);
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
    <Box
      sx={(theme) => ({
        position: "absolute",
        right: "calc(var(--canvas-brim-padding, 0px) + .5rem)",
        bottom: "calc(var(--canvas-brim-padding, 0px) + .25rem)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        columnGap: 0.5,

        [theme.breakpoints.up("md")]: {
          bottom: "calc(var(--canvas-brim-padding-md, 0px) + .5rem)",
        },
      })}
    >
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
    </Box>
  );
}
