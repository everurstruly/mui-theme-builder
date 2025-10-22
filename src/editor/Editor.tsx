import EditorToolBar from "./ToolBar";
import EditorCanvas from "./Canvas";
import EditorPropertiesPanel from "./PropertiesPanel";
import EditorPropertiesDrawerToggle from "./PropertiesPanel/DrawerToggle";
import EditorHeader from "./Header";
import EditorPreviewsPanel from "./PreviewsPanel";
import { Box, Stack } from "@mui/material";
import useResponsivePanelsPlacements from "./useResponsivePanelsPlacements";

export default function Editor() {
  useResponsivePanelsPlacements();

  return (
    <Box
      sx={{
        "--header-height": {
          xs: "48px",
          sm: "44px",
          md: "44px",
          lg: "44px",
        },

        "--toolbar-height": {
          xs: "50px",
        },

        "--canvas-brim-padding": {
          xs: "0px",
          // xs: "6px",
          // sm: "10px",
        },

        "--previews-panel-width": {
          xs: "180px",
          sm: "200px",
          md: "225px",
          lg: "20vw",
        },

        "--properties-panel-width": {
          xs: "auto",
          sm: "360px",
          md: "360px",
          lg: "22vw",
        },

        "--canvas-max-width": {
          md: "calc(100vw - (var(--canvas-brim-padding)*2) - var(--previews-panel-width) - var(--properties-panel-width))",
        },
      }}
    >
      <EditorHeader />

      <Stack
        direction="row"
        flexGrow={1}
        minWidth={0}
        height={`calc(100vh - var(--header-height))`}
        overflow={"hidden"}
      >
        <EditorPreviewsPanel />
        <Stack
          component="main"
          height={"100%"}
          flexGrow={1}
          minWidth={0}
          overflow={"hidden"}
        >
          <EditorToolBar />
          <EditorCanvas />
        </Stack>
        <EditorPropertiesPanel />
        <EditorPropertiesDrawerToggle />
      </Stack>
    </Box>
  );
}
