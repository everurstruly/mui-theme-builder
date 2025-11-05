import { Box } from "@mui/material";
import useWorkfileHydratedTheme from "../Workfile/useWorkfileHydratedTheme";
import useWorkfileStore from "../Workfile/useWorkfileStore";
import ZoomPanSurface from "./ZoomPanSurface/ZoomPanSurface";

export default function EditorCanvas() {
  const { activePreviewId } = useWorkfileStore();
  const theme = useWorkfileHydratedTheme();

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
        backgroundColor: "beige",
        backgroundImage: `
            radial-gradient(circle at center, ${
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)"
            } 1px, transparent 1px)
          `,
        backgroundSize: "12px 12px",
        backgroundPosition: "0 0",
      })}
    >
      <ZoomPanSurface previewId={activePreviewId} theme={theme} />
    </Box>
  );
}
