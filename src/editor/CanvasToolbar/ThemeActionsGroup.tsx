import { Button, ButtonGroup } from "@mui/material";
import { SaveRounded, RedoRounded, UndoRounded } from "@mui/icons-material";

export default function ThemeActionsToggleGroup() {
  return (
    <>
      <ButtonGroup color="inherit">
        <Button
          value="save"
          size="small"
          aria-label="save changes"
          sx={{
            display: "inline-flex",
            columnGap: 1,
            lineHeight: 1,
            fontSize: ".675rem",
            textAlign: "start",
            textTransform: "none !important",
          }}
          disabled
        >
          <SaveRounded />
          Saved
          {/* <span>
          Unsaved <br />
          changes
        </span> */}
        </Button>
        <Button value="undo" aria-label="undo">
          <UndoRounded />
        </Button>

        <Button value="redo" aria-label="redo">
          <RedoRounded />
        </Button>
      </ButtonGroup>
    </>
  );
}
