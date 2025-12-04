import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DialogHeading from "../../../_Components/DialogHeading";
import { WarningAmberOutlined } from "@mui/icons-material";

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
      <DialogTitle>
        <DialogHeading title="Confirm Replace" Icon={WarningAmberOutlined} />
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to replace the existing design "{existingTitle}"?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Yes, Replace existing
        </Button>
      </DialogActions>
    </Dialog>
  );
}
