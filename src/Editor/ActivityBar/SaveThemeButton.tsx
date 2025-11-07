import { SaveRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import useEditorUiStore from "../editorUiStore";

export default function SaveThemeButton() {
  const isSaved = useEditorUiStore((state) => state.hasSavedChanges);
  const saveChanges = useEditorUiStore((state) => state.saveChanges);

  const handleSaveChanges = () => {
    saveChanges();
  };

  return (
    <Button
      value="save"
      aria-label="Save changes"
      variant="outlined"
      color="inherit"
      disabled={isSaved}
      onClick={() => handleSaveChanges()}
      startIcon={<SaveRounded sx={{ fontSize: 16 }} />}
      sx={{
        borderRadius: 2,
      }}
    >
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}
