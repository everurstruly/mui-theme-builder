import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useThemeWorkspaceStore } from "../ThemeWorkspace";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { alpha } from "@mui/material";

const options = [
  {
    value: "light",
    label: "Light Mode",
    icon: <LightModeOutlined sx={{ fontSize: 16 }} />,
  },
  {
    value: "dark",
    label: "Dark Mode",
    icon: <DarkModeOutlined sx={{ fontSize: 16 }} />,
  },
] as const;

export default function ColorSchemeToggle() {
  const colorScheme = useThemeWorkspaceStore((state) => state.colorScheme);
  const setColorScheme = useThemeWorkspaceStore((state) => state.setColorScheme);

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "light" | "dark" | null
  ) => {
    if (newMode) {
      setColorScheme(newMode);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      // size="small"
      value={colorScheme}
      onChange={handleChange}
      aria-label="Theme color mode toggle"
    >
      {options.map((option) => {
        return (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={option.label}
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.common.black, 0.015),
              borderRadius: 2,
              py: 1,

              "&.Mui-selected": {
                color: "common.black",
                backgroundColor: "background.default",
                boxShadow:
                  "1px 1px 0px rgba(0, 0, 0, .1), -1px 0px 0px rgba(0, 0, 0, 0.1) !important",
              },
            }}
          >
            {option.icon}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
