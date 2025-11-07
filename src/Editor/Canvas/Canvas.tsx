import BoardSurface from "./BoardSurface/BoardSurface";
import useEditorUiStore from "../editorUiStore";
import { Box } from "@mui/material";
import { useThemeWorkspaceStore } from "../ThemeWorkspace";
import { useThemeWorkspaceCreatedTheme } from "../ThemeWorkspace/useCreatedTheme.hooks";

export default function EditorCanvas() {
  const activePreviewId = useThemeWorkspaceStore((state) => state.activePreviewId);
  const { themeOptions } = useThemeWorkspaceCreatedTheme();

  const setMouseOverCanvas = useEditorUiStore((state) => state.setMouseOverCanvas);
  const mouseOverPropertiesPanel = useEditorUiStore(
    (state) => state.mouseOverPropertiesPanel
  );

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
        outlineOffset: -1,
        outline: "1px solid transparent",
        borderRightColor: mouseOverPropertiesPanel ? "black" : "divider",
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
      <BoardSurface previewId={activePreviewId} themeOptions={themeOptions} />
    </Box>
  );
}
