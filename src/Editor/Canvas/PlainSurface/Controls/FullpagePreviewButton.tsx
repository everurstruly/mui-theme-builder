import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import useEditorStore from "../../../useEditor";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

export default function FullpagePreviewButton() {
  const [isFullpage, setIsFullpage] = useState(false);
  const handleFullpage = useEditorStore((s) => s.hideCanvasSidebarPanels);
  const exitFullpage = useEditorStore((s) => s.restoreCanvasSidebarPanels);

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
