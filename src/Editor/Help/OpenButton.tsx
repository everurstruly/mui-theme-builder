import { IconButton, Tooltip } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { useHelpDialog } from "./useHelpDialog";

export default function OpenButton() {
  const open = useHelpDialog((s) => s.open);

  return (
    <Tooltip title="Help (Press ?)">
      <IconButton
        onClick={() => open()}
        aria-label="open help"
        size="small"
        sx={{
          transition: "all 0.2s",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <HelpOutline />
      </IconButton>
    </Tooltip>
  );
}
