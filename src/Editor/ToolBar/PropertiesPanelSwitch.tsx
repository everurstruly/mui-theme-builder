import useEditorStore from "../editorStore";
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
      size="small"
      color="inherit"
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
          <FullscreenRounded sx={{ fontSize: 20, marginRight: 0.5 }} />
        </>
      ) : (
        <>
          <TuneRounded sx={{ fontSize: 20, marginRight: 0.5 }} /> Theming
          Options
        </>
      )}
    </Button>
  );
}
