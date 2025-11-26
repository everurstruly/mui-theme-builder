import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import useDesignStore from "./currentStore";

export default function DesignChangeHistoryButtons() {
  // Use the same per-experience undo/redo API that keyboard shortcuts use
  const selected = useDesignStore((s) => s.selectedExperienceId);

  const undoVisual = useDesignStore((s) => s.undoVisualToolEdit);
  const redoVisual = useDesignStore((s) => s.redoVisualToolEdit);
  const undoCode = useDesignStore((s) => s.undoCodeOverride);
  const redoCode = useDesignStore((s) => s.redoCodeOverride);

  const canUndoVisual = useDesignStore((s) => s.visualHistoryPast.length > 0);
  const canRedoVisual = useDesignStore((s) => s.visualHistoryFuture.length > 0);
  const canUndoCode = useDesignStore((s) => s.codeHistoryPast.length > 0);
  const canRedoCode = useDesignStore((s) => s.codeHistoryFuture.length > 0);

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
