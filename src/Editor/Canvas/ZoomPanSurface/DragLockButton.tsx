import { IconButton, Tooltip } from "@mui/material";
import { PanTool, AdsClickOutlined } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material/styles";

type DragLockButtonProps = {
  locked: boolean;
  onToggle: () => void;
  sx?: SxProps<Theme>;
};

export default function DragLockButton({
  locked,
  onToggle,
  sx,
}: DragLockButtonProps) {
  const label = locked ? "Interact with content" : "Pan mode (drag to pan)";

  const Icon = locked ? AdsClickOutlined : PanTool;

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
          ...sx,
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
