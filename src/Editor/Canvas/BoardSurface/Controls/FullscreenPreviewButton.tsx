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
  mouseOverPreview = false,
  float,
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
    <Tooltip
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      placement="auto-start"
    >
      <IconButton
        onClick={handleFullscreen}
        size="small"
        sx={[
          {
            opacity: mouseOverPreview ? 1 : 0.2,
            transition: "opacity 300ms ease",
            border: 1,
            borderRadius: 1,
            fontSize: "0.75rem",
            textTransform: "none",
            borderColor: "divider",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          },
          () => {
            return !float
              ? {
                  //   borderBottomLeftRadius: 0,
                  //   borderBottomRightRadius: 0,
                }
              : {
                  zIndex: 10,
                  position: "absolute",
                  top: "0",
                  right: "0",
                };
          },
        ]}
        // startIcon={
        //   isFullscreen ? (
        //     <FullscreenExitIcon fontSize="small" />
        //   ) : (
        //     <FullscreenIcon fontSize="small" />
        //   )
        // }
      >
        {isFullscreen ? (
          <FullscreenExitIcon sx={{ fontSize: 16 }} />
        ) : (
          <FullscreenIcon sx={{ fontSize: 16 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

