import { IconButton, Tooltip } from "@mui/material";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import useCanvasViewStore from "../../canvasViewStore";

export default function DragLockControl() {
  const locked = useCanvasViewStore((s) => s.camera.dragLock);
  const toggleDragLock = useCanvasViewStore((s) => s.toggleDragLock);

  const label = locked
    ? "Start Interacting (Disables Dragging)"
    : "Stop Interacting (Enables Dragging)";
  const Icon = locked ? LockOutlined : LockOpenOutlined;

  return (
    <Tooltip title={label} arrow>
      <IconButton
        size="small"
        onClick={toggleDragLock}
        aria-label={label}
        sx={{
          borderRadius: 1,
          border: 1,
          borderColor: "rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Icon fontSize="small" color={locked ? "action" : "secondary"} />
      </IconButton>
    </Tooltip>
  );
}

