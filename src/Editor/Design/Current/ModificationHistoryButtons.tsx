import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import useCurrentDesign from "./useCurrent";

export default function ModificationHistoryButtons() {
  // Use the same per-experience undo/redo API that keyboard shortcuts use
  const selected = useCurrentDesign((s) => s.selectedExperienceId);

  const undoVisual = useCurrentDesign((s) => s.undoVisualToolEdit);
  const redoVisual = useCurrentDesign((s) => s.redoVisualToolEdit);
  const undoCode = useCurrentDesign((s) => s.undoCodeOverride);
  const redoCode = useCurrentDesign((s) => s.redoCodeOverride);

  const canUndoVisual = useCurrentDesign((s) => s.visualHistoryPast.length > 0);
  const canRedoVisual = useCurrentDesign((s) => s.visualHistoryFuture.length > 0);
  const canUndoCode = useCurrentDesign((s) => s.codeHistoryPast.length > 0);
  const canRedoCode = useCurrentDesign((s) => s.codeHistoryFuture.length > 0);

  const isCodeExperience = selected === "components";

  const canUndo = isCodeExperience ? canUndoCode : canUndoVisual;
  const canRedo = isCodeExperience ? canRedoCode : canRedoVisual;

  const handleUndo = () => {
    if (isCodeExperience) undoCode();
    else undoVisual();
  };

  const handleRedo = () => {
    if (isCodeExperience) redoCode();
    else redoVisual();
  };

  return (
    <ButtonGroup size="large" aria-label="theming history actions">
      <Button
        value="undo"
        aria-label="undo"
        disabled={!canUndo}
        onClick={handleUndo}
        // variant="outlined"
        sx={{
          minWidth: 0,
          borderRadius: 2,
          px: 1,
        }}
      >
        <UndoRounded />
      </Button>

      <Button
        value="redo"
        aria-label="redo"
        disabled={!canRedo}
        onClick={handleRedo}
        // variant="outlined"
        sx={{
          minWidth: 0,
          borderRadius: 2,
          px: 1,
        }}
      >
        <RedoRounded />
      </Button>
    </ButtonGroup>
  );
}
