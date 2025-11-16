import { SaveRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import useEditorUiStore from "../editorStore";

export default function DesignSaveButton() {
  const isSaved = useEditorUiStore((state) => state.hasSavedChanges);
  const saveChanges = useEditorUiStore((state) => state.saveChanges);

  const handleSaveChanges = () => {
    saveChanges();
  };

  return (
    <Button
      value="save"
      aria-label="Save changes"
      // color="inherit"
      variant="outlined"
      disabled={isSaved}
      onClick={() => handleSaveChanges()}
      startIcon={<SaveRounded sx={{ fontSize: 16 }} />}
      sx={{
        borderRadius: 2.5,
      }}
    >
      {isSaved ? "Saved" : "Save as Changes"}
    </Button>
  );
}

