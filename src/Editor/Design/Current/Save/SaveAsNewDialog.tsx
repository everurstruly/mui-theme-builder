import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";

interface SaveAsNewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  errorMessage?: string | null;
  initialValue?: string;
}

export default function SaveAsNewDialog({
  open,
  onClose,
  onSave,
  errorMessage,
  initialValue,
}: SaveAsNewDialogProps) {
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (open) {
      setNewTitle(initialValue ?? "");
    }
  }, [open, initialValue]);

  const handleSave = () => {
    if (newTitle.trim()) {
      onSave(newTitle.trim());
      setNewTitle("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Choose New Title</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <DialogContentText>Enter a new title for your design:</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="New Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTitle.trim()) {
                handleSave();
              }
            }}
          />
          {errorMessage && (
            <Box sx={{ mt: 1, mx: 1.5 }}>
              <DialogContentText color="error">{errorMessage}</DialogContentText>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!newTitle.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
