import SaveConflictDialog from "./SaveConflictDialog";
import { Button, Box } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { useSave } from "../../Persistence";
import { useRename } from "../../Persistence/hooks";

export default function SaveButton() {
  const { title, checkTitle, conflict, isChecking } = useRename();
  const { save, status, canSave, isDirty } = useSave();
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [attemptedNewTitle, setAttemptedNewTitle] = useState<string | null>(null);

  useEffect(() => {
    if (title && title.trim()) {
      checkTitle(title);
    }
  }, [title, checkTitle]);

  const handleSave = useCallback(async () => {
    try {
      await save({ onConflict: "fail" });
    } catch (err: any) {
      if (err.code === "CONFLICT") {
        setAttemptedNewTitle(null);
        setConflictError(null);
        setShowConflictDialog(true);
      } else {
        // Other errors are shown via error state
        console.error("Save failed:", err);
      }
    }
  }, [save, title]);

  const handleOverwrite = useCallback(async () => {
    // Keep dialog open until overwrite completes; parent will close on success.
    try {
      await save({ onConflict: "overwrite" });
      setShowConflictDialog(false);
      setConflictError(null);
    } catch (err: any) {
      console.error("Overwrite failed:", err);
      setConflictError(err?.message ?? 'Overwrite failed');
    }
  }, [save]);

  const handleSaveAsNew = useCallback(
    async (newTitle?: string) => {
      try {
        // Attempt to save as new; keep dialog open until success so we can
        // surface any errors back to the user and allow retrying.
        await save({ title: newTitle, onConflict: "fail" });
        setShowConflictDialog(false);
        setConflictError(null);
        setAttemptedNewTitle(null);
      } catch (err: any) {
        if (err.code === 'CONFLICT') {
          // Keep the dialog open and show an inline error; prefill the field
          // so the user can immediately choose a new title.
          setAttemptedNewTitle(newTitle ?? null);
          setConflictError('A design with that title already exists. Choose a different title.');
          setShowConflictDialog(true);
        } else {
          console.error('Save as new failed:', err);
          setConflictError(err?.message ?? 'Save failed');
          setShowConflictDialog(true);
        }
      }
    },
    [save]
  );

  const handleCancelConflict = useCallback(() => {
    // Reset any transient state so the dialog returns to its initial
    // "choose" mode when reopened.
    setShowConflictDialog(false);
    setConflictError(null);
    setAttemptedNewTitle(null);
  }, []);

  const getButtonLabel = () => {
    if (status === "saving") {
      return "Saving...";
    }
    if (status === "saved") {
      return "Saved";
    }
    if (isDirty) {
      return "Save Changes";
    }
    return "Save";
  };

  const buttonLabel = getButtonLabel();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Button
          value="save"
          aria-label="Save design"
          color={"info"}
          disabled={!canSave || isChecking}
          onClick={handleSave}
        >
          {buttonLabel}
        </Button>

        {/* {hasConflict && (
          <Typography variant="caption" color="warning.main" sx={{ fontSize: '0.7rem' }}>
            Title "{conflict?.currentTitle}" already exists
          </Typography>
        )}
        
        {error && !showConflictDialog && (
          <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem' }}>
            {error.message}
          </Typography>
        )} */}
      </Box>

      <SaveConflictDialog
        open={showConflictDialog}
        existingTitle={conflict?.existingTitle ?? ""}
        existingId={conflict?.existingId ?? ""}
        onClose={handleCancelConflict}
        onOverwrite={handleOverwrite}
        onSaveAsNew={handleSaveAsNew}
        errorMessage={conflictError}
        initialNewTitle={attemptedNewTitle ?? undefined}
        initialMode={attemptedNewTitle ? 'rename' : undefined}
      />
    </>
  );
}
