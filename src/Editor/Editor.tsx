import EditorCanvas from "./Canvas/Canvas";
import EditorToolBar from "./ToolBar/ToolBar";
import EditorPropertiesPanel from "./PropertiesPanel/PropertiesPanel";
import EditorExplorerPanel from "./ExplorerPanel/ExplorerPanel";
import { GlobalStyles, Paper, Stack } from "@mui/material";

export default function Editor() {
  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--header-height": "44px",
            "--toolbar-height": "52px",
            "--explorer-panel-width": "auto",
            "--properties-panel-width": "auto",
            "--canvas-max-width": "auto",
          },

          [theme.breakpoints.up("sm")]: {
            ":root": {
              "--explorer-panel-width": "300px",
              "--properties-panel-width": "360px",
            },
          },

          [theme.breakpoints.up("lg")]: {
            ":root": {
              "--toolbar-height": "56px",
              "--explorer-panel-width": "20vw",
              "--properties-panel-width": "24vw",
            },
          },
        })}
      />

      <Stack
        minWidth={0}
        direction={"row"}
        height={`calc(100dvh - var(--header-height) - 1px)`} // 1px is a magic number that prevents vertical scrollbar from appearing
        overflow={"hidden"}
      >
        <Paper component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <EditorToolBar />
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
