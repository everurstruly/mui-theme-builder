import useStorageCollection from "./useStorageCollection";
import useHasUnsavedModifications from "../Current/useHasUnsavedModifications";
import { SaveRounded } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";

export default function StoreCurrentButton() {
  const [shouldShowNotification, showNotification] = useState(false);
  const hasUnsavedModifications = useHasUnsavedModifications();

  const { saveCurrent } = useStorageCollection();

  const handleSaveModifications = async () => {
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
        disabled={hasUnsavedModifications}
        startIcon={<SaveRounded />}
        onClick={() => handleSaveModifications()}
      >
        {hasUnsavedModifications ? "Saved" : "Save"}
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
