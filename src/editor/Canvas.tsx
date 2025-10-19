import layoutStyles from "./layout-styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { Box } from "@mui/material";

type CanvasProps = {
  sx: SxProps<Theme>;
  renderActivityPanel: () => React.ReactNode;
  renderToolbar: () => React.ReactNode;
  renderBoard: () => React.ReactNode;
  renderProperties: () => React.ReactNode;
};

export default function Canvas({
  sx,
  renderActivityPanel,
  renderToolbar,
  renderBoard,
  renderProperties,
}: CanvasProps) {
  return (
    <Box
      sx={{
        height: layoutStyles.canvas.height,
        display: "flex",
        flexGrow: 1,
        overflowY: "hidden",
      }}
    >
      {renderActivityPanel()}

      <Box
        component="main"
        sx={{
          ...sx,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", flexGrow: 1, position: "relative" }}>
          <Box
            sx={{
              ...layoutStyles.render,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderToolbar()}
            {renderBoard()}
          </Box>

          {renderProperties()}
        </Box>
      </Box>
    </Box>
  );
}
