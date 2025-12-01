import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import useCurrent from "./useCurrent";
import useEditor from "../../useEditor";

export default function HistoryButtons() {
  const selected = useEditor((s) => s.selectedExperience);

  const undoVisual = useCurrent((s) => s.undoVisualToolEdit);
  const redoVisual = useCurrent((s) => s.redoVisualToolEdit);
  const undoCode = useCurrent((s) => s.undoCodeOverride);
  const redoCode = useCurrent((s) => s.redoCodeOverride);

  const canUndoVisual = useCurrent((s) => s.visualHistoryPast.length > 0);
  const canRedoVisual = useCurrent((s) => s.visualHistoryFuture.length > 0);
  const canUndoCode = useCurrent((s) => s.codeHistoryPast.length > 0);
  const canRedoCode = useCurrent((s) => s.codeHistoryFuture.length > 0);

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
