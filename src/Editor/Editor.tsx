import EditorHeader from "./Header/Header";
import EditorCanvas from "./Canvas/Canvas";
import EditorToolBar from "./ToolBar/ToolBar";
import EditorPropertiesPanel from "./PropertiesPanel/PropertiesPanel";
import EditorActivitiesPanel from "./ActivitiesPanel/ActivitiesPanel";
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

        "--activities-panel-width": {
          xs: "auto",
          sm: "300px",
          lg: "20vw",
        },

        "--properties-panel-width": {
          xs: "auto",
          sm: "360px",
          lg: "24vw",
        },

        "--canvas-max-width": {
          md: "calc(100vw - var(--activities-panel-width) - var(--properties-panel-width))",
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
