import Drawer from "@mui/material/Drawer";
import useEditorStore from "../editorStore";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";
import type { CSSObject, Theme } from "@mui/material/styles";
import ObjectsPanelTree from "./CanvasObjectsTree";

export default function EditorPreviewsPanel() {
  const theme = useTheme();
  const isUpSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const withHidePanel = useEditorStore((state) => state.hidePanel);

  const isVisible = useEditorStore((state) => {
    return !state.hiddenPanels.includes("activities");
  });

  const hidePanel = () => withHidePanel("activities");

  return (
    <Drawer
      component="nav"
      open={isVisible}
      onClose={() => hidePanel()}
      anchor={isUpSmallScreen ? "left" : "bottom"}
      variant={isUpSmallScreen ? "permanent" : "temporary"}
      sx={() => ({
        flexShrink: 0,
        borderLeft: 1,
        borderColor: "divider",

        WebkitOverflowScrolling: "touch",
        backgroundColor: "transparent",

        // hide scrollbar but keep scrolling
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {}, // WebKit
      })}
      slotProps={{
        paper: {
          sx: (theme) => ({
            ...(isVisible ? openedMixin(theme) : closedMixin()),

            [theme.breakpoints.up("sm")]: {
              position: "static",
              height: "100%",
            },

            // hide native scrollbars but preserve scrolling
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
              width: 0,
              height: 0,
            },
          }),
        },
      }}
    >
      <Box sx={{ height: 46, padding: 2 }}>
        <Typography variant="body1" component="h2">
          Previews
        </Typography>
      </Box>
      <ObjectsPanelTree />
    </Drawer>
  );
}

const openedMixin = (theme: Theme): CSSObject => ({
  ...theme.mixins.toolbar,
  height: "75dvh",
  overflowX: "hidden",
  width: "var(--previews-panel-width)",
});

const closedMixin = (): CSSObject => ({
  display: "none",
});
