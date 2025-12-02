import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConflictResolutionDecisionDialogProps {
  open: boolean;
  existingTitle: string;
  existingId: string;
  onClose: () => void;
  onOverwrite: () => void;
  onSaveAsNew: () => void;
}

export default function ConflictResolutionDecisionDialog({
  open,
  existingTitle,
  existingId,
  onClose,
  onOverwrite,
  onSaveAsNew,
}: ConflictResolutionDecisionDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Design Title Already Exists</DialogTitle>

      <DialogContent>
        <DialogContentText>
          A design with the title "{existingTitle}" already exists (ID:{" "}
          {existingId.slice(0, 8)}...).
          <br />
          <br />
          Would you like to overwrite it or save as a new design with a different
          title?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSaveAsNew} color="primary">
          Save as New
        </Button>
        <Button onClick={onOverwrite} color="warning" variant="contained">
          Overwrite Existing
        </Button>
      </DialogActions>
    </Dialog>
  );
}
