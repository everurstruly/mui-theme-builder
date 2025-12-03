import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useLaunchDialog } from "./useLaunchDialog";

export default function LaunchDialogOpenButton() {
  const open = useLaunchDialog((s) => s.open);
  const isDesktop = useMediaQuery("(min-width:400px)");

  return (
    <Button
      aria-label="Create new theme"
      onClick={(e) => open(e.currentTarget)}
      sx={{
        columnGap: 0.5,
        minWidth: 0,
      }}
    >
      <Add sx={{ fontSize: "1rem !important" }} />
      {isDesktop && "Create"}
    </Button>
  );
}
