import { useEffect } from "react";
import { useCurrent } from "../useCurrent";
import { useSave } from "./useSave";
import { useSaveConflictFlow } from "./useSaveConflictFlow";
import TitleConflictDialog from "./TitleConflictDialog";
import OverwriteConfirmationDialog from "./OverwriteConfirmationDialog";
import SaveAsNewDialog from "./SaveAsNewDialog";

export default function SaveBlockerDialog() {
  const persistenceError = useCurrent((s) => s.saveError);
  const setPersistenceError = useCurrent((s) => s.recordSaveError);
  const { save } = useSave();

  const open = !!(persistenceError && persistenceError.code === "CONFLICT");
  const existingTitle = persistenceError?.context?.conflict?.title ?? "";
  const existingId = persistenceError?.context?.conflict?.id ?? "";

  const { scene, errorMessage, attemptedTitle, actions } = useSaveConflictFlow({
    open,
    initialMode: open ? "choose" : undefined,
    // onOverwrite and onSaveAsNew will perform saves and set/clear persistenceError
    onOverwrite: async () => {
      try {
        await save({ onConflict: "overwrite" });
        setPersistenceError(null);
      } catch (err: any) {
        // propagate error into persistenceError store (save already sets it)
        setPersistenceError(err);
      }
    },
    onSaveAsNew: async (title: string) => {
      try {
        await save({ title, onConflict: "fail" });
        setPersistenceError(null);
      } catch (err: any) {
        // save() sets persistenceError in store; leave it to effect below to wire into flow
        setPersistenceError(err);
      }
    },
    onClose: () => {
      setPersistenceError(null);
    },
  });

  // If a save-as-new attempt failed with a CONFLICT, surface inline error in flow
  useEffect(() => {
    if (persistenceError?.code === "CONFLICT" && attemptedTitle) {
      actions.reportConflictError(attemptedTitle, persistenceError.message ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistenceError, attemptedTitle]);

  return (
    <>
      <TitleConflictDialog
        open={scene === "choose"}
        existingTitle={existingTitle}
        existingId={existingId}
        onClose={actions.cancel}
        onOverwrite={actions.chooseOverwrite}
        onSaveAsNew={actions.chooseSaveAsNew}
      />

      <OverwriteConfirmationDialog
        open={scene === "confirm-overwrite"}
        existingTitle={existingTitle}
        onClose={actions.cancel}
        onConfirm={actions.confirmOverwrite}
      />

      <SaveAsNewDialog
        open={scene === "rename"}
        onClose={actions.cancel}
        onSave={actions.submitNewTitle}
        errorMessage={errorMessage}
        initialValue={attemptedTitle ?? undefined}
      />
    </>
  );
}
