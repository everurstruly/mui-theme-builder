import Drawer from "@mui/material/Drawer";
import useEditorStore from "../useEditor";
import ExplorerPanelHeader from "./ExplorerPanelHeader";
import ExplorerPanelBody from "./ExplorerPanelBody";
import useEdit from "../Design/Edit/useEdit";

export default function EditorExplorerPanel() {
  return (
    <>
      <MobileActivitiesDrawer />
      <DesktopActivitiesDrawer />
    </>
  );
}

function DesktopActivitiesDrawer() {
  const hiddenPanels = useEditorStore((state) => state.hiddenPanels);
  const isVisible = !hiddenPanels.includes("explorer");

  const withHidePanel = useEditorStore((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("explorer");

  return (
    <Drawer
      component="nav"
      variant={"permanent"}
      open={isVisible}
      onClose={() => hidePanel()}
      sx={() => ({
        flexShrink: 0,
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
            width: "var(--explorer-panel-width)",
            // backgroundColor: "var(--editor-tools-unit-bgColor, revert)",
            position: "static", // IMPORTANT: ensures responsiveness via dom structure
            height: "100%",
            border: "none",
            overflowX: "hidden",

            // hide native scrollbars but preserve scrolling
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
              width: 0,
              height: 0,
            },

            animation: `PanelFade 240ms ease`,
            willChange: "opacity, transform",
          }),
        },
      }}
    >
      <ExplorerPanelBody />
    </Drawer>
  );
}

function MobileActivitiesDrawer() {
  const display = { xs: "block", sm: "none" };
  const hiddenPanels = useEditorStore((state) => state.hiddenPanels);
  const isVisible = !hiddenPanels.includes("explorer.mobile");
  const selectedTabId = useEdit(
    (state) => state.selectedExperienceId
  );

  const withHidePanel = useEditorStore((state) => state.hidePanel);
  const hidePanel = () => withHidePanel("explorer.mobile");

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
