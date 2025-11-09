import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import { useThemeSheetHistory } from "../ThemeSheetV2";

export default function ThemingHistoryActions() {
  const { undo, redo, canUndo, canRedo } = useThemeSheetHistory();

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
        <UndoRounded sx={{ fontSize: 18 }} />
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
        <RedoRounded sx={{ fontSize: 18 }} />
        {/* Redo */}
      </Button>
    </ButtonGroup>
  );
}
