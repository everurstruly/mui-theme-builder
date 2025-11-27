import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  existingTitle: string;
  existingId?: string | null;
  onClose: () => void;
  onOverwrite: () => void;
  // pass the new title the user entered when saving as new
  onSaveAsNew: (newTitle: string) => void;
}

export default function ConfirmOverwriteDialog(props: Props) {
  const { open, existingTitle, existingId, onClose, onOverwrite, onSaveAsNew } =
    props;
  const [newTitle, setNewTitle] = useState(existingTitle || "");

  useEffect(() => {
    if (open) {
      setNewTitle(existingTitle || "");
    }
  }, [open, existingTitle]);

  const trimmed = (newTitle || "").trim();
  const isEmpty = trimmed.length === 0;
  const isSameAsExisting = trimmed === (existingTitle || "").trim();

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-overwrite-title">
      <DialogTitle id="confirm-overwrite-title">
        Conflict: Saved design exists
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          A design named "{existingTitle}" already exists in your saved designs
          {existingId ? " (id: " + existingId + ")" : ""}. You can overwrite the
          existing saved design, or save your current design as a new item under a
          different name.
        </DialogContentText>

        <TextField
          margin="normal"
          label="Save as"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          error={isEmpty || isSameAsExisting}
          helperText={
            isEmpty
              ? "Please enter a name"
              : isSameAsExisting
              ? "Name matches existing saved design — choose a different name or Overwrite"
              : undefined
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onSaveAsNew(newTitle)}
          disabled={isEmpty || isSameAsExisting}
        >
          Save as New
        </Button>
        <Button color="error" onClick={onOverwrite} autoFocus>
          Overwrite
        </Button>
      </DialogActions>
    </Dialog>
  );
}
