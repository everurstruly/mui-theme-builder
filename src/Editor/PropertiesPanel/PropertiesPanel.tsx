import Drawer from "@mui/material/Drawer";
import useEditorUiStore from "../editorUiStore";
import PropertiesPanelBody from "./PropertiesPanelBody";
import { TuneOutlined } from "@mui/icons-material";
import { Divider, Fab } from "@mui/material";

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

        "& .MuiDrawer-paper": {
          position: "relative",
          height: "100%",
          width: "var(--properties-panel-width)",
          border: "none",
          overflow: "hidden",

          // onload animation — use a static animation name (defined in global.css)
          // Avoid dynamically generating keyframes on every render which forces
          // the CSS-in-JS engine to inject new rules and can cause reflow/lag.
          animation: `PanelFade 240ms ease`,
          willChange: "opacity, transform",
        },
      })}
    >
      <Divider />
      <PropertiesPanelBody />
    </Drawer>
  );
}

export default function EditorPropertiesPanel() {
  return (
    <>
      <MobilePanelDrawer />
      <DesktopPanelDrawer />
    </>
  );
}
