import useMediaQuery from "@mui/material/useMediaQuery";
import useEditorStore from "../Editor.store";
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
        right: 14,
        bottom: 10,

        [theme.breakpoints.up("md")]: {
          bottom: "revert",
          top: 14,
          right: 12,
        },

        [theme.breakpoints.up("lg")]: {
          display: "none",
        },
      })}
    >
      <TuneOutlined />
    </Fab>
  );
}
