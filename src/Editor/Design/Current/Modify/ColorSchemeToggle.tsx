import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import useCurrent from "../useCurrent";

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
  const colorScheme = useCurrent((s) => s.activeColorScheme);
  const setColorScheme = useCurrent((s) => s.setActiveColorScheme);

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
      color="primary"
      value={colorScheme}
      onChange={handleChange}
      aria-label="Theme color mode toggle"
      size="small"
    >
      {options.map((option) => {
        return (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={option.label}
            sx={{
              px: 1.4,
              // borderRadius: 2,
            }}
          >
            {option.icon}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
