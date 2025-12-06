import Drawer from "@mui/material/Drawer";
import useEditor from "../useEditor";
import PropertiesPanelBody from "./PropertiesPanelBody";
import { TuneOutlined } from "@mui/icons-material";
import { Divider, Fab, useMediaQuery } from "@mui/material";
import PropertiesPanelHeader from "./PropertiesPanelHeader";

export default function EditorPropertiesPanel() {
  return (
    <>
      <MobilePanelDrawer />
      <DesktopPanelDrawer />
    </>
  );
}

function DesktopPanelDrawer() {
  const hiddenPanels = useEditor((state) => state.hiddenPanels);
  const isVisible = !hiddenPanels.includes("properties");

  const withHidePanel = useEditor((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("properties");

  return (
    <Drawer
      component="aside"
      anchor={"right"}
      variant={"permanent"}
      open={isVisible}
      onClose={() => hidePanel()}
      sx={() => ({
        flexShrink: 0,
        display: { xs: "none", lg: isVisible ? "block" : "none" },
        borderInlineStart: "1px solid",
        borderColor: "divider",

        // hide scrollbar but keep scrolling
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // WebKit
        },
      })}
      slotProps={{
        paper: {
          sx: {
            width: "var(--properties-panel-width)",
            // backgroundColor: "var(--editor-tools-unit-bgColor, revert)",
            position: "static", // IMPORTANT: ensures responsiveness via dom structure
            height: "100%",
            border: "none",
            // Allow Monaco's suggestion/hover widgets to escape the panel
            // so IntelliSense isn't clipped by the drawer boundaries.
            overflow: "visible",

            animation: `PanelFade 240ms ease`,
            willChange: "opacity, transform",
          },
        },
      }}
    >
      <Divider />
      <PropertiesPanelBody />
    </Drawer>
  );
}

function MobilePanelDrawer() {
  const isBeyondSingleHandHeld = useMediaQuery("(min-width:400px)");
  const display = { lg: "none" };

  const withHidePanel = useEditor((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("properties.mobile");

  const withShowPanel = useEditor((state) => state.showPanel);
  const showPanel = () => withShowPanel("properties.mobile");

  const hiddenPanels = useEditor((state) => state.hiddenPanels);
  const isVisible = !hiddenPanels.includes("properties.mobile");

  return (
    <>
      <Drawer
        component="aside"
        variant="temporary"
        anchor={isBeyondSingleHandHeld ? "right" : "bottom"}
        open={isVisible}
        onClose={() => hidePanel()}
        ModalProps={{
          keepMounted: false, // Better open performance on mobile. #saidByMUI
        }}
        sx={() => ({
          display,

          // hide scrollbar but keep scrolling
          msOverflowStyle: "none", // IE and Edge
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // WebKit
          },

          "& .MuiDrawer-paper": {
            overflow: "hidden",
            width: isBeyondSingleHandHeld ? "min(380px, 82vw)" : undefined,
            height: isBeyondSingleHandHeld ? undefined : "75vh",
            // border: "none",
          },
        })}
      >
        <PropertiesPanelHeader
          sx={{
            px: { xs: 2.5 },
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        />
        <PropertiesPanelBody />
      </Drawer>

      <Fab
        color="primary"
        aria-label="edit"
        onClick={() => showPanel()}
        sx={() => ({
          display,
          zIndex: (theme) => theme.zIndex.drawer - 1,
          position: "fixed",

          // FIXME: match right padding of page content
          right: {
            xs: "8px",
            sm: "20px",
          },

          // above bottom nav (or canvas bottom actions)
          bottom: {
            xs: "calc(var(--toolbar-height) + (var(--toolbar-height) / 4))",
          },
        })}
      >
        <TuneOutlined />
      </Fab>
    </>
  );
}
