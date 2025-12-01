import ConfirmOverwriteDialog from "./ConfirmOverwriteDialog";
import { Button, Box } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { useSave } from "..";
import { useRename } from "../hooks";

export default function SaveButton() {
  const { title, checkTitle, conflict, isChecking } = useRename();
  const { save, status, canSave, isDirty } = useSave();
  const [showConflictDialog, setShowConflictDialog] = useState(false);

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
        setShowConflictDialog(true);
      } else {
        // Other errors are shown via error state
        console.error("Save failed:", err);
      }
    }
  }, [save]);

  const handleOverwrite = useCallback(async () => {
    setShowConflictDialog(false);
    try {
      await save({ onConflict: "overwrite" });
    } catch (err) {
      console.error("Overwrite failed:", err);
    }
  }, [save]);

  const handleSaveAsNew = useCallback(
    async (newTitle?: string) => {
      setShowConflictDialog(false);
      try {
        await save({ title: newTitle, onConflict: "fail" });
      } catch (err) {
        console.error("Save as new failed:", err);
      }
    },
    [save]
  );

  const handleCancelConflict = useCallback(() => {
    setShowConflictDialog(false);
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

      <ConfirmOverwriteDialog
        open={showConflictDialog}
        existingTitle={conflict?.existingTitle ?? ""}
        existingId={conflict?.existingId ?? ""}
        onClose={handleCancelConflict}
        onOverwrite={handleOverwrite}
        onSaveAsNew={handleSaveAsNew}
      />
    </>
  );
}
