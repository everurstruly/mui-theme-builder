import Drawer from "@mui/material/Drawer";
import useEditorUiStore from "../editorUiStore";
import PropertiesPanelBody from "./PropertiesPanelBody";
import { TuneOutlined } from "@mui/icons-material";
import { Divider, Fab } from "@mui/material";

export default function EditorPropertiesPanel() {
  return (
    <>
      <MobilePanelDrawer />
      <DesktopPanelDrawer />
    </>
  );
}

function DesktopPanelDrawer() {
  const withHidePanel = useEditorUiStore((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("properties");

  const isVisible = useEditorUiStore((state) => {
    return !state.hiddenPanels.includes("properties");
  });

  return (
    <Drawer
      component="aside"
      anchor={"right"}
      variant={"permanent"}
      open={isVisible}
      onClose={() => hidePanel()}
      sx={() => ({
        flexShrink: 0,
        display: { xs: "none", lg: "block" },

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
            backgroundColor: "var(--editor-tools-unit-bgColor, revert)",
            position: "static", // IMPORTANT: ensures responsiveness via dom structure
            height: "100%",
            border: "none",
            overflow: "hidden",

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
  const display = { sm: "none" };

  const withHidePanel = useEditorUiStore((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("properties.mobile");

  const withShowPanel = useEditorUiStore((state) => state.showPanel);
  const showPanel = () => withShowPanel("properties.mobile");

  const isVisible = useEditorUiStore((state) => {
    return !state.hiddenPanels.includes("properties.mobile");
  });

  return (
    <>
      <Drawer
        component="aside"
        variant="temporary"
        anchor={"right"}
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
            width: "min(380px, 70vw)",
            border: "none",
          },
        })}
      >
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
          right: (theme) => theme.spacing(2), // match right padding of page content
          bottom: (theme) => theme.spacing(7), // above bottom nav (or canvas bottom actions)
        })}
      >
        <TuneOutlined />
      </Fab>
    </>
  );
}
