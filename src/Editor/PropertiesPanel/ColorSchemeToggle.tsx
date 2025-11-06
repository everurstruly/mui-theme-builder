import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useWorkfileStore from "../Workfile/useWorkfileStore";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

const defaultColorMode = "light";

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
];

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
      size="small"
      value={mode}
      onChange={handleChange}
      aria-label="Workfile theme color mode toggle"
    >
      {options.map((option) => {
        return (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={option.label}
            sx={{
              borderRadius: 2,
              // color: "common.black",

              "&:hover": {
                color: "primary.light",
              },

              "&.Mui-selected": {
                color: "common.black",
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
