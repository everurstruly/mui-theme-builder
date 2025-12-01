import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import useEdit from "./useEdit";
import useEditor from "../../useEditor";

export default function ModificationHistoryButtons() {
  const selected = useEditor((s) => s.selectedExperience);

  const undoVisual = useEdit((s) => s.undoVisualToolEdit);
  const redoVisual = useEdit((s) => s.redoVisualToolEdit);
  const undoCode = useEdit((s) => s.undoCodeOverride);
  const redoCode = useEdit((s) => s.redoCodeOverride);

  const canUndoVisual = useEdit((s) => s.visualHistoryPast.length > 0);
  const canRedoVisual = useEdit((s) => s.visualHistoryFuture.length > 0);
  const canUndoCode = useEdit((s) => s.codeHistoryPast.length > 0);
  const canRedoCode = useEdit((s) => s.codeHistoryFuture.length > 0);

  const isCodeExperience = selected === "developer";

  const canUndo = isCodeExperience ? canUndoCode : canUndoVisual;
  const canRedo = isCodeExperience ? canRedoCode : canRedoVisual;

  const handleUndo = () => {
    if (isCodeExperience) {
      return undoCode();
    }
    undoVisual();
  };

  const handleRedo = () => {
    if (isCodeExperience) {
      return redoCode();
    }
    redoVisual();
  };

  return (
    <ButtonGroup variant="text" size="medium" aria-label="theming history actions">
      <Button
        value="undo"
        aria-label="undo"
        disabled={!canUndo}
        onClick={handleUndo}
        sx={{
          minWidth: 0,
          borderRadius: 2,
          px: 1,
        }}
      >
        <UndoRounded fontSize="small" />
      </Button>

      <Button
        value="redo"
        aria-label="redo"
        disabled={!canRedo}
        onClick={handleRedo}
        sx={{
          minWidth: 0,
          borderRadius: 2,
          px: 1,
        }}
      >
        <RedoRounded fontSize="small" />
      </Button>
    </ButtonGroup>
  );
}
