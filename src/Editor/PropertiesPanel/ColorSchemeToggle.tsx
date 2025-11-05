import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useWorkfileStore from "../Workfile/useWorkfileStore";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

const defaultColorMode = "light";

export default function ColorSchemeToggle() {
  const workfileTheme = useWorkfileStore((s) => s.themeModifications);
  const updateTheme = useWorkfileStore((s) => s.setThemeModifications);
  const mode = workfileTheme?.palette?.mode || defaultColorMode;

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: string | null
  ) => {
    if (newMode && (newMode === "light" || newMode === "dark")) {
      updateTheme({
        ...workfileTheme,
        palette: {
          ...workfileTheme?.palette,
          mode: newMode,
        },
      });
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={mode}
      onChange={handleChange}
      aria-label="Workfile theme color mode toggle"
      color="primary"
    >
      <ToggleButton
        value="dark"
        aria-label="Dark Mode"
        sx={{
          paddingBlock: 0.875,
          color: "common.black",

          "&.Mui-selected": {
            backgroundColor: "common.black",
            color: "white",
            "&:hover": {
              backgroundColor: "common.black",
            },
          },
        }}
      >
        <DarkModeOutlined sx={{ fontSize: 16 }} />
      </ToggleButton>

      <ToggleButton
        value="light"
        aria-label="Light Mode"
        sx={{
          paddingBlock: 0.875,
          color: "common.black",

          "&.Mui-selected": {
            backgroundColor: "common.black",
            color: "white",
            "&:hover": {
              backgroundColor: "common.black",
            },
          },
        }}
      >
        <LightModeOutlined sx={{ fontSize: 16 }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
