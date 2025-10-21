import CanvasBoardFrames from "./frames";
import ScreenSizeToggleGroup from "./ScreenSizeToggleGroup";
import { Box } from "@mui/material";
import { canvasHeightCss } from "../Editor.constants";

export default function EditorCanvas() {
  return (
    <Box
      sx={{
        px: 1.5,
        pb: 1.5,
        display: "flex",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          position: "relative",
          paddingBottom: 10,
          maxWidth: "calc(100vw - 48px)",
          flexGrow: 1,
          backgroundColor: "transparent",
          marginInline: "auto",
          height: canvasHeightCss,
          overflow: "auto",
        }}
      >
        <CanvasBoardFrames />
      </Box>

      <ScreenSizeToggleGroup />
    </Box>
  );
}
