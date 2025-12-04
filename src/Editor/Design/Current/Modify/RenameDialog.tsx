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
import { useTitle } from "./useTitle";
import useEditor from "../../../useEditor";
import DialogHeading from "../../../components/DialogHeading";
import { BorderColorOutlined } from "@mui/icons-material";

export default function RenameDialog() {
  const { rename, title, validateNewTitle, conflict, isChecking, hasConflict } =
    useTitle();

  const open = useEditor((s) => s.renameDialogOpen);
  const setRenameDialogOpen = useEditor((s) => s.setRenameDialogOpen);
  const onClose = () => setRenameDialogOpen(false);

  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);

  const handleChange = (v: string) => {
    setValue(v);
    setError(null);
    setShowOverwriteConfirm(false);
    validateNewTitle(v);
  };

  const handleRenameSuccess = (result: { persisted: boolean; title: string }) => {
    onClose();

    if (result.persisted) {
      // setSnack({
      //   severity: "success",
      //   message: `Renamed and saved as '${result.title}'`,
      // });
    } else {
      // setSnack({
      //   severity: "success",
      //   message: `Renamed to '${result.title}' (not yet saved)`,
      // });
    }
  };

  const attemptRename = async (force = false) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await rename(value || "Untitled", { force });
      handleRenameSuccess(result);
    } catch (err: any) {
      setError(err?.message || "Rename failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimary = async () => {
    if (hasConflict) {
      setShowOverwriteConfirm(true);
      return;
    }

    await attemptRename(false);
  };

  const handleForceOverwrite = async () => {
    await attemptRename(true);
  };

  useEffect(() => {
    setValue(title);
  }, [title]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <DialogHeading title="Rename Current Design" Icon={BorderColorOutlined} />
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          autoFocus
          disabled={isSubmitting}
          helperText={
            isChecking ? (
              <Box
                sx={{ display: "inline-flex", alignItems: "center", columnGap: 1 }}
              >
                <CircularProgress size={12} />
                <Typography variant="caption">Checking title...</Typography>
              </Box>
            ) : hasConflict ? (
              `Conflicts with saved design '${conflict?.existingTitle ?? ""}'.`
            ) : undefined
          }
          error={!!hasConflict}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handlePrimary();
            }
          }}
          sx={{ mt: 2 }}
        />

        {showOverwriteConfirm && (
          <Box sx={{ mt: 2 }}>
            <Alert
              severity="warning"
              action={
                <Box sx={{ display: "flex", columnGap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => setShowOverwriteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="small" color="error" onClick={handleForceOverwrite}>
                    Force Overwrite
                  </Button>
                </Box>
              }
            >
              Another saved design already uses this title. Forcing will overwrite
              it.
            </Alert>
          </Box>
        )}

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
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
