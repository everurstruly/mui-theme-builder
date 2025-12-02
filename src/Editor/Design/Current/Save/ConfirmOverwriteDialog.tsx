import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmOverwriteDialogProps {
  open: boolean;
  existingTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmOverwriteDialog({
  open,
  existingTitle,
  onClose,
  onConfirm,
}: ConfirmOverwriteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Overwrite</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to overwrite the existing design "{existingTitle}"?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Yes, Overwrite
        </Button>
      </DialogActions>
    </Dialog>
  );
}
