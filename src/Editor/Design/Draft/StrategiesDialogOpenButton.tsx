import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";
import { Add } from "@mui/icons-material";
import useDialogs from "./useDialogs";

export default function StrategiesDialogOpenButton() {
  const open = useDialogs((s) => s.openLaunch);
  const isDesktop = useMediaQuery("(min-width:400px)");

  return (
    <Button
      aria-label="Create new theme"
      onClick={() => open()}
      sx={{
        columnGap: 0.5,
        minWidth: 0,
      }}
    >
      <Add sx={{ fontSize: { sm: "1rem !important" } }} />
      {isDesktop && "Create"}
    </Button>
  );
}
