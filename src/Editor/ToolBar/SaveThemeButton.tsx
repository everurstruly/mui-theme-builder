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
      sx={{
        display: "inline-flex",
        alignItems: "center",
        columnGap: 1,
        lineHeight: "none",
        fontSize: ".75rem",
        fontWeight: 700,
        textAlign: "start",
        boxShadow: "none",
        textTransform: "none !important",
      }}
    >
      <SaveRounded sx={{ fontSize: 16 }} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}
