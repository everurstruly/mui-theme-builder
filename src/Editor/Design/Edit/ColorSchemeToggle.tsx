import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import useEdit from "./useEdit";

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
  const colorScheme = useEdit((s) => s.activeColorScheme);
  const setColorScheme = useEdit((s) => s.setActiveColorScheme);

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
      // sx={(theme) => ({
      //   ...theme.applyStyles("light", {
      //     backgroundColor: "white",
      //   }),
      // })}
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
              p: 1, // TODO: match the size of other activity bar actions/buttons
              px: 1.4,

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
