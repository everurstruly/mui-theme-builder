import EditorCanvas from "./Canvas/Canvas";
import EditorToolsbar from "./Toolbar/Toolbar";
import EditorPropertiesPanel from "./Properties/PropertiesPanel";
import EditorExplorerPanel from "./Explorer/ExplorerPanel";
import { GlobalStyles, Paper, Stack } from "@mui/material";
import LaunchDialogContainer from "./Design/New/LaunchDialog";

export default function Editor() {
  return (
    <>
      <LaunchDialogContainer />
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--header-height": "48px",
            "--toolbar-height": "52px",
            "--explorer-panel-width": "300px",
            "--properties-panel-width": "360px",
            "--canvas-max-width": "auto",
          },

          [theme.breakpoints.up("lg")]: {
            ":root": {
              "--activity-bar-height": "56px",
              "--explorer-panel-width": "20vw",
              "--properties-panel-width": "25vw",
            },
          },
        })}
      />

      <Stack
        minWidth={0}
        direction={"row"}
        height={`calc(100dvh - var(--header-height) - 1px)`} // NB: 1px is a magic number that prevents vertical scrollbar from appearing
        overflow={"hidden"}
      >
        <Paper component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <EditorToolsbar />
          <Stack
            minWidth={0}
            flexGrow={1}
            direction="row"
            height={`calc(100% - var(--toolbar-height))`}
            overflow={"hidden"}
          >
            <EditorExplorerPanel />
            <EditorCanvas />
            <EditorPropertiesPanel />
          </Stack>
        </Paper>
      </Stack>
    </>
  );
}
