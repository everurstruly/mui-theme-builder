import { IconButton, Tooltip } from "@mui/material";
import { useCallback, useMemo } from "react";
import useCanvasView from "../../useCanvasView";
import {
  AlignHorizontalCenterOutlined,
  AlignHorizontalLeftOutlined,
} from "@mui/icons-material";

export default function AlignmentControl() {
  const alignment = useCanvasView((s) => s.camera.alignment);
  const setCameraAlignment = useCanvasView((s) => s.setCameraAlignment);

  const nextPosition = useMemo<"center" | "start">(() => {
    const candidates: ("center" | "start")[] = ["center", "start"];
    const pick = candidates.find((c) => c !== alignment) ?? candidates[0];
    return pick;
  }, [alignment]);

  const nextLabel = viewAlignments[nextPosition].label;
  const IconComponent = viewAlignments[nextPosition].icon;

  const handleAlignmentClick = useCallback(
    () => setCameraAlignment(nextPosition),
    [setCameraAlignment, nextPosition]
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
  "center" | "start",
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

