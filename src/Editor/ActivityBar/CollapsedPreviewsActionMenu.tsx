import { Button } from "@mui/material";
import useEditorUiStore from "../editorUiStore";

function CollapsedPreviewsActionMenu() {
  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const isExplorerPanelHidden = () => hiddenPanels.includes("explorer");

  if (!isExplorerPanelHidden()) {
    return null;
  }

  return (
    <Button
      color="inherit"
      sx={{
        cursor: "pointer",
      }}
    >
      Previews & Components
    </Button>
  );
}

export default CollapsedPreviewsActionMenu;
