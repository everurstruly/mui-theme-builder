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
      variant="circular"
      size={isLargeScreen ? "small" : "medium"}
      aria-label="edit"
      onClick={() => showPanel()}
      sx={(theme) => ({
        display: isPanelVisible ? "none" : "flex",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        position: "fixed",
        right: `calc(var(--canvas-brim-padding) + .5rem)`,
        bottom: `calc(var(--canvas-brim-padding) + 3rem)`,

        [theme.breakpoints.up("md")]: {
          display: "none",
        },
      })}
    >
      <TuneOutlined />
    </Fab>
  );
}
