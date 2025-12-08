import BeforeCodesourceDiffView from "../CodeEditor/BeforeCodesourceDiffView";
import { useMemo } from "react";
import { Box } from "@mui/material";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { CodeEditor } from "../CodeEditor";

export default function DeveloperPropertiesPanel() {
  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={80} minSize={30}>
        <CodeEditor />
      </Panel>
      <DeveloperPanelWindowsResizeHandle />
      <Panel minSize={14}>
        <BeforeCodesourceDiffView />
      </Panel>
    </PanelGroup>
  );
}

const handleOuterSx = {
  height: 12,
  cursor: "row-resize",
  bgcolor: "divider",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "primary.main",
  userSelect: "none",
};

const handleInnerSx = {
  width: 52,
  height: 2,
  borderRadius: 2,
  bgcolor: "background.paper",
};

const DeveloperPanelWindowsResizeHandle =
  function DeveloperPanelWindowsResizeHandle() {
    // memoize sx to avoid recreating objects on every render
    const outer = useMemo(() => handleOuterSx, []);
    const inner = useMemo(() => handleInnerSx, []);

    return (
      <Box
        role="separator"
        component={PanelResizeHandle}
        aria-orientation="horizontal"
        sx={{
          ...outer,
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <Box role="visual grip" sx={inner} />
      </Box>
    );
  };
