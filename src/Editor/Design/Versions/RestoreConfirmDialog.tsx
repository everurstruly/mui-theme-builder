import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useVersionHistory } from "./useVersionHistory";

interface RestoreConfirmDialogProps {
  open: boolean;
  versionId: string | null;
  versionTimestamp: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function RestoreConfirmDialog({
  open,
  versionTimestamp,
  onClose,
  onConfirm,
}: RestoreConfirmDialogProps) {
  const { hasUnsavedWork } = useVersionHistory();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleConfirm = async () => {
    setIsRestoring(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setIsRestoring(false);
    }
  };

  const formattedDate = versionTimestamp
    ? new Date(versionTimestamp).toLocaleString()
    : "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Restore Version?</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          This will replace your current design with the version from:
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {formattedDate}
        </Typography>

        {hasUnsavedWork && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            You have unsaved changes that will be lost.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isRestoring}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={isRestoring}
        >
          {isRestoring ? "Restoring..." : "Restore"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
