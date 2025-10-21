import SaveThemeButton from "./SaveThemeButton";
import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";

export default function ThemeActionsToggleGroup() {
  return (
    <>
      <ButtonGroup color="inherit">
        <SaveThemeButton />

        <Button value="undo" aria-label="undo" sx={{ px: 0 }}>
          <UndoRounded sx={{ fontSize: 20 }} />
        </Button>

        <Button value="redo" aria-label="redo" sx={{ px: 0 }}>
          <RedoRounded sx={{ fontSize: 20 }} />
        </Button>
      </ButtonGroup>
    </>
  );
}
