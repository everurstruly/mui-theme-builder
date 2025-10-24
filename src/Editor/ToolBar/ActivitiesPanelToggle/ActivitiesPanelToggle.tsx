import useEditorStore from "../../editorStore";
import FloatingCanvasObjectsTree from "./FloatingCanvasObjectsTree";
import { ListOutlined, PhotoSizeSelectSmallRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function ActivitiesPanelToggle() {
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

  if (isPanelVisible) {
    return (
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
