import useEditorStore from "../Editor.store";
import { FullscreenRounded, TuneRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function PropertiesPanelSwitch() {
  const withHidePanel = useEditorStore((state) => state.hidePanel);
  const withShowPanel = useEditorStore((state) => state.showPanel);
  const isPanelVisible = useEditorStore(
    (state) => !state.hiddenPanels.includes("properties")
  );

  const handleDisplayPropertyPanel = () => {
    if (!isPanelVisible) {
      withShowPanel("properties");
    } else {
      withHidePanel("properties");
    }
  };

  return (
    <Button
      color="inherit"
      // variant="outlined"
      onClick={() => handleDisplayPropertyPanel()}
      sx={(theme) => ({
        width: "auto",
        minWidth: 0,
        height: "fit-content",
        boxShadow: "none",
        paddingInline: 1,
        borderColor: "divider",
        marginTop: 0.5, // some weird alignment issue without this

        [theme.breakpoints.down("md")]: {
          display: "none",
        },
      })}
    >
      {isPanelVisible ? (
        <FullscreenRounded sx={{ fontSize: 28 }} />
      ) : (
        <TuneRounded sx={{ fontSize: 28 }} />
      )}
    </Button>
  );
}
