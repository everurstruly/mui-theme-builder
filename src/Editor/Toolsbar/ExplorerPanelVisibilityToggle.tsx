import useEditorUiStore from "../useEditor";
import { IconButton } from "@mui/material";
import { ExpandOutlined, ViewSidebarOutlined } from "@mui/icons-material";

function ExplorerPanelVisibilityToggle() {
  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const hidePanel = useEditorUiStore((state) => state.hidePanel);
  const showPanel = useEditorUiStore((state) => state.showPanel);

  const isExplorerPanelHidden = () => hiddenPanels.includes("explorer");

  function floatExplorerPanel() {
    hidePanel("explorer");
  }

  function pinExplorerPanel() {
    showPanel("explorer");
  }

  function handleToggleClick() {
    if (isExplorerPanelHidden()) {
      pinExplorerPanel();
    } else {
      floatExplorerPanel();
    }
  }

  return (
    <IconButton
      onClick={handleToggleClick}
      sx={{ backgroundColor: "transparent", fontSize: 20 }}
    >
      {isExplorerPanelHidden() ? (
        <ViewSidebarOutlined />
      ) : (
        <ExpandOutlined sx={{ rotate: "90deg" }} />
      )}
    </IconButton>
  );
}

export default ExplorerPanelVisibilityToggle;
