import useDesignStorage from "./useDesignStorage";
import useHasUnsavedChanges from "../Current/useHasUnsavedChanges";
import { SaveRounded } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";

export default function SaveDesignButton() {
  const [shouldShowNotification, showNotification] = useState(false);
  const hasUnsavedChanges = useHasUnsavedChanges();

  const { saveCurrent } = useDesignStorage();

  const handleSaveChanges = async () => {
    await saveCurrent();
    showNotification(true);
  };

  return (
    <>
      <Button
        value="save"
        aria-label="Save design"
        color="info"
        variant="outlined"
        disabled={hasUnsavedChanges}
        startIcon={<SaveRounded />}
        onClick={() => handleSaveChanges()}
      >
        {hasUnsavedChanges ? "Saved" : "Save"}
      </Button>

      <Snackbar
        open={shouldShowNotification}
        autoHideDuration={2000}
        onClose={() => showNotification(false)}
        message="Design saved to device"
      />
    </>
  );
}
