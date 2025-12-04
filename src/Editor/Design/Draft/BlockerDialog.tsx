import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useDraft } from "./useDraft";
import DialogHeading from "../../_Components/DialogHeading";
import { ErrorOutline } from "@mui/icons-material";

export default function BlockerDialog() {
  const { status, blocker } = useDraft();

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
    >
      <DialogTitle id="load-confirmation-title">
        <DialogHeading title="Wait! You've Unsaved Changes" Icon={ErrorOutline} />
      </DialogTitle>

      <DialogContent>
        <Typography
          id="load-confirmation-description"
          variant="body2"
          color="textSecondary"
          sx={{ py: 2, maxWidth: "58ch" }}
        >
          Loading a new template will overwrite your current work unless you choose
          to keep them.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button color="warning" onClick={onDiscard}>
          Discard changes
        </Button>

        <Button onClick={onKeep}>Keep & stay</Button>
      </DialogActions>
    </Dialog>
  );
}
