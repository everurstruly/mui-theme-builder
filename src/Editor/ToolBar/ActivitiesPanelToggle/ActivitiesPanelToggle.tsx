import useEditorUiStore from "../../editorUiStore";
import FloatingCanvasObjectsTree from "./FloatingCanvasObjectsTree";
import { ListOutlined, PhotoSizeSelectSmallRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function ActivitiesPanelToggle() {
  const withHidePanel = useEditorUiStore((state) => state.hidePanel);
  const withShowPanel = useEditorUiStore((state) => state.showPanel);
  const isPanelVisible = useEditorUiStore(
    (state) => !state.hiddenPanels.includes("explorer")
  );

  const handleDisplayPropertyPanel = () => {
    if (!isPanelVisible) {
      withShowPanel("explorer");
    } else {
      withHidePanel("explorer");
    }
  };

  if (isPanelVisible) {
    return (
      <Button
        color="inherit"
        onClick={() => handleDisplayPropertyPanel()}
        sx={{
          width: "auto",
          minWidth: 0,
          height: "fit-content",
          boxShadow: "none",
          paddingInline: 1,
          textTransform: "none",
          fontSize: ".75rem",
        }}
      >
        <PhotoSizeSelectSmallRounded sx={{ fontSize: 20 }} />
      </Button>
    );
  }

  return (
    <>
      <FloatingCanvasObjectsTree />
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
        <ListOutlined sx={{ fontSize: 20 }} />
      </Button>
    </>
  );
}
