import React from "react";
import CanvasPropertiesDrawer from "./CanvasPropertiesDrawer";
import CanvasHeader from "./CanvasHeader";
import { Box, Stack } from "@mui/material";

type CanvasProps = {
  renderActivityPanel: () => React.ReactNode;
  renderToolbar: () => React.ReactNode;
  renderBoard: () => React.ReactNode;
  renderProperties: () => React.ReactNode;
};

export default function Canvas({
  renderActivityPanel,
  renderToolbar,
  renderBoard,
  renderProperties,
}: CanvasProps) {
  return (
    <>
      <CanvasHeader />

      <Stack flexGrow={1} direction="row">
        {renderActivityPanel()}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: "relative",
            display: "flex",
            alignItems: "stretch",
            backgroundColor: "background.paper",
          }}
        >
          <Stack flexGrow={1}>
            {renderToolbar()}
            {renderBoard()}
          </Stack>

          {renderProperties()}
        </Box>
      </Stack>

      <CanvasPropertiesDrawer />
    </>
  );
}
