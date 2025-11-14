import QuickPreviewBar from "../ActivityBar/QuickPreviewBar";
import useEditorUiStore from "../editorUiStore";
import BoardSurface from "./BoardSurface/BoardSurface";
import CanvasControlsSlots from "./CanvasControlsSlots";
import FullscreenPreviewButton from "./BoardSurface/Controls/FullscreenPreviewButton";
import { alpha, Box, Stack } from "@mui/material";
import { useRef } from "react";
import ExplorerPanelVisibilityToggle from "../ActivityBar/ExplorerPanelVisibilityToggle";

export default function EditorCanvas() {
  const setMouseOverCanvas = useEditorUiStore((state) => state.setMouseOverCanvas);
  const previewDivWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      sx={(t) => ({
        position: "relative", // acts as the board/wrapper for surfaces
        flexGrow: 1,
        minWidth: 0, // <-- ensure this flex child can shrink
        overflow: "hidden", // <-- contain expansion, create clip/scroll context
        height: "100%",
        maxWidth: "var(--canvas-max-width)",
        border: "1px solid",
        borderColor: t.palette.divider,
        // borderRightColor: mouseOverPropertiesPanel ? "text.secondary" : "divider",
        // backgroundColor: "#f5f5f5",
        // backgroundColor: mouseOverPropertiesPanel ? "#eee" : "#f5f5f5",
        backgroundImage: `
            radial-gradient(circle at center, ${
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)"
            } 1px, transparent 1px)
          `,
        backgroundSize: "12px 12px",
        backgroundPosition: "0 0",
        transition: "border-color 500ms ease",
      })}
      onMouseEnter={() => setMouseOverCanvas(true)}
      onMouseLeave={() => setMouseOverCanvas(false)}
    >
      <QuickPreviewBar />
      <BoardSurface containerRef={previewDivWrapperRef} />
      <CanvasControlsSlots
        bottomRight={
          <Stack
            direction="row"
            sx={{
              columnGap: 1,
              borderRadius: 3,
              minWidth: 0,
              backdropFilter: "blur(40px)",
              boxShadow: 1,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 1),
            }}
          >
            <ExplorerPanelVisibilityToggle />
            <FullscreenPreviewButton containerRef={previewDivWrapperRef} />
          </Stack>
        }
      />
    </Box>
  );
}
