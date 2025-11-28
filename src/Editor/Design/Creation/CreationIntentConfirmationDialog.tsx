import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  type SxProps,
} from "@mui/material";

type CreationIntentConfirmationDialogProps = {
  open: boolean;
  onDiscard: () => void; // discard unsaved changes and proceed
  onKeep: () => void; // keep unsaved changes and proceed without overwriting
  onCancel: () => void; // close dialog and do nothing

  sx?: SxProps;
};

export default function CreationIntentConfirmationDialog(
  props: CreationIntentConfirmationDialogProps
) {
  const { open, onDiscard, onKeep, onCancel, sx } = props;

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
        <Typography variant="h5">Wait! You've Unsaved Changes</Typography>
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
