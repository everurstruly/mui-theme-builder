import useEditorUiStore from "../editorUiStore";
import { IconButton } from "@mui/material";
import { ExpandOutlined } from "@mui/icons-material";

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
      // color="inherit"
      // variant="contained"
      // sx={{ minWidth: 0, px: 1, borderRadius: 2 }}
      onClick={handleToggleClick}
      sx={{ backgroundColor: "transparent" }}
    >
      <ExpandOutlined fontSize="small" sx={{ rotate: "90deg" }} />
    </IconButton>
  );
}

export default ExplorerPanelVisibilityToggle;
