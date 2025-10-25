import { IconButton, Tooltip } from "@mui/material";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import useCanvasZoomPanSurfaceStore from "../zoomPanSurfaceStore";

export default function DragLockControl() {
  const locked = useCanvasZoomPanSurfaceStore((state) => state.dragLock);
  const onToggle = useCanvasZoomPanSurfaceStore(
    (state) => state.toggleDragLock
  );

  const label = locked ? "Interact with content (Stop Dragging)" : "Lock Content (Drag Canvas)";
  const Icon = locked ? LockOutlined : LockOpenOutlined;

  return (
    <Tooltip title={label} arrow>
      <IconButton
        size="medium"
        onClick={onToggle}
        aria-label={label}
        sx={{
          alignSelf: "stretch",
          borderRadius: 1,
          border: 1,
          borderColor: "rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(40px)",
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
