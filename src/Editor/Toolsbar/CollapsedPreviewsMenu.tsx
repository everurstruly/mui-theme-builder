import { Button } from "@mui/material";
import useEditorStore from "../useEditor";

function CollapsedPreviewsMenu() {
  const hiddenPanels = useEditorStore((state) => state.hiddenPanels);
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

export default CollapsedPreviewsMenu;
