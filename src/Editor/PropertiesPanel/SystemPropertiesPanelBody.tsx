import { Box, Typography } from "@mui/material";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export default function SystemPropertiesPanelBody() {
  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={40}>{/* <ThemeCodeEditor /> */}</Panel>
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
      <Panel>
        <Typography padding={2}>Components</Typography>
        {/* <PlaceholderTree /> */}
      </Panel>
    </PanelGroup>
  );
}
