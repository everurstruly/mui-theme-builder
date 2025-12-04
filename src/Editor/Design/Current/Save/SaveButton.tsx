import { Button, Box } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useTitle } from "../Modify/useTitle";
import { useSave } from "./useSave";
import { useCurrent } from "../useCurrent";

export default function SaveButton() {
  const { title, validateNewTitle, isChecking } = useTitle();
  const { save, status, canSave, isDirty } = useSave();
  const isSaved = useCurrent((s) => !!s.savedId);

  useEffect(() => {
    if (title && title.trim()) {
      validateNewTitle(title);
    }
  }, [title, validateNewTitle]);

  const handleSave = useCallback(async () => {
    try {
      await save({ onConflict: "fail" });
    } catch (err: any) {
      // Let the global persistence dialog/router react to persistenceError
      console.error("Save failed:", err);
    }
  }, [save]);

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
    // Unsaved designs (templates, blank, new)
    if (!isSaved) {
      return "Save to Collection";
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
          disabled={!canSave || isChecking}
          onClick={handleSave}
        >
          {buttonLabel}
        </Button>
      </Box>
    </>
  );
}
