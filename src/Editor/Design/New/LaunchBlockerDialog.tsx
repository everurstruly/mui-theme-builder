import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  type SxProps,
} from "@mui/material";
import { useLoad } from "./useLoad";

type LaunchBlockerDialogProps = {
  sx?: SxProps;
};

export default function LaunchBlockerDialog({ sx }: LaunchBlockerDialogProps) {
  const { status, blocker } = useLoad();

  const open = status === "blocked" && blocker?.reason === "UNSAVED_CHANGES";
  const onCancel = () => blocker?.resolutions.cancel();
  const onKeep = () => blocker?.resolutions.cancel();
  const onDiscard = () => blocker?.resolutions.discardAndProceed();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="load-confirmation-title"
      aria-describedby="load-confirmation-description"
      sx={{ top: "-20%", ...sx }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
          },
        },
      }}
    >
      <DialogTitle id="load-confirmation-title" sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" component="div">
          Wait! You've Unsaved Changes
        </Typography>
        <Typography
          id="load-confirmation-description"
          variant="body2"
          color="textSecondary"
          sx={{ maxWidth: "42ch", py: 1 }}
        >
          Loading a new template will overwrite your current work unless you choose
          to keep them.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "center", mb: 1 }}
        >
          <Button color="warning" onClick={onDiscard}>
            Discard and continue
          </Button>

          <Button onClick={onKeep}>Keep them & stay</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
