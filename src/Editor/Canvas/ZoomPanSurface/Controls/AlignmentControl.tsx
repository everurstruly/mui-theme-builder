import { IconButton, Tooltip } from "@mui/material";
import { useCallback, useMemo } from "react";
import useCanvasZoomPanSurfaceStore, {
  type ViewAlignmentAdjustment,
} from "../zoomPanSurfaceStore";
import {
  AlignHorizontalCenterOutlined,
  AlignHorizontalLeftOutlined,
} from "@mui/icons-material";

export default function AlignmentControl() {
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
    label: "Align to Top Left",
  },
} as const;
