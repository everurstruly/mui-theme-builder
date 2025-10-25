import useMediaQuery from "@mui/material/useMediaQuery";
import useEditorStore from "../editorStore";
import { Fab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TuneOutlined } from "@mui/icons-material";

export default function EditorPropertiesDrawerToggle() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const isPanelVisible = useEditorStore((state) => {
    return !state.hiddenPanels.includes("properties");
  });

  const withShowPanel = useEditorStore((state) => state.showPanel);
  const showPanel = () => withShowPanel("properties");

  return (
    <Fab
      color="primary"
      variant="extended"
      size={isLargeScreen ? "small" : "large"}
      aria-label="edit"
      onClick={() => showPanel()}
      sx={(theme) => ({
        display: isPanelVisible ? "none" : "flex",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        position: "fixed",
        right: `.5rem`,
        bottom: `4rem`,

        [theme.breakpoints.up("md")]: {
          display: "none",
        },
      })}
    >
      <TuneOutlined />
    </Fab>
  );
}
