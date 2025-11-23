import Drawer from "@mui/material/Drawer";
import useEditorUiStore from "../editorStore";
import PropertiesPanelBody from "./PropertiesPanelBody";
import { TuneOutlined } from "@mui/icons-material";
import { Divider, Fab, Stack } from "@mui/material";
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
  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const isVisible = !hiddenPanels.includes("properties");

  const withHidePanel = useEditorUiStore((state) => state.hidePanel);
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
      {/* <Divider /> */}
      <PropertiesPanelBody />
    </Drawer>
  );
}

function MobilePanelDrawer() {
  const display = { lg: "none" };

  const withHidePanel = useEditorUiStore((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("properties.mobile");

  const withShowPanel = useEditorUiStore((state) => state.showPanel);
  const showPanel = () => withShowPanel("properties.mobile");

  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const isVisible = !hiddenPanels.includes("properties.mobile");

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
            width: "min(380px, 85vw)",
            border: "none",
          },
        })}
      >
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
          px={1.5}
          my={2}
        >
          <PropertiesPanelHeader />
        </Stack>

        <Divider />
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
