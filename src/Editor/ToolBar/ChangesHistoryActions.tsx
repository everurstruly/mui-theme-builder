import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import useEditorStore from "../editorStore";

export default function ChangesHistoryActions() {
  const changeHistory = useEditorStore((state) => state.markUnsavedChanges);

  return (
    <>
      <ButtonGroup color="inherit">
        <Button
          value="undo"
          aria-label="undo"
          sx={{ px: 0, borderColor: "divider" }}
          onClick={() => changeHistory()}
        >
          <UndoRounded sx={{ fontSize: 20 }} />
        </Button>

        <Button
          value="redo"
          aria-label="redo"
          sx={{ px: 0, borderColor: "divider" }}
          onClick={() => changeHistory()}
        >
          <RedoRounded sx={{ fontSize: 20 }} />
        </Button>
      </ButtonGroup>
    </>
  );
}
