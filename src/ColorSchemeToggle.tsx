import { ContrastOutlined } from "@mui/icons-material";
import { useColorScheme, Button } from "@mui/material";

const modeCycleOrder: Array<ReturnType<typeof useColorScheme>["mode"]> = [
  "light",
  "dark",
];

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <Button
      value="color-scheme-mode"
      size="small"
      color="inherit"
      sx={[() => ({ minWidth: 0, px: 1 })]}
      onClick={() => {
        const currentIndex = modeCycleOrder.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modeCycleOrder.length;
        setMode(modeCycleOrder[nextIndex] || null);
      }}
    >
      <ContrastOutlined sx={{ fill: "currentColor" }} />
    </Button>
  );
}

export default ColorSchemeToggle;
