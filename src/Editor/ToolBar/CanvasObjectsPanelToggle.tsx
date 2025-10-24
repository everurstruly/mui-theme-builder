import useEditorStore from "../editorStore";
import { MenuOpenOutlined, Grid3x3Outlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import CanvasObjectsListPopOver from "./CanvasObjectsListPopOver";

export default function CanvasObjectsPanelToggle() {
  const withHidePanel = useEditorStore((state) => state.hidePanel);
  const withShowPanel = useEditorStore((state) => state.showPanel);
  const isPanelVisible = useEditorStore(
    (state) => !state.hiddenPanels.includes("activities")
  );

  const handleDisplayPropertyPanel = () => {
    if (!isPanelVisible) {
      withShowPanel("activities");
    } else {
      withHidePanel("activities");
    }
  };

  return (
    <>
      <CanvasObjectsListPopOver />
      <Button
        color="inherit"
        variant={"outlined"}
        onClick={() => handleDisplayPropertyPanel()}
        sx={{
          width: "auto",
          minWidth: 0,
          height: "fit-content",
          boxShadow: "none",
          paddingInline: 1,
          borderColor: "divider",
          textTransform: "none",
          fontSize: ".75rem",
        }}
      >
        {isPanelVisible ? (
          <>
            <MenuOpenOutlined sx={{ fontSize: 20 }} />
          </>
        ) : (
          <>
            <Grid3x3Outlined sx={{ fontSize: 20 }} />
          </>
        )}
      </Button>
    </>
  );
}
