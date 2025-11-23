import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

export type FullscreenPreviewButtonProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  mouseOverPreview?: boolean;
  float?: boolean;
};

export default function FullscreenPreviewButton({
  containerRef,
}: FullscreenPreviewButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("[FullscreenPreviewButton] Error toggling fullscreen:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [containerRef]);

  return (
    <Tooltip title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
      <IconButton
        onClick={handleFullscreen}
        sx={[
          {
            transition: "opacity 300ms ease",
            textTransform: "none",
          },
        ]}
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  );
}
