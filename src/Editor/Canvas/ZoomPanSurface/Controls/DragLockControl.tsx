import { IconButton, Tooltip } from "@mui/material";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import useCanvasZoomPanSurfaceStore from "../zoomPanSurfaceStore";

export default function DragLockControl() {
  const locked = useCanvasZoomPanSurfaceStore((state) => state.dragLock);
  const onToggle = useCanvasZoomPanSurfaceStore(
    (state) => state.toggleDragLock
  );

  const label = locked
    ? "Start Interacting (Disables Dragging)"
    : "Stop Interacting (Enables Dragging)";
  const Icon = locked ? LockOpenOutlined : LockOutlined;

  return (
    <Tooltip title={label} arrow>
      <IconButton
        size="small"
        onClick={onToggle}
        aria-label={label}
        color="primary"
        sx={{
          borderRadius: 1,
          border: 1,
          borderColor: "rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
