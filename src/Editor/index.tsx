import EditorHeader from "./Header";
import EditorCanvas from "./Canvas";
import EditorToolBar from "./ToolBar";
import EditorPropertiesPanel from "./PropertiesPanel";
import EditorActivitiesPanel from "./ActivitiesPanel";
import { Box, Stack } from "@mui/material";

export default function Editor() {
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
          xs: "46px",
          sm: "50px",
        },

        "--canvas-brim-padding": {
          xs: "0px",
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
          md: "calc(100vw - (var(--canvas-brim-padding) * 2) - var(--previews-panel-width) - var(--properties-panel-width))",
        },
      }}
    >
      <EditorHeader />
      <Stack
        direction="row"
        flexGrow={1}
        minWidth={0}
        height={`calc(100dvh - var(--header-height) - 1px)`} // FIXME: 1px is a magic number that prevents overflow due to scrollbar/border I suspect
        overflow={"hidden"}
      >
        <EditorActivitiesPanel />
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
      </Stack>
    </Box>
  );
}
