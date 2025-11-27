import useStorageCollection from "./useStorageCollection";
import useHasStoredAllModifications from "../Edit/useHasStoredAllModifications";
import { Button, Snackbar } from "@mui/material";
import { useState, useCallback } from "react";
import useStorage from "./useStorage";
import useEdit from "../Edit/useEdit";
import ConfirmOverwriteDialog from "./ConfirmOverwriteDialog";
import { useConflictDialogHandler } from "./useConflictDialogHandler";

export default function StoreCurrentButton() {
  const [shouldShowNotification, showNotification] = useState(false);
  // Whether the current design is fully stored (no pending modifications)
  const hasStoredAllModifications = useHasStoredAllModifications();
  const storageProgress = useStorage((s) => s.storageProgress);
  const lastSavedId = useStorage((s) => s.lastSavedId);
  // Disable while saving in-flight
  const isSaving = storageProgress === "loading";
  // Current editor's source template id (if any) is stored on baseThemeMetadata
  const currentSourceId = useEdit(
    (s) => (s as any).baseThemeMetadata?.sourceTemplateId as string | undefined
  );
  // Consider the design currently stored when the domain reports no unsaved
  // modifications, the last storage attempt succeeded, and the current
  // editor source corresponds to the saved item id.
  const isCurrentlyStored =
    hasStoredAllModifications && storageProgress === "success" &&
    currentSourceId != null && lastSavedId === currentSourceId;

  const { saveCurrent, savedDesigns } = useStorageCollection();
  const title = useEdit((s) => s.title);
  const conflictHandler = useConflictDialogHandler(savedDesigns, title);
  const handleSaveModifications = useCallback(async () => {
    try {
      await saveCurrent();
      showNotification(true);
    } catch (e: any) {
      if (!conflictHandler.handleConflictError(e)) {
        throw e;
      }
    }
  }, [saveCurrent, conflictHandler, showNotification]);

  const handleOverwrite = useCallback(async () => {
    conflictHandler.closeDialog();
    try {
      await saveCurrent({ overwriteExisting: true });
      showNotification(true);
    } finally {
      conflictHandler.closeDialog();
    }
  }, [saveCurrent, conflictHandler, showNotification]);

  const handleSaveAsNew = useCallback(
    async (newTitle?: string) => {
      conflictHandler.closeDialog();
      try {
        await saveCurrent({ title: newTitle ?? undefined });
        showNotification(true);
      } finally {
        conflictHandler.closeDialog();
      }
    },
    [saveCurrent, conflictHandler, showNotification]
  );

  return (
    <>
      <Button
        value="save"
        aria-label="Save design"
        color="info"
        variant="outlined"
        disabled={isSaving || isCurrentlyStored}
        // startIcon={<SaveRounded />}
            onClick={handleSaveModifications}
      >
          {isSaving ? "Saving..." : isCurrentlyStored ? "Saved" : "Save to Device"}
      </Button>

      <ConfirmOverwriteDialog
        open={conflictHandler.conflictOpen}
        existingTitle={conflictHandler.existingTitle}
        existingId={conflictHandler.existingId}
        onClose={conflictHandler.closeDialog}
        onOverwrite={handleOverwrite}
        onSaveAsNew={handleSaveAsNew}
      />

      <Snackbar
        open={shouldShowNotification}
        autoHideDuration={2000}
        onClose={() => showNotification(false)}
        message="Design saved to device"
      />
    </>
  );
}
