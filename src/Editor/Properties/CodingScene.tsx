import { Box } from "@mui/material";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { CodeEditor, ThemePreview } from "./CodeEditor";

export default function SystemPropertiesPanelBody() {
  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={80} minSize={30}>
        <CodeEditor />
      </Panel>
      <CodingScenePanelWindowsResizeHandle />
      <Panel minSize={18}>
        <ThemePreview />
      </Panel>
    </PanelGroup>
  );
}

function CodingScenePanelWindowsResizeHandle() {
  return (
    <Box
      role="separator"
      component={PanelResizeHandle}
      aria-orientation="horizontal"
      sx={{
        height: 12,
        cursor: "row-resize",
        bgcolor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "primary.main",
        userSelect: "none",
        "&:hover": { bgcolor: "primary.dark" },
      }}
    >
      <Box
        role="visual grip"
        sx={{
          width: 52,
          height: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      />
    </Box>
  );
}
