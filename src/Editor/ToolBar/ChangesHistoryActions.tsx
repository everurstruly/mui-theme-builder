import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import useEditorUiStore from "../editorUiStore";

export default function ChangesHistoryActions() {
  const changeHistory = useEditorUiStore((state) => state.markUnsavedChanges);

  return (
    <ButtonGroup size="small" sx={{}}>
      <Button
        color="inherit"
        value="undo"
        aria-label="undo"
        sx={{
          fontSize: 12,
          borderColor: "divider",
        }}
        onClick={() => changeHistory()}
      >
        <UndoRounded sx={{ fontSize: 18 }} />
        {/* Undo */}
      </Button>

      <Button
        color="inherit"
        value="redo"
        aria-label="redo"
        sx={{
          fontSize: 12,
          borderColor: "divider",
        }}
        onClick={() => changeHistory()}
      >
        <RedoRounded sx={{ fontSize: 18 }} />
        {/* Redo */}
      </Button>
    </ButtonGroup>
  );
}
