import { useSaveConflictFlow } from "./useSaveConflictFlow";
import ConflictResolutionDecisionDialog from "./ConflictResolutionDecisionDialog";
import ConfirmOverwriteDialog from "./ConfirmOverwriteDialog";
import SaveAsNewDialog from "./SaveAsNewDialog";

interface SaveConflictDialogProps {
  open: boolean;
  existingTitle: string;
  existingId: string;
  onClose: () => void;
  onOverwrite: () => void;
  onSaveAsNew: (newTitle: string) => void;
  // Optional initial values when opening in "rename" mode
  initialNewTitle?: string;
  initialMode?: "choose" | "rename";
  errorMessage?: string | null;
}

export default function SaveConflictDialog({
  open,
  existingTitle,
  existingId,
  onClose,
  onOverwrite,
  onSaveAsNew,
  initialNewTitle,
  initialMode,
  errorMessage,
}: SaveConflictDialogProps) {
  const { scene, errorMessage: flowError, attemptedTitle, actions } = useSaveConflictFlow({
    open,
    initialMode,
    onOverwrite,
    onSaveAsNew,
    onClose,
  });

  // Use external error if provided, otherwise use flow error
  const displayError = errorMessage ?? flowError;
  const initialValue = initialNewTitle ?? attemptedTitle ?? undefined;

  return (
    <>
      <ConflictResolutionDecisionDialog
        open={scene === "choose"}
        existingTitle={existingTitle}
        existingId={existingId}
        onClose={actions.cancel}
        onOverwrite={actions.chooseOverwrite}
        onSaveAsNew={actions.chooseSaveAsNew}
      />

      <ConfirmOverwriteDialog
        open={scene === "confirm-overwrite"}
        existingTitle={existingTitle}
        onClose={actions.cancel}
        onConfirm={actions.confirmOverwrite}
      />

      <SaveAsNewDialog
        open={scene === "rename"}
        onClose={actions.cancel}
        onSave={actions.submitNewTitle}
        errorMessage={displayError}
        initialValue={initialValue}
      />
    </>
  );
}
