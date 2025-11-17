import { Button, ButtonGroup, Stack } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import { useThemeDesignStore } from "../Design";

export default function DesignChangeHistoryButtons() {
  // Use the same per-experience undo/redo API that keyboard shortcuts use
  const selected = useThemeDesignStore((s) => s.selectedExperienceId);

  const undoVisual = useThemeDesignStore((s) => s.undoVisualToolEdit);
  const redoVisual = useThemeDesignStore((s) => s.redoVisualToolEdit);
  const undoCode = useThemeDesignStore((s) => s.undoCodeOverride);
  const redoCode = useThemeDesignStore((s) => s.redoCodeOverride);

  const canUndoVisual = useThemeDesignStore((s) => s.visualHistoryPast.length > 0);
  const canRedoVisual = useThemeDesignStore((s) => s.visualHistoryFuture.length > 0);
  const canUndoCode = useThemeDesignStore((s) => s.codeHistoryPast.length > 0);
  const canRedoCode = useThemeDesignStore((s) => s.codeHistoryFuture.length > 0);

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
