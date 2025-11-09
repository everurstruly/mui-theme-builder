import useEditorUiStore from "../editorUiStore";
import { IconButton } from "@mui/material";
import { MenuOpenOutlined } from "@mui/icons-material";

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
    <IconButton onClick={handleToggleClick}>
      <MenuOpenOutlined fontSize="small" />
    </IconButton>
  );
}

export default ExplorerPanelVisibilityToggle;
