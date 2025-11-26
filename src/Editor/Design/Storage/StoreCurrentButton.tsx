import useStorageCollection from "./useStorageCollection";
import useHasStoredAllModifications from "../Edit/useHasStoredAllModifications";
import { SaveRounded } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";

export default function StoreCurrentButton() {
  const [shouldShowNotification, showNotification] = useState(false);
  const hasUnsavedModifications = useHasStoredAllModifications();

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
