import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useRename } from "../Persistence/hooks/useRename";

interface RenameDialogProps {
  open: boolean;
  onClose: () => void;
  initialTitle: string;
  currentSnapshotId?: string | null;
  onSuccess?: (result: { persisted: boolean; title: string }) => void;
}

export default function RenameDialog({
  open,
  onClose,
  initialTitle,
  currentSnapshotId,
  onSuccess,
}: RenameDialogProps) {
  const { rename, checkTitle, conflict, isChecking } = useRename();

  const [value, setValue] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);

  useEffect(() => {
    setValue(initialTitle);
    // Do NOT run validation immediately on open with the existing title —
    // this causes false-positive conflicts for the current design. Wait
    // until the user edits the value before calling `checkTitle`.
  }, [initialTitle, open]);

  const normalizedInitial = (initialTitle || "").trim();

  const conflictingOther =
    conflict &&
    conflict.existingId &&
    conflict.existingId !== currentSnapshotId &&
    value.trim() !== normalizedInitial;

  const handleChange = (v: string) => {
    setValue(v);
    setError(null);
    // Only run validation when the user has changed the value from the original
    // title. This prevents the dialog from flagging the existing title on open.
    if (v.trim() !== normalizedInitial) {
      checkTitle(v);
    }
    setShowOverwriteConfirm(false);
  };

  const doRename = async (force = false) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await rename(value || "Untitled", { force });
      onSuccess?.(result);
      onClose();
    } catch (err: any) {
      console.error("Rename failed", err);
      setError(err?.message || "Rename failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimary = async () => {
    // If there's a conflicting design that is not the current one, require explicit overwrite
    if (conflictingOther) {
      setShowOverwriteConfirm(true);
      return;
    }

    await doRename(false);
  };

  const handleForceOverwrite = async () => {
    await doRename(true);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rename Current Design</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          autoFocus
          disabled={isSubmitting}
          helperText={
            isChecking ? (
              <Box sx={{ display: "inline-flex", alignItems: "center", columnGap: 1 }}>
                <CircularProgress size={12} />
                <Typography variant="caption">Checking title...</Typography>
              </Box>
            ) : conflictingOther ? (
              `Conflicts with saved design '${conflict?.existingTitle ?? ""}'.`
            ) : undefined
          }
          error={!!conflictingOther}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handlePrimary();
            }
          }}
        />

        {showOverwriteConfirm && (
          <Box sx={{ mt: 2 }}>
            <Alert
              severity="warning"
              action={
                <Box sx={{ display: "flex", columnGap: 1 }}>
                  <Button size="small" onClick={() => setShowOverwriteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button size="small" color="error" onClick={handleForceOverwrite}>
                    Force Overwrite
                  </Button>
                </Box>
              }
            >
              Another saved design already uses this title. Forcing will overwrite it.
            </Alert>
          </Box>
        )}

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handlePrimary}
          variant="contained"
          disabled={isSubmitting || isChecking}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
}
