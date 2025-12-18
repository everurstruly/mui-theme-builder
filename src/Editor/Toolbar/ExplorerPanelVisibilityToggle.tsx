import useEditor from "../useEditor";
import { IconButton, Tooltip } from "@mui/material";
import { ExpandOutlined, ViewSidebarOutlined } from "@mui/icons-material";
import { useCallback } from "react";

function ExplorerPanelVisibilityToggle() {
  const hiddenPanels = useEditor((state) => state.hiddenPanels);
  const hidePanel = useEditor((state) => state.hidePanel);
  const showPanel = useEditor((state) => state.showPanel);

  const isExplorerPanelHidden = useCallback(
    () => hiddenPanels.includes("explorer"),
    [hiddenPanels]
  );

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
    <Tooltip
      title={
        isExplorerPanelHidden() ? "Expand Explorer Panel" : "Minimize Explorer Panel"
      }
    >
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
    </Tooltip>
  );
}

export default ExplorerPanelVisibilityToggle;
