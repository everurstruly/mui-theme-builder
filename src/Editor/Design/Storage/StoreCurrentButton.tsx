import useStorageCollection from "./useStorageCollection";
import useHasStoredAllModifications from "../Edit/useHasStoredAllModifications";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import useStorage from "./useStorage";

export default function StoreCurrentButton() {
  const [shouldShowNotification, showNotification] = useState(false);
  const hasStoredAllModifications = useHasStoredAllModifications();
  const storageProgress = useStorage((s) => s.storageProgress);
  const isCurrentlyStored =
    hasStoredAllModifications && storageProgress === "success";

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
        disabled={isCurrentlyStored}
        // startIcon={<SaveRounded />}
        onClick={() => handleSaveModifications()}
      >
        Save to Device
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
