import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import useEditor from "../../../useEditor";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

export default function FullpagePreviewButton() {
  const [isFullpage, setIsFullpage] = useState(false);
  const handleFullpage = useEditor((s) => s.hideCanvasSidebarPanels);
  const exitFullpage = useEditor((s) => s.restoreCanvasSidebarPanels);

  const handleFullScreenToggle = () => {
    if (isFullpage) {
      exitFullpage();
      setIsFullpage(false);
    } else {
      handleFullpage();
      setIsFullpage(true);
    }
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
