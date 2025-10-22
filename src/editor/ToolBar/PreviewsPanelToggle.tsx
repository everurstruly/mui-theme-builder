import useEditorStore from "../Editor.store";
import { MenuOpenOutlined, Grid3x3Outlined } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function PreviewsPanelToggle() {
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
    <Button
      color="inherit"
      variant={isPanelVisible ? "outlined" : "contained"}
      onClick={() => handleDisplayPropertyPanel()}
      sx={(theme) => ({
        width: "auto",
        minWidth: 0,
        height: "fit-content",
        boxShadow: "none",
        paddingInline: 1,
        borderColor: "divider",
        textTransform: "none",
        fontSize: ".75rem",

        [theme.breakpoints.down("md")]: {
          display: "none",
        },
      })}
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
  );
}
