import Drawer from "@mui/material/Drawer";
import useEditorStore from "../editorStore";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";
import type { CSSObject, Theme } from "@mui/material/styles";
import SampleCanvasObjectsTree from "./SampleCanvasObjectsTree";

export default function EditorActivitiesPanel() {
  const theme = useTheme();
  const isUpSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isUpLaptopScreen = useMediaQuery(theme.breakpoints.up("lg"));
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
      variant={isUpLaptopScreen ? "permanent" : "temporary"}
      disablePortal
      sx={() => ({
        flexShrink: 0,
        overflow: "hidden",
        WebkitOverflowScrolling: "touch",
        backgroundColor: "transparent",

        [theme.breakpoints.up("md")]: {
          display: isVisible ? "block" : "none",
        },

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
      <Activity title="Samples">
        <SampleCanvasObjectsTree />
      </Activity>
    </Drawer>
  );
}

const openedMixin = (theme: Theme): CSSObject => ({
  ...theme.mixins.toolbar,
  height: "75dvh",
  overflowX: "hidden",
  width: "var(--activities-panel-width)",
});

const closedMixin = (): CSSObject => ({
  display: "none",
});

type ActivityProps = {
  title: string;
  children?: React.ReactNode;
};

function Activity({ title, children }: ActivityProps) {
  return (
    <>
      <Box sx={{ height: 46, padding: 2 }}>
        <Typography variant="body2" component="h2">
          {title}
        </Typography>
      </Box>
      {children}
    </>
  );
}
