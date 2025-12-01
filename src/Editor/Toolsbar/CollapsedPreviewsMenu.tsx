import { Button } from "@mui/material";
import useEditor from "../useEditor";

function CollapsedPreviewsMenu() {
  const hiddenPanels = useEditor((state) => state.hiddenPanels);
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
