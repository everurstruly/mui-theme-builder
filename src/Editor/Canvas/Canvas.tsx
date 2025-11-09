import useEditorUiStore from "../editorUiStore";
import BoardSurface from "./BoardSurface/BoardSurface";
import { Box } from "@mui/material";

export default function EditorCanvas() {
  const setMouseOverCanvas = useEditorUiStore((state) => state.setMouseOverCanvas);

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
      <BoardSurface />
    </Box>
  );
}
