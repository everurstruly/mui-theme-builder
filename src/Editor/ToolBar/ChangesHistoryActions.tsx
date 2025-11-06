import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import useEditorUiStore from "../editorUiStore";

export default function ChangesHistoryActions() {
  const changeHistory = useEditorUiStore((state) => state.markUnsavedChanges);

  return (
    <ButtonGroup size="large">
      <Button
        color="inherit"
        value="undo"
        aria-label="undo"
        sx={{
          borderRadius: 2,
          px: 1,
        }}
        onClick={() => changeHistory()}
      >
        <UndoRounded sx={{ fontSize: 18, color: "text.primary" }} />
        {/* Undo */}
      </Button>

      <Button
        color="inherit"
        value="redo"
        aria-label="redo"
        sx={{
          borderRadius: 2,
          px: 1,
        }}
        onClick={() => changeHistory()}
      >
        <RedoRounded sx={{ fontSize: 18, color: "text.primary" }} />
        {/* Redo */}
      </Button>
    </ButtonGroup>
  );
}
