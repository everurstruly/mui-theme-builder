import Drawer from "@mui/material/Drawer";
import useEditorUiStore from "../editorUiStore";
import ExplorerPanelHeader from "./ExplorerPanelHeader";
import ExplorerPanelBody from "./ExplorerPanelBody";
import { useEditorExperienceStore } from "../useEditorExperienceStore";

function MobileActivitiesDrawer() {
  const withHidePanel = useEditorUiStore((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("explorer.mobile");

  const selectedTabId = useEditorExperienceStore(
    (state) => state.selectedExperienceId
  );

  const isVisible = useEditorUiStore((state) => {
    return !state.hiddenPanels.includes("explorer.mobile");
  });

  const display = { xs: "block", sm: "none" };

  return (
    <Drawer
      component="nav"
      open={isVisible}
      onClose={() => hidePanel()}
      anchor={"bottom"}
      variant={"temporary"}
      sx={() => ({
        display,
        flexShrink: 0,
        overflow: "hidden",
        WebkitOverflowScrolling: "touch",

        // hide scrollbar but keep scrolling
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {},
      })}
      slotProps={{
        paper: {
          sx: () => ({
            border: "none",
            width: "var(--explorer-panel-width)",
            overflowX: "hidden",
            height: { xs: "75dvh", sm: "100%" },

            // hide native scrollbars but preserve scrolling
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
              width: 0,
              height: 0,
            },

            // onload fade-in animation
            animation: `${selectedTabId}Fade 240ms ease`,
            willChange: "opacity, transform",
            [`@keyframes ${selectedTabId}Fade`]: {
              "0%": {
                opacity: 0,
                transform: "translateY(6px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }),
        },
      }}
    >
      <ExplorerPanelHeader />
      <ExplorerPanelBody />
    </Drawer>
  );
}

function DesktopActivitiesDrawer() {
  const withHidePanel = useEditorUiStore((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("explorer");

  const isVisible = useEditorUiStore((state) => {
    return !state.hiddenPanels.includes("explorer");
  });

  return (
    <Drawer
      component="nav"
      variant={"permanent"}
      open={isVisible}
      onClose={() => hidePanel()}
      sx={() => ({
        flexShrink: 0,
        overflow: "hidden",
        WebkitOverflowScrolling: "touch",

        display: { xs: "none", lg: isVisible ? "block" : "none" },

        // hide scrollbar but keep scrolling
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {},
      })}
      slotProps={{
        paper: {
          sx: () => ({
            border: "none",
            width: "var(--explorer-panel-width)",
            overflowX: "hidden",

            position: "static", // unless floated

            // hide native scrollbars but preserve scrolling
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
              width: 0,
              height: 0,
            },

            // onload fade-in animation
            animation: `PanelFade 240ms ease`,
            willChange: "opacity, transform",
            [`@keyframes PanelFade`]: {
              "0%": {
                opacity: 0,
                transform: "translateY(6px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }),
        },
      }}
    >
      {/* <ExplorerPanelHeader /> */}
      <ExplorerPanelBody />
    </Drawer>
  );
}

export default function EditorExplorerPanel() {
  return (
    <>
      <MobileActivitiesDrawer />
      <DesktopActivitiesDrawer />
    </>
  );
}
