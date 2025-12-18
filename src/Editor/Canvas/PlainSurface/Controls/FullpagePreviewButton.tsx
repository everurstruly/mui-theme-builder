import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import useEditor from "../../../useEditor";
import { IconButton, Tooltip } from "@mui/material";

export default function FullpagePreviewButton() {
  const isFullpage = useEditor((s) => s.isFullpage);
  const toggleFullpage = useEditor((s) => s.toggleFullpage);

  const handleFullScreenToggle = () => {
    toggleFullpage();
  };

  return (
    <Tooltip title={isFullpage ? "Exit fullscreen" : "Enter fullscreen"}>
      <IconButton
        onClick={handleFullScreenToggle}
        sx={[
          {
            transition: "opacity 300ms ease",
            textTransform: "none",
          },
        ]}
      >
        {isFullpage ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  );
}
