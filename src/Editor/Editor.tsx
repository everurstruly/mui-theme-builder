import EditorCanvas from "./Canvas/Canvas";
import EditorActivityBar from "./Activities/ActivityBar";
import EditorPropertiesPanel from "./Properties/PropertiesPanel";
import EditorExplorerPanel from "./Explorer/ExplorerPanel";
import EditorLibrary from "./Explorer/Library/EditorLibrary";
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
            // "--editor-tools-unit-bgColor": "rgba(60, 60, 67, 0.01)",
          },

          [theme.breakpoints.up("sm")]: {
            ":root": {
              "--explorer-panel-width": "300px",
              "--properties-panel-width": "360px",
            },
          },

          [theme.breakpoints.up("lg")]: {
            ":root": {
              "--activity-bar-height": "56px",
              "--explorer-panel-width": "20vw",
              "--properties-panel-width": "24vw",
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
        <EditorLibrary />
        <Paper component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <EditorActivityBar />
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

