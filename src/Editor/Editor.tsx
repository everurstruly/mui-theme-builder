import EditorCanvas from "./Canvas/Canvas";
import EditorToolsbar from "./Toolbar/Toolbar";
import EditorPropertiesPanel from "./Properties/PropertiesPanel";
import EditorExplorerPanel from "./Explorer/ExplorerPanel";
import StrategiesDialog from "./Design/Draft/StrategiesDialog";
import ExportDialog from "./Design/Current/Export/ExportDialog";
import CollectionDialog from "./Design/Collection/CollectionDialog";
import SaveBlockerDialog from "./Design/Current/Save/BlockerDialog";
import editorTheme from "./theme";
import RenameDialog from "./Design/Current/Modify/RenameDialog";
import DeleteDialog from "./Design/Current/Modify/DeleteDialog";
import HelpDialog from "./Help/Dialog";
import { GlobalStyles, Paper, Stack } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { VersionHistoryDialog } from "./Design/Versions";
import { isFeatureEnabled } from "../config/featureFlags";

export default function Editor() {
  return (
    <ThemeProvider theme={editorTheme}>
      {isFeatureEnabled("SHOW_VERSION_HISTORY") && <VersionHistoryDialog />}
      <HelpDialog />
      <DeleteDialog />
      <RenameDialog />
      <CollectionDialog />
      <SaveBlockerDialog />
      <StrategiesDialog />
      <ExportDialog />

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
              "--toolbar-height": "48px",
              "--explorer-panel-width": "20dvw",
              "--properties-panel-width": "25dvw",
            },
          },
        })}
      />

      <Stack
        minWidth={0}
        direction={"row"}
        height={`calc(100dvh - var(--header-height))`}
        overflow={"hidden"}
      >
        <Paper
          component="main"
          elevation={0}
          sx={{ flexGrow: 1, minWidth: 0, border: "none", borderRadius: 0 }}
        >
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
    </ThemeProvider>
  );
}
