import CanvasBoardFrames from "./frames";
import ScreenSizeToggleGroup from "./ScreenSizeToggleGroup";
import PropertiesPanelSwitch from "./PropertiesPanelSwitch";
import { Box } from "@mui/material";

// export type CanvasBoardProps = {
// isShowingPropertyPanel: boolean;
// handleShowPropertyPanel: (value: boolean) => void;
// };

export default function CanvasBoard() {
  return (
    <Box sx={{ px: 1.5, py: 1.5, flexGrow: 1, display: "flex" }}>
      <Box
        sx={{
          flexGrow: 1,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          shadow: 1,
          p: 12,
          position: "relative",
        }}
      >
        <CanvasBoardFrames />
        <ScreenSizeToggleGroup />
      </Box>
    </Box>
  );
}
