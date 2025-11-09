import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useThemeSheetStore } from "../ThemeSheetV2";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

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

export default function ThemeSheetColorSchemeToggle() {
  const colorScheme = useThemeSheetStore((state) => state.colorScheme);
  const setColorScheme = useThemeSheetStore((state) => state.setColorScheme);

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
              // backgroundColor: (theme) => alpha(theme.palette.common.black, 0.02),
              borderRadius: 2,
              py: 1, // TODO: match the size of other activity bar actions/buttons

              // "&.Mui-selected": {
              //   color: "primary.main",
              //   backgroundColor: "background.default",
              // },
            }}
          >
            {option.icon}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
