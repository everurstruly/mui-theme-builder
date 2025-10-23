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
import React from "react";

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
  const alignedPosition = useZoomPanStore((state) => state.alignment);
  const alignTo = useZoomPanStore((state) => state.alignTo);

  const handleZoomIn = () => zoomIn();
  const handleZoomOut = () => zoomOut();
  const handleToggle = () => cycleZoomPreset();

  const getNextAlignmentPosition = () => {
    const positions = Object.keys(viewAlignments);
    const currentIndex = positions.indexOf(alignedPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    const nextPosition = positions[nextIndex] as ViewAlignmentAdjustment;

    return {
      position: nextPosition,
      icon: viewAlignments[nextPosition].icon,
      label: viewAlignments[nextPosition].label,
      onClick: () => alignTo(nextPosition),
    };
  };

  const alignmentButton = getNextAlignmentPosition();

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
      <Tooltip title={alignmentButton.label} arrow>
        <IconButton
          size="medium"
          onClick={alignmentButton.onClick}
          sx={{
            alignSelf: "stretch",
            borderRadius: 1,
            border: 1,
            borderColor: "rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(40px)",
          }}
        >
          {React.createElement(viewAlignments[alignmentButton.position].icon, {
            fontSize: "small",
          })}
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
          onClick={handleZoomOut}
          sx={{
            borderColor: "rgba(0,0,0,0.1)",
            paddingInline: 1,
          }}
        >
          <RemoveIcon />
        </Button>

        <Button
          onClick={handleToggle}
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
          onClick={handleZoomIn}
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
