import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
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
  const resetView = useZoomPanStore((state) => state.resetView);
  const alignedPosition = useZoomPanStore((state) => state.alignment);
  const alignTo = useZoomPanStore((state) => state.alignTo);

  const handleZoomIn = () => zoomIn();
  const handleZoomOut = () => zoomOut();
  const handleToggle = () => cycleZoomPreset();
  const handleReset = () => resetView();

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
        columnGap: 0.5,
        overflow: "hidden",
        height: 36,

        [theme.breakpoints.up("md")]: {
          bottom: "calc(var(--canvas-brim-padding-md, 0px) + .5rem)",
        },
      })}
    >
      <Tooltip title={alignmentButton.label} arrow>
        <IconButton
          sx={{
            fontSize: 20,
            borderRadius: 1,
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
          size="small"
          onClick={alignmentButton.onClick}
        >
          {React.createElement(viewAlignments[alignmentButton.position].icon, {
            fontSize: "small",
          })}
        </IconButton>
      </Tooltip>

      <IconButton
        sx={{
          fontSize: 20,
          borderRadius: 1,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
        size="small"
        onClick={handleZoomOut}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      {/* Zoom Level Toggle */}
      <Button
        onClick={handleToggle}
        variant="text"
        disableRipple
        size="small"
        aria-label={`Zoom level ${zoom} percent`}
        sx={{
          paddingInline: 2,
          minWidth: "fit-content",
          fontWeight: 500,
          textAlign: "center",
          color: "text.primary",
          textTransform: "none",
          fontSize: "0.75rem !important",
          lineHeight: 1.75,
          borderRadius: 1,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
          },
        }}
      >
        {zoom}%
      </Button>

      {/* Zoom In */}
      <IconButton
        sx={{
          fontSize: 20,
          borderRadius: 1,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
        size="small"
        onClick={handleZoomIn}
      >
        <AddIcon fontSize="small" />
      </IconButton>

      <Tooltip title="Reset View" arrow>
        <IconButton
          sx={{
            fontSize: 20,
            borderRadius: 1,
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
          size="small"
          onClick={handleReset}
        >
          <RestartAltIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
