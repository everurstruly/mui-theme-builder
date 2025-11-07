import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import { useThemeHistory } from "../ThemeWorkspace";

export default function ChangesHistoryActions() {
  const { undo, redo, canUndo, canRedo } = useThemeHistory();

  const handleUndo = () => undo();
  const handleRedo = () => redo();

  return (
    <ButtonGroup size="large">
      <Button
        color="inherit"
        value="undo"
        aria-label="undo"
        disabled={!canUndo}
        sx={{
          borderRadius: 2,
          px: 1,
        }}
        onClick={handleUndo}
      >
        <UndoRounded sx={{ fontSize: 18, color: "text.primary" }} />
        {/* Undo */}
      </Button>

      <Button
        color="inherit"
        value="redo"
        aria-label="redo"
        disabled={!canRedo}
        sx={{
          borderRadius: 2,
          px: 1,
        }}
        onClick={handleRedo}
      >
        <RedoRounded sx={{ fontSize: 18, color: "text.primary" }} />
        {/* Redo */}
      </Button>
    </ButtonGroup>
  );
}
