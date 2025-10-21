import layoutStyles from "../layout-styles";
import CanvasBoardFrames from "./frames";
import ScreenSizeToggleGroup from "./ScreenSizeToggleGroup";
// import PropertiesPanelSwitch from "./PropertiesPanelSwitch";
import { Box } from "@mui/material";

// export type CanvasBoardProps = {
// isShowingPropertyPanel: boolean;
// handleShowPropertyPanel: (value: boolean) => void;
// };

export default function CanvasBoard() {
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
          maxWidth: "calc(100vw - 48px)",
          ...layoutStyles.board,
        }}
      >
        <CanvasBoardFrames />
      </Box>

      <ScreenSizeToggleGroup />
    </Box>
  );
}
